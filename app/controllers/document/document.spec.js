import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Document ]', () => {
    let server;
    let part;
    let documentGb;
    let id;
    let inOutId;
    let statusId;

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

    /** 공통코드(공종, 구분) 생성 및 추가 */
    describe('Cmcode preparation', () => {
        let major;

        it('add Part', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0001',
                    cdFName: '공종'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdFName).to.equal('공종');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '기계'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    part = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add documentGb', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0002',
                    cdFName: '구분'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdFName).to.equal('구분');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '공통'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    documentGb = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });
    });

    describe('GET /documents/search', () => {
        it('post search documents', (done) => {
            request(server)
                .post('/api/documents/search?page=1')
                .send({
                    documentGb: '',
                    documentNumber: 'G-001',
                    documentTitle: '',
                    documentRev: 'A',
                    documentStatus: '01',
                    deleteYn: 'NO',
                    holdYn: 'NO',
                    delayGb: '01',
                    regDtSta: '2000-01-01',
                    regDtEnd: '9999-12-31',
                    level: 0
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(0);
                    done();
                });
        });
    });

    describe('POST /documents', () => {
        it('add document', (done) => {
            request(server)
                .post('/api/documents')
                .send({
                    vendor: '5d33ef877cceb91244d16fdd',
                    part: part,
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Inspection Report',
                    documentGb: documentGb,
                    documentRev: 'A',
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

    describe('GET /documents/search', () => {
        it('post search documents', (done) => {
            request(server)
                .post('/api/documents/search?page=1')
                .send({
                    documentGb: '',
                    documentNumber: 'G-001',
                    documentTitle: '',
                    documentRev: 'A',
                    documentStatus: '01',
                    deleteYn: 'NO',
                    holdYn: 'NO',
                    delayGb: '01',
                    regDtSta: '2000-01-01',
                    regDtEnd: '9999-12-31',
                    level: 0
                })
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
                    part: '5d33ef877cceb91244d16fd1',
                    documentNumber: 'ABC-DEF-G-001-003',
                    documentTitle: 'Drawing',
                    documentGb: '5d33ef877cceb91244d16fd2',
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

    describe('PATCH /documents/delete', () => {
        it('delete documents', (done) => {
            request(server)
                .patch('/api/documents/delete')
                .send({
                    ids: [
                        id
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data[0].deleteYn.reason).to.equal('일괄 삭제');
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

                    let inOut = ctx.body.data.documentInOut;
                    let status = ctx.body.data.documentStatus;

                    inOutId = inOut[inOut.length - 1]._id;
                    statusId = status[status.length - 1]._id;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.documentInOut).have.length(10);
                    expect(ctx.body.data.documentStatus).have.length(10);
                    done();
                });
        });
    });

    describe('PATCH /api/documents/:id/inout/delete', () => {
        it('Delete In/Out document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout/delete`)
                .send({
                    targetId: inOutId
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentInOut).have.length(9);
                    done();
                });
        });

        it('Delete Status document', (done) => {
            request(server)
                .patch(`/api/documents/${id}/inout/delete`)
                .send({
                    targetId: statusId
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documentStatus).have.length(9);
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