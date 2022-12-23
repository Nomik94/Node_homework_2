const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { user } = require('../models');

router.post('/users', async (req, res) => {
  const { nickname, password, confirm } = req.body;
  //  #swagger.description = '회원가입'
  //  #swagger.tags = ['User']
  /*  #swagger.parameters[''] = {
            in: 'body',
            schema: {
                nickname: 'test',
                password: '1234',
                confirmPassword: '1234',
            }
} */
  /*  #swagger.responses[201] = {
            description: '회원가입 성공',
            schema: {
                message: '회원가입에 성공하였습니다.'
            }
} */
  /*  #swagger.responses[400] = {
  description: '닉네임이 중복된 경우 or 비밀번호가 일치하지 않는 경우',
  schema: {
    message: '중복된 닉네임입니다. or 패스워드가 일치하지 않습니다.'
  }
} */
  /*  #swagger.responses[412] = {
          description: '닉네임과 패스워드 정규식을 만족하지 못하는 경우',
          schema: {
              message: '닉네임 or 패스워드 형식이 올바르지 않습니다.'
          }
} */
  if (password !== confirm) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
    });
    return;
  }
  const nicknameRegex = /^[a-zA-Z0-9]{3,}$/g;
  if (!nicknameRegex.test(nickname)) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임 형식이 올바르지 않습니다.' });
  }

  const pwRegex = /^.{4,}$/;
  if (!pwRegex.test(password) || password === nickname) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드 형식이 올바르지 않습니다.' });
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await user.findAll({
    where: {
      [Op.or]: [{ nickname }],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: '닉네임이 이미 사용중입니다.',
    });
    return;
  }

  const register = await user.create({ nickname, password });
  res.status(201).send({ register });
});

module.exports = router;
