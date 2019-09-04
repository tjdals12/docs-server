import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Vendor Letter ]', () => {
    let server;
    let id;
    let vendorId;
    let editVendorId;
    let documentInfoId;
    let statusId;
    let deleteDocumentId;

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

        it('add vendor for edit', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part,
                    partNumber: 'R-002',
                    vendorName: '주연테크',
                    officialName: 'JYR',
                    itemName: 'Centrifugal Pump',
                    effStaDt: '2019-07-10',
                    effEndDt: '2020-04-02',
                    persons: [
                        {
                            name: '김준호',
                            position: '과장',
                            email: 'hojk55@naver.com',
                            contactNumber: '010-4143-3664',
                            task: '개발'
                        },
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    editVendorId = ctx.body.data._id;

                    expect(ctx.body.data.part._id).to.equal(part);
                    expect(ctx.body.data.partNumber).to.equals('R-002');
                    expect(ctx.body.data.vendorPerson).have.length(1);
                    expect(ctx.body.data.itemName).to.equal('Centrifugal Pump');
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

    describe('POST /vendorletters', () => {
        it('recevie vendor letter', (done) => {
            request(server)
                .post('/api/vendorletters')
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

                    id = ctx.body.data._id;

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

    describe('POST /vendorletters/search', () => {
        it('search vendorletters', (done) => {
            request(server)
                .post('/api/vendorletters/search')
                .send({
                    vendor: '',
                    senderGb: '03',
                    sender: '대리',
                    receiverGb: '02',
                    receiver: '사원',
                    officialNumber: 'ABC',
                    receiveDate: '2010-01-01',
                    targetDate: '9999-12-31',
                    letterStatus: '01',
                    cancelYn: 'NO'
                })
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /vendorletters/:id', () => {
        it('get vendorletter', (done) => {
            request(server)
                .get(`/api/vendorletters/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    statusId = ctx.body.data.letterStatus[0]._id;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('GET /vendorletters/:vendor/letters', () => {
        it('get vendorletters by vendor', (done) => {
            request(server)
                .get(`/api/vendorletters/${vendorId}/letters`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('PATCH /vendorletters/:id/add', () => {
        it('add document in vendorletter', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/add`)
                .send({
                    receiveDocuments: [
                        {
                            documentNumber: 'VP-NCC-R-001-002',
                            documentTitle: 'Sub-Vendor List',
                            documentRev: 'A'
                        }
                    ]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    deleteDocumentId = ctx.body.data.documents[1]._id;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.documents).have.length(2);
                    expect(ctx.body.data.documents[1].documentNumber).to.equal('VP-NCC-R-001-002');
                    expect(ctx.body.data.documents[1].documentTitle).to.equal('Sub-Vendor List');
                    expect(ctx.body.data.documents[1].documentRev).to.equal('A');
                    done();
                });
        });
    });

    describe('PATCH /vendorletters/:id/edit', () => {
        it('edit vendorletter', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/edit`)
                .send({
                    vendor: editVendorId,
                    senderGb: '02',
                    sender: '이연호 대리',
                    receiverGb: '03',
                    receiver: '박준호 과장',
                    officialNumber: 'ABC-DEF-T-R-002-002',
                    deleteDocuments: [
                        deleteDocumentId
                    ],
                    receiveDate: '2019-06-02',
                    targetDate: '2019-06-14'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.documents).have.length(1);
                    done();
                });
        });
    });

    // ! documents에 존재하는 Document의 상태가 변경되었는지 확인할 수 없음
    describe('PATCH /veendorletters/:id/inout', () => {
        it('In/Out vendorletter - 내부 검토요청', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '10',
                    status: '10'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(2);
                    done();
                });
        });

        it('In/Out vendorLetter - 내부 검토완료', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '20',
                    status: '11',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(3);
                    done();
                });
        });

        it('In/Out vendorLetter - 사업주 검토요청', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '30',
                    officialNumber: 'ABC-DEF-T-R-001-001',
                    status: '20',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(4);
                    done();
                });
        });

        it('In/Out vendorLetter - 사업주 검토완료', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '40',
                    officialNumber: 'DEF-ABC-T-R-001-001',
                    status: '21',
                    resultCode: '02'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(5);
                    done();
                });
        });

        it('In/Out vendorLetter - 내부 재검토요청', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '12',
                    status: '30'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(6);
                    done();
                });
        });

        it('In/Out vendorLetter - 내부 재검토완료', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '22',
                    status: '31',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(7);
                    done();
                });
        });

        it('In/Out vendorLetter - 사업주 재검토요청', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '32',
                    officialNumber: 'ABC-DEF-T-R-001-002',
                    status: '40',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(8);
                    done();
                });
        });

        it('In/Out vendorLetter - 사업주 재검토완료', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
                .send({
                    inOutGb: '42',
                    officialNumber: 'DEF-ABC-T-R-001-002',
                    status: '41',
                    resultCode: '01'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(9);
                    done();
                });
        });

        it('In/Out vendorLetter - 업체 회신', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout`)
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

                    expect(ctx.body.data.letterStatus).have.length(10);
                    done();
                });
        });
    });

    describe('PATCH /vendorletters/:id/inout/delete', () => {
        it('delete letterStatus', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/inout/delete`)
                .send({
                    targetId: statusId
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterStatus).have.length(9);
                    done();
                });
        });
    });

    // ! documents에 존재하는 Document가 삭제되었는지 확인할 수 없음
    describe('PATCH /vendorletters/:id/delete', () => {
        it('delete vendorletter', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/delete`)
                .send({
                    yn: 'YES',
                    reason: 'API 테스트 - 삭제'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.cancelYn.yn).to.equal('YES');
                    expect(ctx.body.data.cancelYn.reason).to.equal('API 테스트 - 삭제');
                    done();
                });
        });

        it('recover vendorletter', (done) => {
            request(server)
                .patch(`/api/vendorletters/${id}/delete`)
                .send({
                    yn: 'NO',
                    reason: 'API 테스트 - 삭제취소'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.cancelYn.yn).to.equal('NO');
                    expect(ctx.body.data.cancelYn.reason).to.equal('API 테스트 - 삭제취소');
                    done();
                });
        });
    });
});