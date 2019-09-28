import path from 'path';
import fs from 'fs';
import stream from 'stream';
import Pizzip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import AWS from 'aws-sdk';

AWS.config.loadFromPath('app/configs/awsconfig.json');
const s3 = new AWS.S3();

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식에 데이터 입혀서 반환
 * @param       {String} template
 * @param       {Object} param
 */
export const makeFile = (template, param) => {
    // ! S3에서 파일 받아와야함.

    const doc = new Docxtemplater();
    doc.loadZip(new Pizzip(fs.readFileSync(path.resolve('upload/template.docx'), 'binary')));
    doc.setData(param);
    doc.render();

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    const bufferStream = new stream.PassThrough();

    return bufferStream.end(new Buffer.from(buf));
};