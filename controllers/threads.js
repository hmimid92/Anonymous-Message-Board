'use strict'
require('dotenv').config();
const { json } = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => {console.log('successfully connected')}
).catch(errr => console.log(errr));

const dt = new Date();

const ReplySchema = new Schema({
  text: String,
  delete_password: String,
  thread_id: String,
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
  replies: [ReplySchema],
  replycount: {type:Number, default: 0},
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
        res.json(newBoard);
      } else {
        boardE.threads.push(threadNew);
        await boardE.save();
        res.json(boardE);
      }
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

  const CreateNewReply = async (req, res) => {
    let {board,thread_id,text, delete_password} = req.body;
    if(!board) {
      board = req.params.board;
    }
    try {
      let boardF = await Board.findOne({ name: board});
      if(!boardF) {
        res.json({ error: 'no board' });
        return;
      }
      let replyNew = new Reply({
        text: text,
        delete_password: delete_password,
        thread_id: thread_id,
        bumped_on: new Date(Date.now())
      });
      let gg = boardF.threads.map(el => {
        if(el['_id'] == thread_id) {
          el['replies'].push(replyNew);
          el['replycount'] += 1;
          return el;
        }
        return el;
      });
      boardF['threads'] = gg;
      await boardF.save();
      res.json(replyNew);
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

  const View10RecentThreads = async (req, res) => {
    let br = req.body.board;
    if(!br) {
      br = req.params.board;
    }
    try {
      let brdName = await Board.findOne({ name: br });
      if (!brdName) {
        res.json({ error: 'no board' });
      } else {
        let results = brdName.threads.map((el,i) => {
          if(i <= 9) {
            let recentReply = el.replies.map((ell,k) => {
              if(k <= 2) {
                return {
                  text: ell.text,
                  thread_id: ell.thread_id,
                  created_on: ell.created_on,
                  bumped_on: ell.bumped_on
                };
              }
            }).filter(ell => ell != undefined).sort().reverse();
            return {
              _id: el._id,
              text: el.text,
              created_on: el.created_on,
              bumped_on: el.bumped_on,
              replies: recentReply,
              replycount: el.replycount
            };
          }
        }).filter(el => el != undefined).sort().reverse();
        res.json(results);
      }
    } catch (error) {
      res.send(error);
    }
  };

  const DeleteThread = async (req, res) => {
    let {board,thread_id, delete_password} = req.body;
    if(!board) {
      board = req.params.board;
    }
    let checkPassword = 0;
    let boardE = await Board.findOne({ name: board });
    let filterBoard = boardE.threads.map(el => {
         if((el['delete_password'] === delete_password) && (checkPassword === 0)) {
           checkPassword += 1;
         }
         if(el['_id'].toString() === thread_id) {
             return undefined;
          } 
        return el;
    }).filter(e => e !== undefined);
    if(checkPassword === 1) {
      boardE['threads'] = filterBoard;
      await boardE.save();
      res.send('success');
    } else {
      res.send('incorrect password');
    }
  };

  const ReporteThread = async (req, res) => {
    let {board,thread_id} = req.body;
    if(!board) {
      board = req.params.board;
    }
    try {
      let boardE = await Board.findOne({ name: board });
      let gg = boardE.threads.map(el => {
        if(el['_id'].toString()== thread_id) {
          el['reported'] = true;
          return el;
        }
        return el;
      });
      boardE.threads = gg;
      boardE.save();
      res.send('reported');
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

  const ViewThreadReplies = async (req, res) => {
      let entireThread = req.query.thread_id;
      let br = req.params.board;
      try {
        let brdName = await Board.findOne({ name: br });
        if (!brdName) {
          res.json({ error: 'no board' });
        } else {
          let results = brdName.threads.map(el => {
              if(el._id.toString()=== entireThread) {
                return {
                  _id: el._id,
                  text: el.text,
                  created_on: el.created_on,
                  bumped_on: el.bumped_on,
                  replies: el.replies.map(ee => {
                    return {
                      text: ee.text,
                      thread_id: ee.thread_id,
                      created_on: ee.created_on,
                      bumped_on: ee.bumped_on
                    };
                  })
                };
              }
          }).filter(el => el !== undefined).sort().reverse();
          res.json(results[0]);
        }
      } catch (error) {
        res.send(error);
      }
  };

  const DeleteReply = async (req, res) => {
    let {board,thread_id, reply_id, delete_password}= req.body;
    if(!board) {
      board = req.params.board;
    }
    let checkPassword = 0;
    let boardE = await Board.findOne({ name: board });
    let gg = boardE.threads.map(el => {
      if((el['delete_password'] === delete_password) && (checkPassword === 0)) {
        checkPassword += 1;
      }
      if(el['_id'].toString() === thread_id) {
        let repl = el['replies'].map(e => {
          if(e['_id'].toString() === reply_id) {
            e['text'] = '[deleted]';
            return e;
          } else {
            return e;
          }
        });

        el['replies'] = repl;
        return el;
      }
      return el;
    });
    if(checkPassword === 1) {
      boardE.threads = gg;
      await boardE.save();
      res.send('success');
    } else {
      res.send('incorrect password');
    }
  };


  const ReporteReply = async (req, res) => {
    let {board,thread_id, reply_id} = req.body;
    if(!board) {
      board = req.params.board;
    }
    try {
      let boardE = await Board.findOne({ name: board });
      let gg = boardE.threads.map(el => {
        if(el['_id'].toString() == thread_id) {
          let repl = el['replies'].map(e => {
            if(e['_id'].toString() == reply_id) {
              e['reported'] = true;
            }
            return e;
          });
          el['replies'] = repl;
        }
        return el;
      });
      boardE.threads = gg;
      boardE.save();
      res.send('reported');
    } catch (error) {
      res.json({ error: 'could not post' });
    }
  };

module.exports = {
    createNewThread,
    View10RecentThreads,
    DeleteThread,
    ReporteThread,
    CreateNewReply,
    ViewThreadReplies,
    DeleteReply,
    ReporteReply
}