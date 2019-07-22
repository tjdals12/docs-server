import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('[ Document ]', () => {
    let server;
    let id;

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

                    id = ctx.body.data._id;

                    expect(ctx.body.data.documentNumber).to.equal('ABC-DEF-G-001-003');
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

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('DELETE /documents', () => {
        it('delete document', (done) => {
            request(server)
                .delete('/api/documents')
                .send({
                    id: id,
                    reason: 'mocha 테스트 삭제'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.deleteYn.yn).to.equal('YES');
                    done();
                });
        });
    });

    describe('PATCH /documents', () => {
        it('In/Out document - 내부 검토요청', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '10',
                    status: '10'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 검토완료', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '20',
                    status: '11',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 검토요청', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '30',
                    officialNumber: 'ABC-DEF-T-R-001-001',
                    status: '20',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 검토완료', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '40',
                    officialNumber: 'DEF-ABC-T-R-001-001',
                    status: '21',
                    resultCode: '02'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 재검토요청', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '12',
                    status: '30'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 내부 재검토완료', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '22',
                    status: '31',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 재검토요청', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '32',
                    officialNumber: 'ABC-DEF-T-R-001-002',
                    status: '40',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 사업주 재검토완료', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '42',
                    officialNumber: 'DEF-ABC-T-R-001-002',
                    status: '41',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('In/Out document - 업체 회신', (done) => {
            request(server)
                .patch('/api/documents')
                .send({
                    id: id,
                    inOutGb: '90',
                    officialNumber: 'ABC-GEF-T-R-001-001',
                    status: '90',
                    resultCode: '01',
                    replyCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });
});