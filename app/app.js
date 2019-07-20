import Koa from 'koa';
import requestId from 'koa-requestid';
import bodyParser from 'koa-bodyparser';
import fs from 'fs';
import moment from 'moment';
import morgan from 'koa-morgan';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';

const app = new Koa();

app.use(requestId());
app.use(bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '10mb',
    formLimit: '10mb'
}));
app.use(morgan('combined', { stream: fs.createWriteStream(__dirname + `access_${moment().format('YYYYMMDD')}.log`, { flags: 'a' }) }));
app.use(morgan('combined', { stream: fs.createWriteStream(__dirname + `error_${moment().format('YYYYMMDD')}.log`, { flags: 'a' }) }));
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
}));
app.use(helmet());

export default app;
