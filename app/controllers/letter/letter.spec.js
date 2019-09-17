import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Letter ]', () => {
    let server;
    let id;

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

    describe('POST /letters', () => {
        it('add letter', (done) => {
            request(server)
                .post('/api/letters')
                .send({
                    letterGb: '01',
                    letterTitle: 'HENC-HTC-T-R-001-001 검토요청의 건',
                    senderGb: '02',
                    sender: '이성민 사원',
                    receiverGb: '03',
                    receiver: '김형준 대리',
                    replyRequired: 'NO',
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    id = ctx.body.data._id;

                    expect(ctx.body.data.letterTitle).to.equal('HENC-HTC-T-R-001-001 검토요청의 건');
                    done();
                });
        });
    });

    describe('GET /letters', () => {
        it('get letters', (done) => {
            request(server)
                .get('/api/letters')
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('GET /letters/:id', () => {
        it('get letter', (done) => {
            request(server)
                .get(`/api/letters/${id}`)
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    done();
                });
        });
    });
});