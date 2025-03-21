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
  replies: [String]
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
      let threadNew = new Thread({
        text: varr.text,
        delete_password: varr.delete_password,
        replies: []
      });
      const threadSaved = await threadNew.save();
      // res.json(threadSaved);
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

  const CreateNewReply = async (req, res) => {
    let {text, delete_password, thread_id,brd} = req.body;
    if(!brd) {
      brd = req.params.board;
    }
    try {
      let thread = await Thread.findOne({ _id: thread_id });
      let replyNew = new Reply({
        text: text,
        delete_password: delete_password,
        bumped_on: new Date(Date.now())
      });
      thread.replies.push(replyNew);
      const threadSaved = await thread.save();
      // res.json(threadSaved);
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