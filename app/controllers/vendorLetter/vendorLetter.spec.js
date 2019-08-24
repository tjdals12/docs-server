import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [Vendor Letter]', () => {
    let server;

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