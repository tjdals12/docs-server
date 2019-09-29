import stream from 'stream';
import Pizzip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import AWS from 'aws-sdk';

// TODO: upload.js 에서도 s3를 사용함. > 리팩토링 필요
const s3 = new AWS.S3();

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식에 데이터 입혀서 반환
 * @param       {String} template
 * @param       {Object} param
 */
export const makeFile = async (template, param, callback) => {
    s3.getObject({ Bucket: 'docs-server', Key: template.split('/').pop() }, (err, data) => {
        if (err) throw err;

        const doc = new Docxtemplater();

        /**
         * Local에서 받아올 경우
         * doc.loadZip(new Pizzip(fs.readFileSync(path.resolve('upload/template.docx'))));
         */

        doc.loadZip(new Pizzip(data.Body));
        doc.setData(param);
        doc.render();

        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        const bufferStream = new stream.PassThrough();

        callback(bufferStream.end(new Buffer.from(buf)));
    });
};