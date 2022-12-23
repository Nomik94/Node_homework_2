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
  //  #swagger.description = '게시글 조회'
  //  #swagger.tags = ['Posts']
  /*  #swagger.responses[200] = {
            description: '게시글 조회 성공',
            schema: {
                "posts": [
                          {
                            "postId": 21,
                            "title": "게시물10",
                            "content": "테스트",
                            "user_id": 1,
                            "like_cnt": 0,
                            "createdAt": "2022-12-22T13:38:13.000Z",
                            "updatedAt": "2022-12-22T13:38:13.000Z"
                          }
                        ]
            }
} */
  const posts = await post.findAll({ order: [['postId', 'desc']] });
  res.json({ posts: posts });
});

// 게시글 상세 조회
router.get('/posts/:_postId', async (req, res) => {
  //  #swagger.description = '게시글 상세 조회'
  //  #swagger.tags = ['Posts']
  /*  #swagger.responses[200] = {
            description: '게시글 상세 조회 성공',
            schema: {
                "data": {
    "postId": 16,
    "title": "수정",
    "content": "수정테스트",
    "user_id": 2,
    "like_cnt": 2,
    "createdAt": "2022-12-22T01:07:21.000Z",
    "updatedAt": "2022-12-22T13:54:12.000Z"
  }
            }
} */
  const { _postId } = req.params;
  const data = await post.findOne({ where: { postId: _postId } });

  res.status(200).json({ data });
});

// 게시글 생성
router.post('/posts', authMiddleWare, async (req, res) => {
  //  #swagger.description = '게시글 작성'
  //  #swagger.tags = ['Posts']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                title: '안녕하세요 제목입니다.',
                content: '안녕하세요 내용입니다.',
            }
} */
  /*  #swagger.responses[200] = {
            description: '게시글 작성 성공',
            schema: {
                message: '게시글을 생성하였습니다.'
            }
} */
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
  //  #swagger.description = '게시글 수정'
  //  #swagger.tags = ['Posts']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                title: '수정된 게시글 입니다.', 
                content: '수정된 내용 입니다.', 
            }
} */
  /*  #swagger.responses[200] = {
            description: '게시글 수정 성공',
            schema: {
                message: '게시글을 수정하였습니다.'
            }
} */
  /*  #swagger.responses[404] = {
            description: '게시글 조회 실패',
            schema: {
                message: '게시글 조회에 실패하였습니다.'
            }
} */
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
  //  #swagger.description = '게시글 삭제'
  //  #swagger.tags = ['Posts']
  /*  #swagger.responses[200] = {
            description: '게시글 삭제 성공',
            schema: {
                message: '게시글을 삭제하였습니다.'
            }
} */
  const { _postId } = req.params;
  const deletePost = await post.findOne({ where: { postId: _postId } });

  if (deletePost) {
    await post.destroy({ where: { postId: _postId } });
  }
  res.status(200).json({ message: '게시글을 삭제하였습니다.' });
});

module.exports = router;
