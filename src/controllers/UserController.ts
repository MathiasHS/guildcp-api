import { Request, Response } from 'express';
import { getConnection, getRepository, getManager } from 'typeorm';
import { validate } from 'class-validator';

import {User} from "../entity/User";
import { Settings } from '../entity/Settings';
import { GuildEvent } from '../entity/GuildEvent';
import { Guild } from '../entity/Guild';
import { GuildPermission } from '../entity/GuildPermission';
import logger from '../utils/logger';
import { GuildEventAttendance } from '../entity/GuildEventAttendance';

class UserController {
    
    /**
     * @returns User if found, -1 if not
     */
    static getSelf = async (id: any) => {
        // Get the user from the database
        try {
            // Select everything except password and accounts_setting.user_id
            const user = await getRepository(User)
                .createQueryBuilder("user")
                .leftJoin(Settings, "settings", "user_id = :user_id", { user_id: id })
                .select(["username", "region", "email", "battletag", "joined_date", "last_login_date", "last_sync_date"])
                .addSelect("visible", "setting_visible")
                .addSelect("show_email", "setting_show_email")
                .addSelect("show_battletag", "setting_show_battletag")
                .addSelect("manage_guild", "setting_manage_guild")
                .where("id = :id", { id: id })
                .getRawOne();

            return user;  
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns 1 if successful, 0 if not
     */
    static updateUserSettingsById = async (id: any, visible: any, showEmail: any, showBattleTag: any) => {
        if (visible == -1 || showEmail == -1 || showBattleTag == -1)
            return 0;

        try {
            await getConnection()
                .createQueryBuilder()
                .update(Settings)
                .set({ visible: visible, show_email: showEmail, show_battletag: showBattleTag })
                .where("user_id = :id", { id: id })
                .execute();
            return 1;
        } catch (error) {
            return 0;
        }
    }

    /**
     * @returns User guilds if found, -1 if not
     */
    static getGuildsByUserId = async (id: any) => {
        // Get the user guilds from the database
        try {
            const guilds = await getRepository(Guild)
                .createQueryBuilder("guild")
                .innerJoin(GuildPermission, "gp", "guild.id = gp.guild_id")
                .where("gp.user_id = :id AND gp.permissions > 0", { id: id })
                .select(["guild.id", "guild.region", "guild.name", "guild.realm", "guild.level", "guild.faction",
                    "guild.achievement_points", "guild.icon", "guild.icon_color", "guild.icon_color_id", 
                    "guild.border", "guild.border_color", "guild.border_color_id", "guild.background_color_id",
                    "guild.owner_id", "guild.last_modified"])
                .addSelect("gp.permissions", "guild_user_permissions")
                .getRawMany();

            return guilds;
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns Guild events if found, -1 if not
     */
    static getGuildEventsByUserId = async (id: any) => {
        // Get user guild events from the database
        try {
            const guildEvents = await getRepository(GuildEvent)
                .createQueryBuilder("event")
                .innerJoin(Guild, "guild", "guild.id = event.guild_id")
                .innerJoin(GuildPermission, "gp", "event.guild_id = gp.guild_id")
                .addSelect(subQuery => {
                    return subQuery
                        .select("gpa.attending")
                        .from(GuildEventAttendance, "gpa")
                        .where("gpa.event_id = event.id AND gpa.user_id = gp.user_id")
                }, "event_user_attending")
                .addSelect("guild.name", "event_guild_name")
                .where("gp.user_id = :id", { id: id })
                .getRawMany();

            logger.debug(guildEvents);
            return guildEvents;
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns Amount of signed guild events if found, -1 if not
     */
    static getGuildEventsStatsByUserId = async (id: any) => {
        // Get user guild event statistics from the database
        try {
            const guildEventsStats = await getRepository(GuildEventAttendance)
                .createQueryBuilder("event_attendance")
                .select("COUNT(*)", "all")
                .addSelect("SUM(CASE WHEN attending = 1 THEN 1 ELSE 0 END)", "accepted")
                .addSelect("SUM(CASE WHEN attending = 0 THEN 1 ELSE 0 END)", "declined")
                .where("user_id = :id", { id: id })
                .getRawOne();

            return guildEventsStats;
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns 1 if executed, 0 if not
     */
    static replaceEventAttending = async (event_id: any, user_id: any, attending: number) => {
        if (attending == -1)
            return 0;

        try {
            // TypeORM does not support upsert if primary key is combined of multiple columns (onconflict)
            await getManager()
                .query(
                    "INSERT INTO `guilds_events_attendance` \
                    (`event_id`, `user_id`, `attending`) \
                    VALUES (?, ?, ?) \
                    ON DUPLICATE KEY UPDATE `attending` = ?",
                    [event_id, user_id, attending, attending]
                );

            return 1;
        } catch (error) {
            return 0;
        }
    }

    /** @deprecated Express needs to be isolated, controller should not know req, res */
    static listAll = async (req: Request, res: Response) => {
        // Get user from the database
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username"] // We don't want to send passwords in the response
        });  
        
        // Send the users object in response
        res.send(users);
    }
    
    /** @deprecated Express needs to be isolated, controller should not know req, res */
    static getOneById = async (req: Request, res: Response) => {
        // Get the ID from the URL
        const id = req.params.id;
        
        // Get the user from the database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username"]
            });
        } catch (error) {
            res.status(404).send("User not found");
        }
    }
    
    /** @deprecated Express needs to be isolated, controller should not know req, res */
    static editUser = async (req: Request, res: Response) => {
        // Get the ID from the URL
        const id = req.params.id;

        // Get the values from the body
        const { username } = req.body;

        // Get the user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id, {
                select: ["id", "username"]
            });
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        // Validate the new values on the model
        user.username = username;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Try to safe, if it fails, it means the username is already in use, then send 409 (Conflict)
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("Username is already in use");
            return;
        }

        // After all, send 204 (no content, but accepted) response
        res.status(204).send();
    };
};

export default UserController;