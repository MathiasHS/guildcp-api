import 'reflect-metadata';
import {createConnection} from 'typeorm';
import express from 'express';
import middlewares from './middlewares';
import { applyMiddleware, applyRoutes } from './utils';
import routes from './routes/index';
import errorHandlers from './middlewares/errorHandlers';
import logger from './utils/logger';

process.on("uncaughtException", e => {
    logger.error(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    if (e)
        logger.error(e);
        
    process.exit(1);
});

createConnection().then(async connection => {

    // Create express app
    const app = express();
    
    // Apply middlewares
    applyMiddleware(middlewares, app);

    // Apply routes
    applyRoutes(routes, app);

    // Error handling
    applyMiddleware(errorHandlers, app);

    // Start express server
    app.listen(3000);

    logger.info("Express server has started on port 3000. (NODE_ENV: " + process.env.NODE_ENV + ")");

}).catch(error => logger.error(error));
