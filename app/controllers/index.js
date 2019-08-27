import Router from 'koa-router';
import cmcode from 'controllers/cmcode';
import document from 'controllers/document';
import vendor from 'controllers/vendor';
import documentIndex from 'controllers/documentIndex';
import documentInfo from 'controllers/documentInfo';
import vendorLetter from 'controllers/vendorLetter';

const api = new Router();

api.use('/cmcodes', cmcode.routes());
api.use('/documents', document.routes());
api.use('/vendors', vendor.routes());
api.use('/documentindexes', documentIndex.routes());
api.use('/documentinfos', documentInfo.routes());
api.use('/vendorletters', vendorLetter.routes());

export default api;