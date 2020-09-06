import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[postId] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId, status: 'pending' },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event: ', req.body.type);
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id == id);

    comment.status = status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, content, postId, status },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
