"use strict";

const  { 
  createNewThread
  // View10RecentThreads
  // DeleteThreadIncorrectPassword,
  // DeleteThreadCorrectPassword,
  // ReporteThread,
  // CreateNewReply,
  // ViewThreadReplies,
  // DeleteReplyIncorrectPassword,
  // DeleteReplyCorrectPassword,
  // ReporteReply
 } = require('../controllers/threads.js');

module.exports = function (app) {
 
  app.route('/api/threads/:board').post(createNewThread);

  // app.route('/api/threads/:board').get(View10RecentThreads);

  // app.route('/api/threads/:board').delete(DeleteThreadIncorrectPassword)

  // app.route('/api/threads/:board').delete(DeleteThreadCorrectPassword)

  // app.route('/api/threads/:board').put(ReporteThread) 

  // app.route('/api/replies/:board').post(CreateNewReply)

  // app.route('/api/replies/:board').get(ViewThreadReplies)

  // app.route('/api/replies/:board').delete(DeleteReplyIncorrectPassword)

  // app.route('/api/replies/:board').delete(DeleteReplyCorrectPassword)

  // app.route('/api/replies/:board').put(ReporteReply)

};
