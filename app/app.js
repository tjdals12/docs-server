import Koa from 'koa';
import requestId from 'koa-requestid';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import swaggerSetting from 'swagger';
import loggerSetting from 'logger';

const app = new Koa();

app.use(requestId());
app.use(bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '10mb',
    formLimit: '10mb'
}));

app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
}));
app.use(helmet());
loggerSetting(app);
swaggerSetting(app);

export default app;
