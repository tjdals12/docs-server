import Router from 'koa-router';
import * as documentCtrl from './document.ctrl';

const document = new Router();

document.post('/add', documentCtrl.add);

export default document;