import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Vendor ]', () => {
    let server;
    let id;
    let part1;
    let part2;
    let personId;

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

                    part1 = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0002',
                    cdSName: '장치'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    part2 = ctx.body.data.cdMinors[1];

                    expect(ctx.body.data.cdMinors).have.length(2);
                    done();
                });
        });
    });

    describe('POST /vendors', () => {
        it('add vendor', (done) => {
            request(server)
                .post('/api/vendors')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part1,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
                    officialName: 'SMT',
                    itemName: 'Centrifugal Pump',
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

                    id = ctx.body.data._id;

                    expect(ctx.body.data.part._id).to.equal(part1);
                    expect(ctx.body.data.partNumber).to.equals('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    expect(ctx.body.data.itemName).to.equal('Centrifugal Pump');
                    done();
                });
        });
    });

    describe('GET /vendors/:id', () => {
        it('getVendor', (done) => {
            request(server)
                .get(`/api/vendors/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('GET /vendors', () => {
        it('get vendors', (done) => {
            request(server)
                .get('/api/vendors')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /vendors/forselect', () => {
        it('get vendors for select', (done) => {
            request(server)
                .get('/api/vendors/forselect')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /vendors/search', () => {
        it('search vendors', (done) => {
            request(server)
                .post('/api/vendors/search')
                .send({
                    vendorGb: '01',
                    countryCd: '01',
                    part: part1,
                    partNumber: 'R-001',
                    vendorName: '성민테크',
                    officialName: 'SMT',
                    effStaDt: '2019-05-10',
                    effEndDt: '2020-05-02',
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('POST /vendors/:id/add', () => {
        it('add person', (done) => {
            request(server)
                .post(`/api/vendors/${id}/add`)
                .send({
                    persons: [{
                        index: 0,
                        name: '이성민',
                        position: '사원',
                        email: 'lll2slll@naver.com',
                        contactNumber: '010-4143-3664',
                        task: '개발'
                    }]
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    personId = ctx.body.data.vendorPerson[0]._id;

                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(4);
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/:personId/delete', () => {
        it('delete person', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/${personId}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.partNumber).to.equal('R-001');
                    expect(ctx.body.data.vendorPerson).have.length(3);
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/edit', () => {
        it('edit vendor', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/edit`)
                .send({
                    vendorGb: '02',
                    countryCd: '02',
                    part: part2,
                    partNumber: 'S-001',
                    vendorName: '성은테크',
                    officialName: 'SUT',
                    itemName: 'Boiler Feed Water Pump',
                    effStaDt: '2019-08-20',
                    effEndDt: '2020-02-21',
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.part._id).to.equal(part2);
                    expect(ctx.body.data.partNumber).to.equal('S-001');
                    expect(ctx.body.data.vendorName).to.equal('성은테크');
                    expect(ctx.body.data.officialName).to.equal('SUT');
                    expect(ctx.body.data.itemName).to.equal('Boiler Feed Water Pump');
                    done();
                });
        });
    });

    describe('PATCH /vendors/:id/delete', () => {
        it('delete vendor', (done) => {
            request(server)
                .patch(`/api/vendors/${id}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).to.equal(id);
                    done();
                });
        });
    });
});