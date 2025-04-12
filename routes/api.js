"use strict";

const  { 
  createNewThread,
  View10RecentThreads,
  DeleteThread,
  ReporteThread,
  CreateNewReply,
  ViewThreadReplies,
  DeleteReply,
  ReporteReply
 } = require('../controllers/threads.js');

module.exports = function (app) {
 
  app.route('/api/threads/:board').post(createNewThread);

  app.route('/api/threads/:board').get(View10RecentThreads);

  app.route('/api/threads/:board').delete(DeleteThread);

  app.route('/api/threads/:board').put(ReporteThread);

  app.route('/api/replies/:board').post(CreateNewReply);

  app.route('/api/replies/:board').get(ViewThreadReplies);

  app.route('/api/replies/:board').delete(DeleteReply);

  app.route('/api/replies/:board').put(ReporteReply);

};
