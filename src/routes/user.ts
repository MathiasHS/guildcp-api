import { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkEventPermission } from '../middlewares/checkEventPermission';

export default [
    {
        path: "/user/self",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const user = await UserController.getSelf(res.locals.jwtPayload.userId);
                
                if (user !== -1) {
                    res.status(200).send(user);
                } else {
                    res.status(404).send();
                }
            }
        ] 
    },
    {
        path: "/user/self",
        method: "patch",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const { visible = -1, showEmail = -1, showBattleTag = -1 } = req.body;

                const userPatch = await UserController.updateUserSettingsById(res.locals.jwtPayload.userId, visible, showEmail, showBattleTag);
                if (userPatch === 1) {
                    res.status(200).send();
                } else {
                    res.status(400).send();
                }
            }
        ] 
    },
    {
        path: "/user/guilds",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const guildEvents = await UserController.getGuildsByUserId(res.locals.jwtPayload.userId);

                if (guildEvents !== -1) {
                    res.status(200).send(guildEvents);
                } else {
                    res.status(404).send();
                }
            }
        ]
    },
    {
        path: "/user/event/:id([0-9]+)",
        method: "put",
        handler: [
            checkJwt,
            checkEventPermission,
            async (req: Request, res: Response) => {
                const { attending = -1 } = req.body;

                const success = await UserController.replaceEventAttending(req.params.id, res.locals.jwtPayload.userId, attending);
                if (success == 1) {
                    res.status(200).send();
                } else {
                    res.status(400).send();
                }
            }
        ]
    },
    {
        path: "/user/events",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const guildEvents = await UserController.getGuildEventsByUserId(res.locals.jwtPayload.userId);

                if (guildEvents !== -1) {
                    res.status(200).send(guildEvents);
                } else {
                    res.status(404).send();
                }
            }
        ]
    },
    {
        path: "/user/events/statistics",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const guildEventsStats = await UserController.getGuildEventsStatsByUserId(res.locals.jwtPayload.userId);

                if (guildEventsStats !== -1) {
                    res.status(200).send(guildEventsStats);
                } else {
                    res.status(404).send();
                }
            }
        ]
    }
];