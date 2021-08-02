import { Request, Response, NextFunction } from 'express';

import { GuildPermission } from '../entity/GuildPermission';
import { getConnection } from 'typeorm';
import { GuildEvent } from '../entity/GuildEvent';
import logger from '../utils/logger';

export const checkEventPermission = async (req: Request, res: Response, next: NextFunction) => {
    // Get the user ID from previous middleware
    const id = res.locals.jwtPayload.userId;
    // Get the event ID from the URL
    const eventId = req.params.id;
    // Get user role from the DB, if fail send 401 (unathorized)
    let guildPermission: GuildPermission | undefined;
    try {
        guildPermission = await getConnection()
            .getRepository(GuildPermission)
            .createQueryBuilder("gp")
            .innerJoin(GuildEvent, "ge", "ge.guild_id = gp.guild_id")
            .where("gp.user_id = :id AND ge.id = :event_id", { id: id, event_id: eventId })
            .getOne();
    } catch (id) {
        res.status(401).send();
        return;
    }

    if (guildPermission) {
        next();
    } else {
        res.status(401).send();
    } 
}