const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { post } = require('../models');
const { like } = require('../models');
const authMiddleWare = require('../middlewares/auth-middleware');

const app = express();
app.use(cookieParser());

// 전체 게시글 조회
router.get('/posts', async (req, res) => {
  const posts = await post.findAll({ order: [['postId', 'desc']] });
  res.json({ posts: posts });
});

// 게시글 상세 조회
router.get('/posts/:_postId', async (req, res) => {
  const { _postId } = req.params;
  const data = await post.findOne({ where: { postId: _postId } });

  res.status(200).json({ data });
});

// 게시글 생성
router.post('/posts', authMiddleWare, async (req, res) => {
  const { title, content } = req.body;
  const user_id = res.locals.user.userId;

  await post.create({
    title,
    content,
    user_id,
  });

  res.json({ message: '게시글을 생성하였습니다.' });
});

// 게시글 수정
router.put('/posts/:_postId', authMiddleWare, async (req, res) => {
  const { _postId } = req.params;
  const { title, content } = req.body;

  const data = await post.findOne({ where: { postId: _postId } });
  if (data === null) {
    res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    return;
  }
  await post.update(
    { title: title, content: content },
    { where: { postId: _postId } }
  );
  res.status(200).json({ message: '게시글을 수정하였습니다.' });
});

// 게시글 삭제
router.delete('/posts/:_postId', authMiddleWare, async (req, res) => {
  const { _postId } = req.params;
  const deletePost = await post.findOne({ where: { postId: _postId } });

  if (deletePost) {
    await post.destroy({ where: { postId: _postId } });
  }
  res.status(200).json({ message: '게시글을 삭제하였습니다.' });
});

module.exports = router;
