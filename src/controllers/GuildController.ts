import { getRepository } from 'typeorm';
import { Guild } from "../entity/Guild";
import { GuildPermission } from '../entity/GuildPermission'
import { User } from '../entity/User';
import { GuildEvent } from '../entity/GuildEvent';
import { GuildEventAttendance } from '../entity/GuildEventAttendance'
import logger from '../utils/logger';

class GuildController {

    /**
     * @returns Guild if found, -1 if not
     */
    static getOneById = async (id: any) => {
        const guildRepository = getRepository(Guild);
        // Get guilds from the database
        try {
            const guilds = await guildRepository.findOneOrFail(id);
            
            return guilds;
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns Guild members if found, -1 if not
     */
    static getMemberById = async (id: any) => {
        // Get guild members from the database
        try {
            const guildMembers = await getRepository(GuildPermission)
                .createQueryBuilder("gp")
                .leftJoin(User, "user", "user.id = gp.user_id")
                .leftJoin(Guild, "guild", "guild.id = :id", { id: id })
                //.addSelect("u.username", "g.name")
                .select(["user.username", "guild.name", "user.battletag", "guild.region", "gp.permissions"])
                //.addSelect("u.username", "username")
                .where("gp.guild_id = :id", { id: id })
                .getRawMany();

            return guildMembers;
        } catch (error) {
            return -1;
        }
    }

    /**
     * @returns Guild events if found, -1 if not
     */
    static getGuildEventsById = async (id: any) => {
        // Get guild events from the database
        try {
            const guildEvents = await getRepository(GuildEvent)
                .createQueryBuilder("ge")
                .leftJoin(Guild, "guild", "guild.id = :id", { id: id })
                .select(["ge.name", "ge.description", "ge.time"])
                .addSelect(subQuery => {
                    return subQuery
                        .select("COALESCE(SUM(gpa.attending), 0)")
                        .from(GuildEventAttendance, "gpa")
                        .where("gpa.event_id = ge.id");
                }, "attending")
                .where("guild_id = :id", { id: id })
                .getRawMany();

            logger.debug(guildEvents);
            return guildEvents;
        } catch (error) {
            return -1;
        }
    }
};

export default GuildController;