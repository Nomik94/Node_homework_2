const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { like, post } = require('../models');
const authMiddleWare = require('../middlewares/auth-middleware');

const app = express();
app.use(cookieParser());

// 좋아요 한 게시글 조회
router.get('/likes/post', authMiddleWare, async (req, res) => {
  //  #swagger.description = '좋아요 게시글 조회'
  //  #swagger.tags = ['Likes']
  /*  #swagger.responses[200] = {
            description: '게시글 조회 성공',
            schema: {
                "data": [
    {
      "user_id": 1,
      "post_id": 16,
      "title": "수정",
      "content": "수정테스트",
      "like_cnt": 2,
      "createdAt": "2022-12-22T01:07:21.000Z"
    },
    {
      "user_id": 1,
      "post_id": 15,
      "title": "테스트",
      "content": "테스트",
      "like_cnt": 1,
      "createdAt": "2022-12-21T12:38:35.000Z"
    }
  ]
            }
} */
  const user_id = res.locals.user.userId;
  const data = await like.findAll({
    where: { user_id: user_id },
    raw: true,
    attributes: [
      'user_id',
      'post_id',
      'post.title',
      'post.content',
      'post.like_cnt',
      'post.createdAt',
    ],
    include: [
      {
        model: post,
        attributes: [],
      },
    ],
    order: [[post, 'like_cnt', 'desc']],
  });
  res.status(200).json({ data });
});
// 좋아요 추가,제거
router.put('/posts/:_postId/like', authMiddleWare, async (req, res) => {
  //  #swagger.description = '게시글 좋아요'
  //  #swagger.tags = ['Likes']
  /*  #swagger.responses[200] = {
            description: '게시글 좋아요 등록 OR 취소',
            schema: {
                message: '게시글의 좋아요를 등록 OR 취소하였습니다.', 
            }
} */
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

  await post.decrement({ like_cnt: 1 }, { where: { postId: post_id } });
  await like.destroy({ where: { post_id: post_id } });
  res.status(200).json({ message: '게시글의 좋아요를 취소하였습니다.' });
});

module.exports = router;
