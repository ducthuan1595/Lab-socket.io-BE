const express = require('express');
const { check, body } = require('express-validator');

const userController = require('../controller/user');
const postController = require('../controller/post');

const router = express.Router();

const initRoute = (app) => {

  router.post('/signup', [check('email').isEmail(), body('password').notEmpty().isLength({min:5})], userController.signup);
  router.post('/login', [check('email').isEmail(), body('password').notEmpty().isLength({min:5})], userController.login);

  router.get('/get-post', postController.getPosts);
  router.post('/create-post', postController.createPost);
  router.get('/post-detail/:postId', postController.postDetail);
  router.put('/edit-post/:postId', postController.editPost);
  router.post('/delete-post', postController.deletePost)

  app.use('/', router);
};

module.exports = initRoute;
