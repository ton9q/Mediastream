import assert, { doesNotReject } from 'assert';

import chai from 'chai';
import chaitHttp from 'chai-http';

import UserRouter from '../../server/routes/user.routes.js';
import MediaRouter from '../../server/routes/media.routes.js';

const should = chai.should();
chai.use(chaitHttp);

describe('Db.Controller', () => {
  describe('/GET', () => {
    it('Users: should get all users', () => {
      chai
        .request(UserRouter)
        .get('/api/users')
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.users.should.be.a('array');
          done();
        });
    });

    it('Users: should get error for user not autorisate', () => {
      const id = '5bd99151f608f0174865f7ab';
      const error = 'UnauthorizedError: No authorization token was found';
      chai
        .request(UserRouter)
        .get(`/api/users/${id}`)
        .end((req, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          assert.equal(res.body.error, error);
          done();
        });
    });

    it('Users: should get error for user not found', () => {
      // const id = '5bd99151f608f0174865f7a';
      // const error = 'User not found';

      // chai
      //   .request(UserRouter)
      //   .get(`/api/users/${id}`)
      //   .end((req, res) => {
      //     res.should.have.status(400);
      //     res.body.should.be.a('object');
      //     assert.equal(res.body.error, error);
      //     done();
      //   });
    });

    it('PopularMedia: should get popular media', () => {
      chai
        .request(MediaRouter)
        .get('/api/media/popular')
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.media.should.be.a('array');
          done();
        });
    });

    it('Media(/:id): should get media by id', () => {
      const id = '5be341005c9c7b02e88801b7';

      chai
        .request(MediaRouter)
        .get(`/api/media/${id}`)
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('Media(/popular): should get popular media', () => {
      chai
        .request(MediaRouter)
        .get('/api/media/popular')
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('Media(/related/:id): should get related media by id', () => {
      const id = '5c1660807ad9762e7c7a2aa7';

      chai
        .request(MediaRouter)
        .get(`/api/media/related/${id}`)
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('Media(/related/:id): should return error related media by id (incorrect)', () => {
    //   const id = '5c1660807ad9762e7c7a2aa';
    //   const error = 'Media not found';

    //   chai
    //     .request(MediaRouter)
    //     .get(`/api/media/related/${id}`)
    //     .end((req, res) => {
    //       res.should.have.status(400);
    //       res.body.should.be.a('object');
    //       assert.equal(res.body.error, error);
    //       done();
    //     });
    });
    
    it('Media(/by/:userId): should get videos publised user with id', () => {
      const id = '5bd99151f608f0174865f7ab';

      chai
        .request(MediaRouter)
        .get(`/api/media/by/${id}`)
        .end((req, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });

    it('Media(/by/:userId): should return error user videos by id (incorrect)', () => {
    //   const id = '5bd99151f608f0174865f7a';

    //   chai
    //     .request(MediaRouter)
    //     .get(`/api/media/by/${id}`)
    //     .end((req, res) => {
    //     res.should.have.status(400);
    //     res.body.should.be.a('object');
    //     assert.equal(res.body.error, error);
    //     done();
    //     });
    });
  });

  describe('/POST', () => {
    it('newMedia: should return error new video (user not autorisate)', () => {
      const data = {
        views: '17',
        created: '2018-11-07T19:46:08.390Z',
        _id: '5be341005c9c7b02e88801b7',
        title: 'e',
        description: 'sfdf',
        genre: 'sdf',
        postedBy: {
          _id: '5bd99151f608f0174865f7ab',
          name: 'anton'
        },
        __v: 0
      };
      const error = 'User not found';

      chai
        .request(MediaRouter)
        .post(`/api/media/new/${data._id}`)
        .send(data)
        .end((req, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          assert.equal(res.body.error, error);
        });
    });

    it('SignIn: should get user data', () => {
      // const data = {
      //   email: 'kuchma_anton@mail.ru',
      //   password: '19021999'
      // };

      // chai
      //   .request(AuthRouter)
      //   .post('/auth/signin')
      //   .send(data)
      //   .end((req, res) => {
      //     res.should.have.status(200);
      //     res.body.should.be.a('object');
      //     assert.equal(res.body.user.email, 'kuchma_anton@mail.ru');
      //   });
    });

    it('SignIn: should error because data is empty', () => {
      // const data = {
      //   email: 'kuchma_anton',
      //   password: '19021999'
      // };
      // const error = 'User not found';

      // chai
      //   .request(AuthRouter)
      //   .post('/auth/signin')
      //   .send(data)
      //   .end((req, res) => {
      //     res.should.have.status(401);
      //     res.body.should.be.a('object');
      //     assert.equal(res.body.error, error);
      //   });
    });
  });
});
