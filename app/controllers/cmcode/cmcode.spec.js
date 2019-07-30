import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ CMCODE ]', () => {
    let server;
    let id;
    let major;
    let minorId;

    before((done) => {
        db.connect().then((type) => {
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

    describe('POST /cmcodes', () => {
        it('add cmcode', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0001',
                    cdFName: '공종'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;
                    major = ctx.body.data.cdMajor;

                    expect(ctx.body.data.cdFName).to.equal('공종');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/add', () => {
        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '기계'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    minorId = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });
    });

    describe('GET /cmcodes', () => {
        it('get cmcodes', (done) => {
            request(server)
                .get('/api/cmcodes')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:id/:minor', () => {
        it('get cmcode', (done) => {
            request(server)
                .get(`/api/cmcodes/${id}/${minorId}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMajor).to.equal(major);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:id', () => {
        it('get cmcode', (done) => {
            request(server)
                .get(`/api/cmcodes/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });

    describe('GET /cmcodes/:id/minors', () => {
        it('get cmcode by cdMajor', (done) => {
            request(server)
                .get(`/api/cmcodes/${major}/minors`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMajor).to.equal(major);
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/edit', () => {
        it('edit cmcode', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/edit`)
                .send({
                    cdMajor: '0002',
                    cdFName: '구분'
                })
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdFName).to.equal('구분');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/:minorId/edit', () => {
        it('edit cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/${minorId}/edit`)
                .send({
                    cdMinor: '0002',
                    cdSName: '장치'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors[0].cdSName).to.equal('장치');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/:minor/delete', () => {
        it('delete cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/${minorId}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdMinors).have.length(0);
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id/delete', () => {
        it('delete cmcode', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/delete`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });
});