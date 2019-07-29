import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('[ Document ]', () => {
    let server;
    let id;

    before((done) => {
        db.connect().then(type => {
            console.log(`Connected ${type}`);

            server = app.listen(4000, () => {
                console.log('listening on port 4000');
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

    describe('POST /documents', () => {
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

    describe('GET /documents/:id', () => {
        it('get document', (done) => {
            request(server)
                .get(`/api/documents/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('PATCH /documents/:id/edit', () => {
        it('edit document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/edit`)
                .send({
                    vendor: '5d33ef877cceb91244d16fdd',
                    part: '99',
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Drawing',
                    documentGb: '01',
                    documentRev: '01',
                    officialNumber: 'ABC-DEF-T-G-001-001',
                    memo: '최초 접수'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentTitle).to.equal('Drawing');
                    done();
                });
        });
    });

    describe('PATCH /documents/:id/delete', () => {
        it('delete document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/delete`)
                .send({
                    yn: 'YES',
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

    describe('PATCH /documents/:id/inout', () => {
        it('In/Out document - 내부 검토요청', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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
                .patch(`/api/documents/${id}/inout`)
                .send({
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

    describe('PATCH /api/documets/:id/hold', () => {
        it('hold document - 보류', (done) => {
            request(server)
                .patch(`/api/documents/${id}/hold`)
                .send({
                    yn: 'YES',
                    reason: 'API 테스트 - 보류'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });

        it('hold document - 보류 취소', (done) => {
            request(server)
                .patch(`/api/documents/${id}/hold`)
                .send({
                    yn: 'NO',
                    reason: 'API 테스트 - 보류 취소'
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