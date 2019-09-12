import sinon from 'sinon';
import assert from 'assert';
import expect from 'expect';
import jwt from 'jsonwebtoken';


import User from '../../server/models/user.model';
import UserControllers from '../../server/controllers/user.controller.js';
import AuthControllers from '../../server/controllers/auth.controller.js';


describe('Controllers', () => {
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

    test('should check autorized user and returns result running callback', () => {
      const userData = AuthControllers.hasAuthorization(req, res, callback);
      expect(userData).toEqual(callback());
    });

    test('should check autorized user and returns respose with error', () => {
      req.auth._id = 2;
      const userData = AuthControllers.hasAuthorization(req, res, callback);
      expect(userData).toEqual('error');
    });
  });

  describe('#create', () => {
    let req = { 
      body: { 
          email: 'email',
          name: 'name',
          save: () => {}
      }
    };
    let err = new Error({ error: 'error' });
    let res = {};
    let user;
    beforeEach(() => {
      res = {
          status: sinon.stub().returns({
            json: sinon.stub().returns( {error: sinon.spy() }),
          }),
      };
    });

    afterEach(() => {
      User.prototype.save.restore();
    });
    
    test('should save user and return status 200 with message', () => {
      sinon.stub(User.prototype, 'save').yields(null);
      UserControllers.create(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(res.status(200).json);
    });

    test('should return status 400 on server error', () => {
      sinon.stub(User.prototype, 'save').yields(err);
      UserControllers.create(req, res);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.status(400).json);
    });
  });

  describe('#remove', () => {
    let req = { 
      profile: {
        remove: () => {}
      }
    };
    let err = new Error({ error: 'error' });
    let res = {};
    let expectedResult = {};
    let user;
    let callback = () => { 'hi' };

    beforeEach(() => {
      res = {
          json: sinon.spy(),
          status: sinon.stub().returns({
            json: sinon.stub().returns( {error: sinon.spy() }),
          }),
      };
    });

    beforeEach(() => {
      user = req.profile;
    });

    afterEach(() => {
      user.remove.restore();
    });

    test('should delete user and return information about', () => {
      expectedResult.hashed_password = 'password';
      expectedResult.salt = 'salt'
      sinon.stub(user, 'remove').yields(null, expectedResult);
      UserControllers.remove(req, res, callback);

      sinon.assert.calledWith(res.json, { 
        hashed_password: undefined,
        salt: undefined
      });
      sinon.assert.calledOnce(res.json);
    });

    test('should return status 400 on server error', () => {
      sinon.stub(user, 'remove').yields(err);
      UserControllers.remove(req, res, callback);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.status(400).json);
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
    
    test('should return sigin user data', () => {
      expectedResult = { 
        _id: req.body._id,
        email: req.body.email,
        name: req.body.name,
        authenticate: () => true 
      };

      sinon.stub(User, 'findOne').yields(null, expectedResult); 
      const jwtToken = sinon.stub(jwt, 'sign').returns('token');
      AuthControllers.signin(req, res);

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

    test('should return status 401 on server error', () => {
      expectedResult = { 
        authenticate: () => true 
      };
      sinon.stub(User, 'findOne').yields(err); 
      AuthControllers.signin(req, res);

      sinon.assert.calledWith(User.findOne, { 'email': req.body.email });
      sinon.assert.calledWith(res.status, '401');
      sinon.assert.calledOnce(res.status('401').json);
    });

    test('should return status 401 for non-authenticate user and send this error', () => {
      expectedResult = { 
        authenticate: () => false 
      };
      sinon.stub(User, 'findOne').yields(null, expectedResult); 
      AuthControllers.signin(req, res);

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

    test('should return status 200 with message', () => {
      AuthControllers.signout(null, res);

      sinon.assert.calledWith(res.status, '200');
      sinon.assert.calledOnce(res.status('200').json);
    });
  });
});