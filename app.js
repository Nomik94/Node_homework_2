const express = require('express');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/likes');

const app = express();
const router = express.Router();

app.use(express.json());
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.use('/api', express.urlencoded({ extended: false }), [
  router,
  registerRouter,
  loginRouter,
  postRouter,
  commentRouter,
  likeRouter,
]);

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(8080, () => {
  console.log('서버가 요청을 받을 준비가 됐어요');
});
