import assert from 'assert';
import sinon from 'sinon';

import MediaController from '../server/controllers/media.controller.js';

describe('Media.Controller', () => {
  describe('#read', () => {
    it('should return media from request', () => {
      const req = {
        media: 'media'
      };

      assert.deepEqual(MediaController.read(req, {json: (message) => message }), req.media);
    });
  });

  describe('#update', () => {
    let req = { 
      media: {
        save: () => {}
      },
      body: {}
    };
    let err = new Error({ error: 'error' });
    let res = {};
    let media;
    let callback = () => { 'hi' };

    beforeEach(() => {
      res = {
          json: sinon.spy(),
          status: sinon.stub().returns({
            send: sinon.stub().returns( {error: sinon.spy() }),
          }),
      };
      media = req.media;
    });

    afterEach(() => {
      media.save.restore();
    });

    it('should save new media and return information about', () => {
      sinon.stub(media, 'save').yields();
      MediaController.update(req, res, callback);
      sinon.assert.calledOnce(res.json);
    });

    it('should return status 400 on server error', () => {
      sinon.stub(media, 'save').yields(err);
      MediaController.update(req, res, callback);

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledOnce(res.status(400).send);
    });
  });

  describe('#isPoster', () => {
    let req = { 
      auth: { 
        _id: 'id'
      },
      media: { 
        postedBy: { _id: 'id' }
      }
    };
    let res = {};

    beforeEach(() => {
      res = {
          status: sinon.stub().returns({
            json: sinon.stub().returns( {error: sinon.spy() })
          }),
      };
    });

    it('should returns result running callback ', () => {
      const callback = () => { 'hi' };
      const mediaData = MediaController.isPoster(req, res, callback);
      assert.equal(mediaData, callback());
    });

    it('should return status 403 on server error', () => {
      req.auth._id = '2';
      MediaController.isPoster(req, res, () => 'callback');
      sinon.assert.calledWith(res.status, '403');
      sinon.assert.calledOnce(res.status('403').json);
    });
  });
});
