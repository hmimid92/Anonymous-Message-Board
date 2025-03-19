'use strict'
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('successfully connected')}
).catch(errr => console.log(errr));

const ReplySchema = new Schema({
  text: String,
  delete_password: String,
  reported: Boolean,
  created_on: Date,
  bumped_on: Date
});

const Reply = mongoose.model("Reply", ReplySchema);

const ThreadSchema = new Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [ReplySchema]
});

const Thread = mongoose.model("Thread", ThreadSchema);

const BoardSchema = new Schema({
  name: String,
  threads: [ThreadSchema]
});

const Board = mongoose.model("Board", BoardSchema);

const createNewThread = (async (req, res) => {
    let varr = req.body;
    let board = req.params.board;
    // // console.log(varr)
    try {
      let threadNew = new Thread({
        text: varr.text,
        delete_password: varr.delete_password,
        replies: [],
        created_on: new Date(Date.now()),
        bumped_on: new Date(Date.now()),
        reported: false,
        replies: []
      });
      // let threadNewCreated = await threadNew.save();

      let boardP = await Board.findOne({ name: board });
        if (!boardP) {
          let boardNameNew = new Board({
            name: board,
            threads: []
          });
          boardNameNew.threads.push(threadNew);
          await boardNameNew.save();
          res.json(threadNew);
        } else {
          boardP.threads.push(threadNew);
          res.json(threadNew);
        }
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