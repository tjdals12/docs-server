import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ CMCODE ]', () => {
    let server;
    let id;

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
                    cdMinor: '0001',
                    cdFName: '공종',
                    cdSName: '공종'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.cdFName).to.equal('공종');
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

    describe('PATCH /cmcodes/:id', () => {
        it('edit cmcode', (done) => {
            request(server)
                .patch(`/api/cmcodes/${id}/edit`)
                .send({
                    cdMajor: '0001',
                    cdMinor: '0002',
                    cdFName: '공종',
                    cdSName: '기계'
                })
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.cdSName).to.equal('기계');
                    done();
                });
        });
    });

    describe('PATCH /cmcodes/:id', () => {
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