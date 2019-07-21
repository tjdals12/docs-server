import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('[ Document ]', () => {
    let server;

    before((done) => {
        db.connect().then(type => {
            console.log(`Conneted ${type}`);

            server = app.listen(4000, () => {
                console.log('listening on port');
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

    describe('POST /documents/add', () => {
        it('add document', (done) => {
            request(server)
                .post('/api/documents')
                .send({
                    vendor: '5d33ef877cceb91244d16fdd',
                    part: '99',
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Inspection Report',
                    documentGb: '01',
                    documentRev: '01',
                    officialNumber: 'ABC-DEF-T-G-001-001',
                    memo: '최초 접수'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.documentNumber).to.equal('ABC-DEF-G-001-003');
                    done();
                });
        });
    });

    describe('GET /documents', () => {
        it('get documents', (done) => {
            request(server)
                .get('/api/documents')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body).have.length(1);
                    done();
                });
        });
    });
});