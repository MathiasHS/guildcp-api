import { Request, Response } from 'express';
import GuildController from '../controllers/GuildController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkGuildPermission } from '../middlewares/checkGuildPermission';

export default [
    {
        path: "/guild/:id([0-9]+)",
        method: "get",
        handler: [
            checkJwt,
            checkGuildPermission(1),
            async (req: Request, res: Response) => {
                const guildRepository = await GuildController.getOneById(req.params.id);

                if (guildRepository !== -1) {
                    res.status(200).send(guildRepository);
                } else {
                    res.status(404).send();
                }
            }
        ]
    },
    {
        path: "/guild/:id([0-9]+)/members",
        method: "get",
        handler: [
            checkJwt,
            checkGuildPermission(1),
            async (req: Request, res: Response) => {
                const guildMembers = await GuildController.getMemberById(req.params.id);

                if (guildMembers !== -1) {
                    res.status(200).send(guildMembers);
                } else {
                    res.status(404).send();
                }
            }
        ]
    },
    {
        path: "/guild/:id([0-9]+)/events",
        method: "get",
        handler: [
            checkJwt,
            checkGuildPermission(1),
            async (req: Request, res: Response) => {
                const guildEvents = await GuildController.getGuildEventsById(req.params.id);
                
                if (guildEvents !== -1) {
                    res.status(200).send(guildEvents);
                } else {
                    res.status(404).send();
                }
            }
        ]
    }
];
