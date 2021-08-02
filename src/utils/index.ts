import { Router, Request,Response, NextFunction } from 'express';
import logger from './logger';

type Wrapper = ((router: Router) => void);

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

type Route = {
    path: string,
    method: string,
    handler: Handler | Handler[]
}

export const applyMiddleware = (
    middleware: Wrapper[],
    router: Router
    ) => {
    for (const func of middleware) {
        func(router);
    }
};

// Function for applying routes, used to isolate express as much as possible
export const applyRoutes = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method](path, handler);
        logger.info(`Applying route: ${route.path}`);
    }
}