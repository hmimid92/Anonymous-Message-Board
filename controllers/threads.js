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
      let threadNewCreated = threadNew.save();

      Board.findOne({ name: br },(er,d) => {
        if (!d) {
          let boardNameNew = new Board({
            name: br,
            threads: []
          });
          boardNameNew.threads.push(threadNew);
          boardNameNew.save((er,d1) => {
            if(er || !d1) {
              res.json({ error: 'could not post' });
            } else {
              res.json(threadNew);
            }
          });
        } else {
          d.threads.push(threadNew);
          d.save((er,d1) => {
            if(er || !d1) {
              res.json({ error: 'could not post' });
            } else {
              res.json(threadNew);
            }
          });
        }
      });
    } catch (error) {
      res.json({ error: 'could not post' });
    }
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