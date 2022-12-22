const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { user } = require('../models');

router.post('/users', async (req, res) => {
  const { nickname, password, confirm } = req.body;

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
