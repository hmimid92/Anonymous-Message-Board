'use strict'
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('successfully connected')}
).catch(errr => console.log(errr));

const ThreadSchema = new Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [String],
  replycount: Number
});

// const BoardSchema = new Schema({
//   name: String
// });

const Thread = mongoose.model("Thread", ThreadSchema);

// const Board = mongoose.model("Board", BoardSchema);

const createNewThread = (async (req, res) => {
    let varr = req.body;
    // let board = req.params.board;
    // // console.log(varr)
    try {
      let threadNew = new Thread({
          text: varr.text,
          created_on: new Date(Date.now()),
          bumped_on: new Date(Date.now()),
          reported: false,
          delete_password: varr.delete_password,
          replies: [],
          replycount: 0
        });
        let threadNewCreated = await threadNew.save();

        res.json(threadNewCreated);
        // res.sendFile(process.cwd() + '/views/board.html');
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  });





module.exports = {
    createNewThread
    // View10RecentThreads,
    // DeleteThreadIncorrectPassword,
    // DeleteThreadCorrectPassword,
    // ReporteThread,
    // CreateNewReply,
    // ViewThreadReplies,
    // DeleteReplyIncorrectPassword,
    // DeleteReplyCorrectPassword,
    // ReporteReply
}