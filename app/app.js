import '@babel/polyfill';

import Koa from 'koa';
import errorHandler from 'middlewares/errorHandler';
import responseHandler from 'middlewares/responseHandler';
import requestId from 'koa-requestid';
import serve from 'koa-static-server';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import swaggerSetting from 'swagger';
import loggerSetting from 'logger';
import router from 'routes';

const app = new Koa();

app.use(responseHandler());
app.use(errorHandler());
app.use(requestId());
app.use(serve({ rootDir: 'upload', rootPath: '/upload' }));
app.use(bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '10mb',
    formLimit: '10mb'
}));

app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id', 'Last-Page']
}));
app.use(helmet());
loggerSetting(app);
swaggerSetting(app);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
