import Router from 'koa-router';
import cmcode from 'controllers/cmcode';
import document from 'controllers/document';
import vendor from 'controllers/vendor';
import documentIndex from 'controllers/documentIndex';

const api = new Router();

api.use('/cmcodes', cmcode.routes());
api.use('/documents', document.routes());
api.use('/vendors', vendor.routes());
api.use('/documentindex', documentIndex.routes());

export default api;