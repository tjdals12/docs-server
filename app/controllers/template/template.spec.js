import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Template ]', () => {
    let server;
    let templateGb;
    let id;

    before((done) => {
        db.connect().then(type => {
            console.log(`Connected ${type}`);

            server = app.listen(4000, () => {
                console.log('Server localhost:4000');
                done();
            });
        });
    });

    after((done) => {
        db.close()
            .then(() => {
                server.close();
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    describe('cmcode preparation', () => {
        let major;

        it('add Part', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0004',
                    cdFName: '양식 구분'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdMajor).to.equal('0004');
                    expect(ctx.body.data.cdFName).to.equal('양식 구분');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: 'TR'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    templateGb = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });
    });

    describe('POST /templates', () => {
        it('add template', (done) => {
            request(server)
                .post('/api/templates')
                .send({
                    templateGb: templateGb,
                    templateName: 'Transmittal 양식',
                    templateType: 'docx',
                    templatePath: 'https://example.storage.com/sample.docx',
                    templateDescription: '사업주 송부용 Transmittal 양식'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.templateName).to.equal('Transmittal 양식');
                    expect(ctx.body.data.templateType).to.equal('docx');
                    expect(ctx.body.data.templatePath).to.equal('https://example.storage.com/sample.docx');
                    expect(ctx.body.data.templateDescription).to.equal('사업주 송부용 Transmittal 양식');
                    done();
                });
        });
    });

    describe('GET /templates', () => {
        it('get templates', (done) => {
            request(server)
                .get('/api/templates')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /templates/:id', () => {
        it('get template', (done) => {
            request(server)
                .get(`/api/templates/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });
});