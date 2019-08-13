import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [Document Index]', () => {
    let server;
    let vendorId;
    let editVendorId;
    let id;
    let documentInfoId;

    before((done) => {
        db.connect().then((type) => {
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

    describe('Vendor preparation', () => {
        let major;
        let part;

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

                    expect(ctx.body.data.cdMajor).to.equal('0001');
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

        it('add vendor', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part,
                    partNumber: 'R-002',
                    vendorName: '주연테크',
                    officialName: 'JYR',
                    effStaDt: '2019-07-10',
                    effEndDt: '2020-04-02',
                    persons: [
                        {
                            name: '이성민',
                            position: '사원',
                            email: 'lll2slll@naver.com',
                            contactNumber: '010-4143-3664',
                            task: '개발'
                        },
                        {
                            name: '김준철',
                            position: '대리',
                            email: 'jsteel@naver.com',
                            contactNumber: '010-4421-5238',
                            task: '개발'
                        },

                        {
                            name: '박희영',
                            position: '사원',
                            email: 'phzer0o@naver.com',
                            contactNumber: '010-2361-1642',
                            task: '개발'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    vendorId = ctx.body.data._id;

                    expect(ctx.body.data.part._id).to.equal(part);
                    expect(ctx.body.data.partNumber).to.equals('R-002');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });

        it('add vendor for edit', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
                    officialName: 'SMT',
                    effStaDt: '2019-07-10',
                    effEndDt: '2020-04-02',
                    persons: [
                        {
                            name: '이성민',
                            position: '사원',
                            email: 'lll2slll@naver.com',
                            contactNumber: '010-4143-3664',
                            task: '개발'
                        },
                        {
                            name: '김준철',
                            position: '대리',
                            email: 'jsteel@naver.com',
                            contactNumber: '010-4421-5238',
                            task: '개발'
                        },

                        {
                            name: '박희영',
                            position: '사원',
                            email: 'phzer0o@naver.com',
                            contactNumber: '010-2361-1642',
                            task: '개발'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    editVendorId = ctx.body.data._id;

                    expect(ctx.body.data.part._id).to.equal(part);
                    expect(ctx.body.data.partNumber).to.equals('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('POST /documentindex/readexcel', () => {
        it('read excel', (done) => {
            request(server)
                .post('/api/documentindex/readexcel')
                .set('Content-Type', 'mulitpart/form-data')
                .attach('indexes', 'upload/test.xlsx')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(5);
                    done();
                });
        });
    });

    describe('POST /documentindex', () => {
        it('create document index', (done) => {
            request(server)
                .post('/api/documentindex')
                .send({
                    vendor: vendorId,
                    list: [
                        {
                            number: 'VP-NCC-R-001-001',
                            title: 'Vendor Print Index & Schedule',
                            plan: '2019-09-23'
                        },
                        {
                            number: 'VP-NCC-R-001-002',
                            title: 'Sub-Vendor List',
                            plan: '2019-09-23'
                        },
                        {
                            number: 'VP-NCC-R-001-003',
                            title: 'Overall Schedule',
                            plan: '2019-09-23'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;
                    documentInfoId = ctx.body.data.list[0]._id;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    done();
                });
        });
    });

    describe('GET /documentIndex', () => {
        it('get documentIndexes', (done) => {
            request(server)
                .get('/api/documentIndex?page=1')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).instanceOf(Array);
                    expect(ctx.body.data).have.length(1);
                    expect(ctx.body.data[0].vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data[0].vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data[0].list).have.length(3);
                    expect(ctx.body.data[0].list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    done();
                });
        });
    });

    describe('GET /documentindex/:id', () => {
        it('get documentIndex', (done) => {
            request(server)
                .get(`/api/documentindex/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    done();
                });
        });
    });

    describe('PATCH /documentindex/:id/documentinfo/delete', () => {
        it('delete documentInfo', (done) => {
            request(server)
                .patch(`/api/documentindex/${id}/documentinfo/delete`)
                .send({
                    targetId: documentInfoId,
                    reason: 'API 테스트 - 삭제'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].removeYn.yn).to.equal('YES');
                    expect(ctx.body.data.list[0].removeYn.reason).to.equal('API 테스트 - 삭제');
                    done();
                });
        });
    });

    describe('PATCH /documentIndex/:id/edit', () => {
        it('edit documentIndex', (done) => {
            request(server)
                .patch(`/api/documentindex/${id}/edit`)
                .send({
                    vendor: editVendorId,
                    list: []
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendor.vendorName).to.equal('성민테크');
                    expect(ctx.body.data.list).have.length(0);
                    done();
                });
        });
    });

    describe('PATCH /documentindex/:id/delete', () => {
        it('delete documentIndex', (done) => {
            request(server)
                .patch(`/api/documentindex/${id}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(0);
                    done();
                });
        });
    });
});