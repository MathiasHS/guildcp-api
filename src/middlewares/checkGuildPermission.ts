import { Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';

import { GuildPermission } from '../entity/GuildPermission';

export const checkGuildPermission = (roleRequired: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Get the user ID from previous middleware
        const id = res.locals.jwtPayload.userId;
        // Get the guild ID from the URL
        const guildId: number = Number.parseInt(req.params.id);
        // Get user role from the DB, if fail send 401 (unathorized)
        let guildPermissions: Array<GuildPermission>;
        try {
            guildPermissions = await getConnection()
                .getRepository(GuildPermission)
                .createQueryBuilder("guildpermission")
                .where("user_id = :id", { id: id })
                .getMany();

        } catch (id) {
            res.status(401).send();
            return;
        }
        
        // Check if the array of guild permissions contains the specified role
        let exists: boolean = false;
        // Lambda forEach loops cannot be broken
        for (let i = 0; i < guildPermissions.length; i++) {
            if (guildPermissions[i].guild_id == guildId && guildPermissions[i].permissions >= roleRequired) {
                exists = true;
                break;
            }
        }
        
        if (exists) {
            next();
        } else {
            res.status(401).send();
        } 
    }
};