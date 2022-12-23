const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { comment } = require('../models');
const authMiddleWare = require('../middlewares/auth-middleware');

const app = express();
app.use(cookieParser());

// 댓글 목록 조회
router.get('/comments/:postId', async (req, res) => {
  //  #swagger.description = '댓글 목록 조회'
  //  #swagger.tags = ['Comments']
  /*  #swagger.responses[200] = {
            description: '댓글 목록 조회 성공',
            schema: {
                "data": [
    {
      "commentId": 17,
      "nickname": "김정민",
      "content": "테스트 댓글",
      "createdAt": "2022-12-22T03:35:13.000Z",
      "updatedAt": "2022-12-22T03:35:13.000Z"
    }
  ]
            }
} */
  const { postId } = req.params;
  const comments = await comment.findAll({
    where: { post_id: postId },
    order: [['id', 'desc']],
  });
  const data = comments.map((a) => {
    return {
      commentId: a.id,
      nickname: a.nickname,
      content: a.content,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    };
  });
  res.json({ data: data });
});

// 댓글 생성
router.post('/comments/:postId', authMiddleWare, async (req, res) => {
  //  #swagger.description = '댓글 작성'
  //  #swagger.tags = ['Comments']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                comment: '댓글 입니다.',
            }
} */
  /*  #swagger.responses[201] = {
            description: '댓글 작성 성공',
            schema: {
                message: '댓글을 작성하였습니다.'
            }
} */
  /*  #swagger.responses[400] = {
            description: '댓글 내용을 입력하지 않았을 경우',
            schema: {
                message: '댓글 내용을 입력해주세요.'
            }
} */
  const { postId } = req.params;
  const post_id = postId;
  const { content } = req.body;
  const user_id = res.locals.user.userId;
  const nickname = res.locals.user.nickname;

  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }

  await comment.create({
    post_id,
    user_id,
    nickname,
    content,
  });
  res.json({ message: '댓글을 생성하였습니다.' });
});

// 댓글 수정
router.put('/comments/:_commentId', authMiddleWare, async (req, res) => {
  //  #swagger.description = '댓글 수정'
  //  #swagger.tags = ['Comments']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                comment: '수정된 댓글입니다.', 
            }
} */
  /*  #swagger.responses[200] = {
            description: '댓글 수정 성공',
            schema: {
                message: '댓글을 수정하였습니다.'
            }
} */
  /*  #swagger.responses[400] = {
            description: '댓글 내용을 입력하지 않았을 경우',
            schema: {
                message: '댓글 내용을 입력해주세요.'
            }
} */
  /*  #swagger.responses[404] = {
            description: '댓글을 조회하지 못했을 경우',
            schema: {
                message: '댓글 조회에 실패하였습니다.'
            }
} */
  const { _commentId } = req.params;
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    return;
  }
  const data = await comment.findOne({ where: { id: _commentId } });
  if (data === null) {
    res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
    return;
  }
  await comment.update({ content: content }, { where: { id: _commentId } });
  res.status(200).json({ message: '댓글을 수정하였습니다.' });
});

// 댓글 삭제
router.delete('/comments/:_commentId', authMiddleWare, async (req, res) => {
  //  #swagger.description = '댓글 삭제'
  //  #swagger.tags = ['Comments']
  /*  #swagger.responses[200] = {
            description: '댓글 삭제 성공',
            schema: {
                message: '댓글을 삭제하였습니다.'
            }
} */
  const { _commentId } = req.params;
  const deleteComment = await comment.findOne({ where: { id: _commentId } });

  if (deleteComment) {
    await comment.destroy({ where: { id: _commentId } });
  }
  res.status(200).json({ message: '댓글을 삭제하였습니다.' });
});

module.exports = router;
