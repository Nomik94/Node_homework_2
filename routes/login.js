const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const { user } = require('../models');
const jwt = require('jsonwebtoken');
const SECRET_KEY = `homework2`;

const app = express();
app.use(cookieParser());

router.post('/auth', async (req, res) => {
  //  #swagger.description = '로그인'
  //  #swagger.tags = ['User']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                nickname: 'test',
                password: '1234',
            }
} */
  /*  #swagger.responses[400] = {
            description: '해당하는 유저가 존재하지 않는 경우',
            schema: {
                message: '닉네임 또는 패스워드를 확인해주세요.'
            }
} */
  const { nickname, password } = req.body;

  const users = await user.findOne({
    where: {
      nickname,
    },
  });

  if (!users || password !== users.password) {
    res.status(400).send({
      errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
    });
    return;
  }

  const token = jwt.sign({ userId: users.userId }, SECRET_KEY);
  res.cookie('token', token);

  res.json({ token: token });
});

module.exports = router;
