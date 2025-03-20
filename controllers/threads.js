'use strict'
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('successfully connected')}
).catch(errr => console.log(errr));

const dt = new Date();

const ReplySchema = new Schema({
  text: String,
  delete_password: String,
  reported: {type:Boolean, default: false},
  created_on: {type:Boolean, default: dt},
  bumped_on: {type:Boolean, default: dt},
});

const Reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
  text: String,
  created_on: {type: Date, default: dt},
  bumped_on: {type: Date, default: dt},
  reported: {type:Boolean, default: false},
  delete_password: String,
  replies: [ReplySchema]
});

const Thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
  name: String,
  threads: [ThreadSchema]
});

const Board = mongoose.model("Board", BoardSchema);

const createNewThread = (req, res) => {
  const { text, delete_password } = req.body;
  let board = req.body.board;
  if (!board) {
    board = req.params.board;
  }
  const newThread = new Thread({
    text: text,
    delete_password: delete_password,
    replies: [],
  });
  Board.findOne({ name: board }, (err, Boarddata) => {
    if (!Boarddata) {
      const newBoard = new Board({
        name: board,
        threads: [],
      });
      newBoard.threads.push(newThread);
      newBoard.save((err, data) => {
        if (err || !data) {
          console.log(err);
          res.send("There was an error saving in post");
        } else {
          res.json(newThread);
        }
      });
    } else {
      Boarddata.threads.push(newThread);
      Boarddata.save((err, data) => {
        if (err || !data) {
          res.send("There was an error saving in post");
        } else {
          res.json(newThread);
        }
      });
    }
  });
};


module.exports = {
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
}