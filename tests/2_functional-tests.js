const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('POST tests', function () {   
       test('Creating a new thread', function (done) {
         chai
           .request(server)
           .keepOpen()
           .post('/api/threads/:board')
           .send({
              board: 'general',
              text: 'th functional hoo',
              delete_password: 'th functional'
           })
           .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type,'application/json');
            assert.equal(res.body.name, 'general');
            assert.equal(res.body.threads.at(-1).text, 'th functional hoo');
            assert.equal(res.body.threads.at(-1).delete_password, 'th functional');
            done();
          });
       });

        test('Creating a new reply', function (done) {
          chai
            .request(server)
            .keepOpen()
            .post('/api/replies/:board')
            .send({
                board: 'general',
                thread_id: '67fe2d197f9b4bbdf61ac4ef',
                text: 'reply functional hoo',
                delete_password: 'th functional'
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.type,'application/json');
              assert.equal(res.body.text, 'reply functional hoo');
              assert.equal(res.body.delete_password, 'th functional');
              done();
            });
        });
      });

    suite('GET tests', function () {
      test('Viewing the 10 most recent threads with 3 replies each', function (done) {
        chai
        .request(server)
        .keepOpen()
        .get('/api/threads/general')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
      });
      test('Viewing a single thread with all replies', function (done) {
        chai
        .request(server)
        .keepOpen()
        .get('/api/replies/general')
        .query({thread_id: '6800c9ef0b289f01530de664'})
        .end(function (err, res) {
          console.log(res.body)
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          done();
        });
      });
    });

    suite('PUT tests', function () {
      test('Reporting a thread', function (done) {
        chai
        .request(server)
        .keepOpen()
        .put('/api/threads/:board')
        .send({
          board: "general",
          _id: "6800c0d9fa9c7c35292e9877"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type,'test/html');
          assert.equal(res.body, 'reported');
          done();
        });
      });
      test('Reporting a reply', function (done) {
        chai
        .request(server)
        .keepOpen()
        .put('/api/replies/:board')
        .send({
          board: 'general',
          thread_id: '6800c0d9fa9c7c35292e9877',
          reply_id: '6800c5e18356db6702bf7614'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type,'text/html');
          assert.equal(res.body, 'reported');
          done();
        });
      });
      });

      suite('DELETE tests', function () {
        test('Deleting a thread with the incorrect password', function (done) {
          chai
          .request(server)
          .keepOpen()
          .delete('/api/threads/:board')
          .send({
            board: 'general',
            thread_id: '6800c6dc8356db6702bf7623',
            delete_password: 'thhh'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type,'text/html');
            assert.equal(res.body, 'incorrect password');
            done();
          });
        });
        test('Deleting a thread with the correct password', function (done) {
          chai
          .request(server)
          .keepOpen()
          .delete('/api/threads/:board')
          .send({
            board: 'general',
            thread_id: '6800c0d9fa9c7c35292e9877',
            delete_password: 'th1'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type,'text/html');
            assert.equal(res.body, 'success');
            done();
          });
        });

        test('Deleting a reply with the incorrect password', function (done) {
          chai
          .request(server)
          .keepOpen()
          .delete('/api/replies/:board')
          .send({
            board: 'general',
            thread_id: '6800c6dc8356db6702bf7623',
            reply_id: '6800c7408356db6702bf762c',
            delete_password: 'thhh'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type,'text/html');
            assert.equal(res.body, 'incorrect password');
            done();
          });
        });

        test('Deleting a reply with the correct password', function (done) {
          chai
          .request(server)
          .keepOpen()
          .delete('/api/replies/:board')
          .send({
            board: 'general',
            thread_id: '6800c6dc8356db6702bf7623',
            reply_id: '6800c7408356db6702bf762c',
            delete_password: 'th2'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type,'text/html');
            assert.equal(res.body, 'success');
            done();
          });
        });
      });
 });
