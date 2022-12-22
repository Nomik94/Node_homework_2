const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { like, post } = require('../models');
const authMiddleWare = require('../middlewares/auth-middleware');

const app = express();
app.use(cookieParser());

// 좋아요 한 게시글 조회
router.get('/likes/post', authMiddleWare, async (req, res) => {
  const user_id = res.locals.user.userId;
  const data = await like.findAll({
    include: [
      {
        model: post,
        attributes: ['title', 'content', 'createdAt'],
      },
    ],
    where: { user_id: user_id },
  });

  res.status(200).json({ data });
});
// 좋아요 추가,제거
router.put('/posts/:_postId/like', authMiddleWare, async (req, res) => {
  const { _postId: post_id } = req.params;
  const user_id = res.locals.user.userId;

  const existPost = await like.findOne({
    where: { post_id: post_id, user_id: user_id },
  });

  if (!existPost) {
    await like.create({
      post_id,
      user_id,
    });
    await post.increment({ like_cnt: 1 }, { where: { postId: post_id } });
    res.status(200).json({ message: '게시글의 좋아요를 등록하였습니다.' });
    return;
  }

  await post.increment({ like_cnt: -1 }, { where: { postId: post_id } });
  await like.destroy({ where: { post_id: post_id } });
  res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
});

module.exports = router;
