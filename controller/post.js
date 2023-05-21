const Post = require('../model/post');
const User = require('../model/user');
const path = require('path');
const helpFile = require('../util/file');
const io = require('../socket');

const p = path.join('data', 'images', 'image');

exports.getPosts = async(req, res) => {
  const posts = await Post.find();
  if(posts) {
    res.status(200).json({
      message: 'ok',
      posts: posts
    })
  }else {
    res.status(500).json({ message: err })
  }
};

exports.createPost = async(req, res) => {
  const author = req.body.author;
  const title = req.body.title;
  const image = req.files.image;
  const description = req.body.description;
  // image.mv(p + Date.now() + image.name, function (err) {
  //   if (err){
  //     throw new Error('Error upload file')
  //   }
  //   console.log('Upload success');
  // });
  try{
    if(author && title && image && description) {
      const user = await User.findById(author);
      if(user) {
        const post = new Post({
          title: title,
          image: image.data,
          description: description,
          author: author
        });
        const result = await post.save();
        if(result) {
          io.getIO().emit('posts', { action: 'create', post: result });
          res.status(200).json({ message: 'ok', result: result });
        }
      }else {
        res.status(403).json({ message: 'Unauthorized '});
      }
    }else {
      res.status(422).json({ message: 'Invalid' });
    }
  }catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postDetail = async(req, res) => {
  const postId = req.params.postId;
  try{
    if(postId) {
      const post = await Post.findById(postId);
      if(post) {
        res.status(200).json({ message: 'ok', post: post });
      }else {
        res.status(422).json({ message: 'Invalid' });
      }
    }else {
      res.status(422).json({ message: 'Invalid' });
    }
  }catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.editPost = async(req, res) => {
  const title = req.body.title;
  const image = req.files?.image;
  const description = req.body.description;
  const postId = req.params.postId
  const userId = req.body.userId;
  if(image) {
    image.mv(p + Date.now() + image.name, function (err) {
      if (err){
        throw new Error('Error upload file')
      }
      console.log('Upload success');
    });
  }
  try{
    if(title && image && description && userId && postId) {
      const user = await User.findById(userId);
      if(user) {
        const post = await Post.findById(postId);
        if(post) {
          post.title = title;
          post.description = description;
          if(image) {
            // helpFile.deleteFile(post.image)
            post.image = image.data;
          }
          const newPost = await post.save();
          if(newPost) {
            io.getIO().emit('posts', { action: 'edit', post: newPost });
            res.status(200).json({ message: 'ok', post: newPost });
          }
        }else {
          res.status(400).json({ message: 'Invalid' });
        }
      }else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    }else {
      res.status(422).json({ message: 'Lack of informs'})
    }
  }catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deletePost = async(req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
  console.log(postId, userId);
  try{
    if(postId && userId) {
      const user = await User.findById(userId);
      if(user) {
        const post = await Post.findByIdAndDelete(postId);
        if(post) {
          res.status(200).json({ message: 'ok' });
        }
      }else {
        res.status(403).json({message: 'Unauthorized'})
      }
    }else {
      res.status(422).json({ message: 'Lack of informs'})
    }
  }catch(err) {
    res.status(500).json({ message: err })
  }
}