import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Document Index ]', () => {
    let server;
    let vendorId;
    let documentGb;
    let editVendorId;
    let id;
    let documentInfoId1;
    let documentInfoId2;

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
                    itemName: 'Chemical Injection Pump',
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
                    expect(ctx.body.data.itemName).to.equal('Chemical Injection Pump');
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
                    itemName: 'Centrifugal Water Pump',
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
                    expect(ctx.body.data.itemName).to.equal('Centrifugal Water Pump');
                    done();
                });
        });
    });

    describe('POST /documentindexes/readexcel', () => {
        it('read excel', (done) => {
            request(server)
                .post('/api/documentindexes/readexcel')
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

    describe('POST /documentindexes', () => {
        it('create document index', (done) => {
            request(server)
                .post('/api/documentindexes')
                .send({
                    vendor: vendorId,
                    list: [
                        {
                            documentNumber: 'VP-NCC-R-001-001',
                            documentTitle: 'Vendor Print Index & Schedule',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-002',
                            documentTitle: 'Sub-Vendor List',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-003',
                            documentTitle: 'Overall Schedule',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;
                    documentInfoId1 = ctx.body.data.list[0]._id;
                    documentInfoId2 = ctx.body.data.list[1]._id;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].documentGb.cdSName).to.equal('공통');
                    done();
                });
        });
    });

    describe('GET /documentindexes', () => {
        it('get documentIndexes', (done) => {
            request(server)
                .get('/api/documentindexes?page=1')
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

    describe('GET /documentindexes/forselect', () => {
        it('add documentIndexes for select', (done) => {
            request(server)
                .get('/api/documentindexes/forselect')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).instanceOf(Array);
                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /documentindexes/search', () => {
        it('search documentIndexes', (done) => {
            request(server)
                .post('/api/documentindexes/search?page=1')
                .send({
                    part: '',
                    partNumber: 'R-002',
                    officialName: 'JYR',
                    vendorName: '테크'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data[0].vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data[0].vendor.officialName).to.equal('JYR');
                    expect(ctx.body.data[0].vendor.vendorName).to.include('테크');
                    done();
                });
        });
    });

    describe('POST /documentindexes/:id/add', () => {
        it('add documentInfos', (done) => {
            request(server)
                .patch(`/api/documentindexes/${id}/add`)
                .send({
                    list: [
                        {
                            documentNumber: 'VP-NCC-R-001-004',
                            documentTitle: 'Inspection Test & Plan',
                            plan: '2019-09-11'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-005',
                            documentTitle: 'Inspection Test & Procedure',
                            plan: '2019-09-11'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.list).have.length(5);
                    expect(ctx.body.data.list[3].documentNumber).to.equal('VP-NCC-R-001-004');
                    expect(ctx.body.data.list[4].documentNumber).to.equal('VP-NCC-R-001-005');
                    done();
                });
        });
    });

    describe('GET /documentindexes/:id', () => {
        it('get documentIndex', (done) => {
            request(server)
                .get(`/api/documentindexes/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(5);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    done();
                });
        });
    });

    describe('GET /documentindexes/:id/trackingdocument', () => {
        it('get documentIndex detail', (done) => {
            request(server)
                .get(`/api/documentindexes/${id}/trackingdocument`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).instanceOf(Array);
                    done();
                });
        });
    });

    describe('PATCH /documentindexes/:id/documentinfo/delete', () => {
        it('delete documentInfo', (done) => {
            request(server)
                .patch(`/api/documentindexes/${id}/documentinfo/delete`)
                .send({
                    targetId: documentInfoId1,
                    reason: 'API 테스트 - 삭제'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(5);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].removeYn.yn).to.equal('YES');
                    expect(ctx.body.data.list[0].removeYn.reason).to.equal('API 테스트 - 삭제');
                    done();
                });
        });
    });

    describe('PATCH /documentindexes/:id/edit', () => {
        it('edit documentIndex', (done) => {
            request(server)
                .patch(`/api/documentindexes/${id}/edit`)
                .send({
                    vendor: editVendorId,
                    list: [
                        {
                            _id: documentInfoId1,
                            documentNumber: 'VP-NCC-R-001-001',
                            documentTitle: 'VPIS',
                            documentGb: documentGb,
                            plan: '2019-08-23'
                        },
                        {
                            documentNumber: 'VP-NCC-R-001-003',
                            documentTitle: 'Overall Schedule',
                            documentGb: documentGb,
                            plan: '2019-09-23'
                        }
                    ],
                    deleteList: [
                        {
                            _id: documentInfoId2,
                            documentNumber: 'VP-NCC-R-001-002',
                            documentTitle: 'Sub-Vendor List',
                            plan: '2019-09-23'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    let edited = ctx.body.data.list.filter(document => document._id === documentInfoId1);
                    let deleted = ctx.body.data.list.filter(document => document._id === documentInfoId2);

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendor.vendorName).to.equal('성민테크');
                    expect(edited[0].documentTitle).to.equal('VPIS');
                    expect(deleted[0].removeYn.yn).to.equal('YES');
                    expect(ctx.body.data.list).have.length(6);
                    done();
                });
        });
    });

    describe('PATCH /documentindexes/:id/delete', () => {
        it('delete documentIndex', (done) => {
            request(server)
                .patch(`/api/documentindexes/${id}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(0);
                    done();
                });
        });
    });
});