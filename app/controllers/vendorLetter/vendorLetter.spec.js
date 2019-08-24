import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [Vendor Letter]', () => {
    let server;
    let vendorId;
    let documentInfoId;

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
            .catch(err => {
                done(err);
            });
    });

    describe('Vendor Propagation', () => {
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

        it('add vendor', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
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
                    expect(ctx.body.data.partNumber).to.equals('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    expect(ctx.body.data.itemName).to.equal('Chemical Injection Pump');
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

                    documentInfoId = ctx.body.data.list[0]._id;

                    expect(ctx.body.data.vendor.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendor.vendorName).to.equal('성민테크');
                    expect(ctx.body.data.list).have.length(3);
                    expect(ctx.body.data.list[0].documentNumber).to.equal('VP-NCC-R-001-001');
                    expect(ctx.body.data.list[0].documentGb.cdSName).to.equal('공통');
                    done();
                });
        });
    });

    describe('POST /vendorletters/receive', () => {
        it('recevie vendor letter', (done) => {
            request(server)
                .post('/api/vendorletters/receive')
                .send({
                    vendor: vendorId,
                    senderGb: '03',
                    sender: '홍길동 대리',
                    receiverGb: '02',
                    receiver: '이성민 사원',
                    officialNumber: 'ABC-HENC-T-R-001-001',
                    receiveDocuments: [
                        {
                            documentNumber: 'VP-NCC-R-001-001',
                            documentTitle: 'Vendor Print Index & Schedule',
                            documentRev: 'A'
                        }
                    ],
                    receiveDate: '2019-08-24',
                    targetDate: '2019-09-07'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.officialNumber).to.equal('ABC-HENC-T-R-001-001');
                    expect(ctx.body.data.documents).have.length(1);
                    done();
                });
        });
    });

    describe('GET /vendorletters', () => {
        it('get vendorletters', (done) => {
            request(server)
                .get('/api/vendorletters')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });
});