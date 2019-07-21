import Router from 'koa-router';
import document from 'controllers/document';

const api = new Router();

api.use('/documents', document.routes());

export default api;