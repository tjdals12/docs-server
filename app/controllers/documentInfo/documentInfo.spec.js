import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Document Info ]', () => {
    let server;
    let id;
    let vendorId;

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
        let documentGb;

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

                    id = ctx.body.data.list[0]._id;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-002');
                    expect(ctx.body.data.vendor.vendorName).to.equal('주연테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].documentGb.cdSName).to.equal('공통');
                    done();
                });
        });
    });

    describe('GET /documentinfos', () => {
        it('get documentInfos', (done) => {
            request(server)
                .get('/api/documentinfos')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).to.have.length(3);
                    done();
                });
        });
    });

    describe('GET /documentinfos/:id', () => {
        it('get documentInfo', (done) => {
            request(server)
                .get(`/api/documentinfos/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.documentTitle).to.equal('Vendor Print Index & Schedule');
                    done();
                });
        });
    });

    describe('GET /documentinfos/search', () => {
        it('get search documentInfos', (done) => {
            request(server)
                .post('/api/documentinfos/search')
                .send({
                    vendor: '',
                    documentNumber: '',
                    documentTitle: 'Schedule',
                    documentGb: ''
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(2);
                    done();
                });
        });
    });

    describe('GET /documentinfos/{vendor}/latest', () => {
        it('get latest documents', (done) => {
            request(server)
                .get(`/api/documentinfos/${vendorId}/latest`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(3);
                    done();
                });
        });
    });
});