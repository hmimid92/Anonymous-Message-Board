'use strict';

// module.exports = function (app) {
  
//   app.route('/api/threads/:board');
    
//   app.route('/api/replies/:board');

// };

const express = require('express')
const router = express.Router()

const  { 
    createNewThread,
    View10RecentThreads,
    DeleteThreadIncorrectPassword,
    DeleteThreadCorrectPassword,
    ReporteThread,
    CreateNewReply,
    ViewThreadReplies,
    DeleteReplyIncorrectPassword,
    DeleteReplyCorrectPassword,
    ReporteReply
} = require('../controllers/threads.js');

router.post('/api/threads/{board}', createNewThread)

router.get('/api/threads/{board}', View10RecentThreads)

router.delete('/api/threads/{board}', DeleteThreadIncorrectPassword)

router.delete('/api/threads/{board}', DeleteThreadCorrectPassword)

router.put('/api/threads/{board}', ReporteThread) 

router.post('/api/replies/{board}', CreateNewReply)

router.get('/api/replies/{board}', ViewThreadReplies)

router.delete('/api/replies/{board}', DeleteReplyIncorrectPassword)

router.delete('/api/replies/{board}', DeleteReplyCorrectPassword)

router.put('/api/replies/{board}', ReporteReply)

module.exports = router
