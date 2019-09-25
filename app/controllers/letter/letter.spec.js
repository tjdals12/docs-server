import * as db from 'models';
import app from 'app';
import request from 'supertest';
import { expect } from 'chai';

describe('  [ Letter ]', () => {
    let server;
    let projectId;
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

    describe('project preparation', () => {
        let projectGb;
        let major;

        it('add Part', (done) => {
            request(server)
                .post('/api/cmcodes')
                .send({
                    cdMajor: '0000',
                    cdFName: '프로젝트 구분'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    major = ctx.body.data._id;

                    expect(ctx.body.data.cdMajor).to.equal('0000');
                    expect(ctx.body.data.cdFName).to.equal('프로젝트 구분');
                    done();
                });
        });

        it('add cdMinor', (done) => {
            request(server)
                .patch(`/api/cmcodes/${major}/add`)
                .send({
                    cdMinor: '0001',
                    cdSName: '신규'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    projectGb = ctx.body.data.cdMinors[0];

                    expect(ctx.body.data.cdMinors).have.length(1);
                    done();
                });
        });

        it('add project', (done) => {
            request(server)
                .post('/api/projects')
                .send({
                    projectGb: projectGb,
                    projectName: 'Methane Gas Sales & CFU/ARO2 Project',
                    projectCode: 'NCC',
                    effStaDt: '2017-03-01',
                    effEndDt: '2018-10-31',
                    client: '한화토탈',
                    clientCode: 'HTC',
                    contractor: '한화건설',
                    contractorCode: 'HENC',
                    memo: '프로젝트 설명'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    projectId = ctx.body.data._id;

                    expect(ctx.body.data.projectGb._id).to.equal(projectGb);
                    expect(ctx.body.data.projectName).to.equal('Methane Gas Sales & CFU/ARO2 Project');
                    expect(ctx.body.data.memo).to.equal('프로젝트 설명');
                    done();
                });
        });
    });

    describe('POST /letters', () => {
        it('add letter', (done) => {
            request(server)
                .post('/api/letters')
                .send({
                    project: projectId,
                    letterGb: '02',
                    letterTitle: 'HENC-HTC-T-R-001-001 검토요청의 건',
                    senderGb: '02',
                    sender: '이성민 사원',
                    receiverGb: '01',
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

    describe('GET /letters/ref/search', () => {
        it('get references', (done) => {
            request(server)
                .get('/api/letters/ref/search?keyword=R-001')
                .expect(200, done());
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

    describe('POST /letters/search', () => {
        it('search letters', (done) => {
            request(server)
                .post('/api/letters/search?page=1')
                .send({
                    letterGb: '02'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data).have.length(1);
                    done();
                });
        });
    });

    describe('PATCH /letters/:id/edit', () => {
        it('edit letter', (done) => {
            request(server)
                .patch(`/api/letters/${id}/edit`)
                .send({
                    letterGb: '02',
                    letterTitle: 'HENC-HTC-T-R-001-028 검토요청의 건',
                    senderGb: '02',
                    sender: '김미경 사원',
                    receiverGb: '01',
                    receiver: '전체',
                    sendDate: '2019-09-22',
                    replyRequired: 'NO',
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data.letterTitle).to.equal('HENC-HTC-T-R-001-028 검토요청의 건');
                    expect(ctx.body.data.sender).to.equal('김미경 사원');
                    expect(ctx.body.data.receiver).to.equal('전체');
                    expect(ctx.body.data.sendDate.substr(0, 10)).to.equal('2019-09-22');
                    done();
                });
        });
    });

    describe('PATCH /letters/:id/cancel', () => {
        it('delete letter', (done) => {
            request(server)
                .patch(`/api/letters/${id}/cancel`)
                .send({
                    yn: 'YES',
                    reason: '잘못 작성됨.'
                })
                .expect(200)
                .end((err, ctx) => {
                    if (err) throw err;

                    expect(ctx.body.data._id).to.equal(id);
                    expect(ctx.body.data.cancelYn.yn).to.equal('YES');
                    expect(ctx.body.data.cancelYn.reason).to.equal('잘못 작성됨.');
                    done();
                });
        });
    });
});