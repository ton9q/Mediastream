import assert from 'assert';
import sinon from 'sinon';

import User from '../server/models/user.model';
import UserController from '../server/controllers/user.controller.js';

describe('User.Controller', () => {
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
    
    it('should save user and return status 200 with message', () => {
      sinon.stub(User.prototype, 'save').yields(null);
      UserController.create(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(res.status(200).json);
    });

    it('should return status 400 on server error', () => {
      sinon.stub(User.prototype, 'save').yields(err);
      UserController.create(req, res);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.status(400).json);
    });
  });

  describe('#read', () => {
    let req = { 
      profile: {
      }
    };
    let res = {
      json: sinon.spy()
    };

    it('should return profile', () => {
      UserController.read(req,res);
      
      sinon.assert.calledWith(res.json, { 
        hashed_password: undefined,
        salt: undefined
      });
      sinon.assert.calledOnce(res.json);
    });
  });

  describe('#update', () => {
    let req = { 
      profile: {
        save: () => {}
      },
      body: {}
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
      user = req.profile;
    });

    afterEach(() => {
      user.save.restore();
    });

    it('should save new user and return information about', () => {
      expectedResult.hashed_password = 'password';
      expectedResult.salt = 'salt'
      sinon.stub(user, 'save').yields();
      UserController.update(req, res, callback);

      // sinon.assert.calledWith(res.json, { 
      //   hashed_password: undefined,
      //   salt: undefined,
      //   save: req.profile.save,
      //   updated: Date.now()
      // });
      sinon.assert.calledOnce(res.json);
    });

    it('should return status 400 on server error', () => {
      sinon.stub(user, 'save').yields(err);
      UserController.update(req, res, callback);

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
      user = req.profile;
    });

    afterEach(() => {
      user.remove.restore();
    });

    it('should delete user and return information about', () => {
      expectedResult.hashed_password = 'password';
      expectedResult.salt = 'salt'
      sinon.stub(user, 'remove').yields(null, expectedResult);
      UserController.remove(req, res, callback);

      sinon.assert.calledWith(res.json, { 
        hashed_password: undefined,
        salt: undefined
      });
      sinon.assert.calledOnce(res.json);
    });

    it('should return status 400 on server error', () => {
      sinon.stub(user, 'remove').yields(err);
      UserController.remove(req, res, callback);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.status(400).json);
    });
  });
});