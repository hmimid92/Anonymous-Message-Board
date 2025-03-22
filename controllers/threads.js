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
  created_on: {type:Date, default: dt},
  bumped_on: {type:Date, default: dt}
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

const createNewThread = async (req, res) => {
    let varr = req.body;
    let br = req.body.board;
    if(!br) {
      br = req.params.board;
    }
    try {
      let boardE = await Board.findOne({ name: br });
      let threadNew = new Thread({
        text: varr.text,
        delete_password: varr.delete_password
      });
      if(!boardE) {
        let newBoard = new Board({
          name: br
        });
        newBoard.threads.push(threadNew);
        await newBoard.save();
      } else {
        boardE.threads.push(threadNew);
        await boardE.save();
      }
      res.json(threadNew);
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

  const CreateNewReply = async (req, res) => {
    let {text, delete_password, thread_id,board} = req.body;
    if(!board) {
      board = req.params.board;
    }
    try {
      let boardF = await Board.findOne({ name: board});
      let replyNew = new Reply({
        text: text,
        delete_password: delete_password,
        bumped_on: new Date(Date.now())
      });
      let gg = boardF.threads.map(el => {
        if(el['_id'] == thread_id) {
          el['replies'].push(replyNew);
          return el;
        }
        return el;
      });
      boardF.threads = gg;
      await boardF.save();
      res.json(replyNew);
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };


module.exports = {
    createNewThread,
    // View10RecentThreads
    // DeleteThreadIncorrectPassword,
    // DeleteThreadCorrectPassword,
    // ReporteThread,
    CreateNewReply
    // ViewThreadReplies,
    // DeleteReplyIncorrectPassword,
    // DeleteReplyCorrectPassword,
    // ReporteReply
}