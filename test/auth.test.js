import assert from 'assert';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

import User from '../server/models/user.model';
import AuthController from '../server/controllers/auth.controller.js';

describe('Auth.Controller', () => {
  describe('#hasAuthorization', () => {
    let req = { 
      profile: { _id: 1 },
      auth: { _id: 1 },     
    };
    let res = {};
    let callback = () => { 'hi' };

    beforeEach(() => {
      res = { 
        send: sinon.spy(),
        status: sinon.stub().returns({
          json: sinon.stub().returns('error') 
        })
      };
    });

    it('should check autorized user and returns result running callback', () => {
      const userData = AuthController.hasAuthorization(req, res, callback);
      assert.equal(userData, callback());
    });

    it('should check autorized user and returns respose with error', () => {
      req.auth._id = 2;
      const userData = AuthController.hasAuthorization(req, res, callback);
      assert.equal(userData, 'error');
    });
  });

  describe('#signin', () => {
    let req = { 
      body: { 
          email: 'email',
          name: 'name',
          password: 'password',
          _id: 'id'
      }
    };
    let err = new Error({ error: 'error' });
    let res = {};
    let expectedResult;

    beforeEach(() => {
      res = {
          cookie: sinon.spy(),
          json: sinon.spy(),
          status: sinon.stub().returns({
            json: sinon.stub().returns( {error: sinon.spy() }),
            send: sinon.stub().returns( {error: sinon.spy() })
          }),
      };
    });

    afterEach(() => {
      User.findOne.restore();
    });
    
    it('should return sigin user data', () => {
      expectedResult = { 
        _id: req.body._id,
        email: req.body.email,
        name: req.body.name,
        authenticate: () => true 
      };

      sinon.stub(User, 'findOne').yields(null, expectedResult); 
      const jwtToken = sinon.stub(jwt, 'sign').returns('token');
      AuthController.signin(req, res);

      sinon.assert.calledWith(User.findOne, { 'email': req.body.email });
      sinon.assert.calledWith(res.json, { 
        token: jwtToken(), 
        user: {
          _id: req.body._id,
          email: req.body.email,
          name: req.body.name
        }
      });
      jwt.sign.restore();
    });

    it('should return status 401 on server error', () => {
      expectedResult = { 
        authenticate: () => true 
      };
      sinon.stub(User, 'findOne').yields(err); 
      AuthController.signin(req, res);

      sinon.assert.calledWith(User.findOne, { 'email': req.body.email });
      sinon.assert.calledWith(res.status, '401');
      sinon.assert.calledOnce(res.status('401').json);
    });

    it('should return status 401 for non-authenticate user and send this error', () => {
      expectedResult = { 
        authenticate: () => false 
      };
      sinon.stub(User, 'findOne').yields(null, expectedResult); 
      AuthController.signin(req, res);

      sinon.assert.calledWith(User.findOne, { 'email': req.body.email });
      sinon.assert.calledWith(res.status, '401');
      sinon.assert.calledOnce(res.status('401').send);
    });
  });

  describe('#signout', () => {
    let res = {};

    beforeEach(() => {
      res = {
          clearCookie: sinon.spy(),
          status: sinon.stub().returns({
            json: sinon.stub().returns( {error: sinon.spy() }),
          }),
      };
    });

    it('should return status 200 with message', () => {
      AuthController.signout(null, res);

      sinon.assert.calledWith(res.status, '200');
      sinon.assert.calledOnce(res.status('200').json);
    });
  });
});