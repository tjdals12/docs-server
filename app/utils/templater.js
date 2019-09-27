import path from 'path';
import fs from 'fs';
import stream from 'stream';
import Pizzip from 'pizzip';
import Docxtemplater from 'docxtemplater';

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식에 데이터 입혀서 반환
 * @param       {Object} param
 */
export const makeFile = (param) => {
    // ! 파일 경료 변경 해야함. (Template에서 조회)

    const doc = new Docxtemplater();
    doc.loadZip(new Pizzip(fs.readFileSync(path.resolve('upload/template.docx'), 'binary')));
    doc.setData(param);
    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    const bufferStream = new stream.PassThrough();

    return bufferStream.end(new Buffer.from(buf));
};