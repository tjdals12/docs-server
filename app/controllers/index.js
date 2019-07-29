import Router from 'koa-router';
import cmcode from 'controllers/cmcode';
import document from 'controllers/document';

const api = new Router();

api.use('/cmcodes', cmcode.routes());
api.use('/documents', document.routes());

export default api;