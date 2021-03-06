var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
import marked from 'marked';


var checkLogin = require('../middlewares/check').checkLogin;
import PostsEntity from '../models/posts.js';

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
  var limit = parseInt(req.query.limit);
  var skip = parseInt(req.query.skip);

  if(isNaN(skip) || isNaN(limit)){//防止无效查询字符串
    res.send({
      success:false,
      message:"error query string.should be nmuber"
    });
  }else{
      PostsEntity
        .getPosts(limit,skip)
        .then(result=>{
          let posts=[];
          for(let i=0;i<result.length;i++){
            posts.push({
              _id:result[i]._id,
              author:result[i].author,
              postTitle:result[i].postTitle,
              postTime:result[i].postTime,
              postContent:result[i].postContent,
              pv:result[i].pv
            });
          }
          res.send({
            success:true,
            posts:posts
          });
        })
        .catch(err=>{
          console.log(err);
          res.send({
            success:false,
            message:err.message
          });
        });
  }
});



// POST /posts 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
  
  var postTitle = req.body.title;
  var postContent = req.body.content;
  var token = req.get("Authorization");//获得Token,包含userID,只有登陆过后的用户才有这个

  try{
    let decoded = jwt.verify(token,'shhhhh');
    let author = decoded.user;

    var post = { 
      author,postTitle,postContent,pv: 0
    };
    console.log(post);
    PostsEntity
      .create(post)
      .then(result=>{
         PostsEntity
            .getPostsCounts()
            .then(counts=>{
              res.send({
                counts:counts,
                success:true,
                message:"post created"
              });
            });
      })
      .catch(err=>{
        console.log("err happened");
        res.send({
          success:false,
          message:err.message
        });
      });
    

  }catch(err){
    console.log("decoded wrong");
    res.send({
          success:false,
          message:err.message
        });
  }
});

// GET /posts/:postId 单独一篇的文章
router.get('/:postId', function(req, res, next) {
  var postId = req.params.postId;

  PostsEntity.getPostById(postId)
    .then(result=>{

       let post=Object.assign({},{
          _id:result._id,
          author:result.author,
          postTitle:result.postTitle,
          postTime:result.postTime,
          postContent:result.postContent,
          pv:result.pv
       });
             
      res.send({
        success:true,
        post:post
      });
    })
    .catch(err=>{
      console.log(err);
      res.send({
        success:false,
        message:err.message
      });
    });
});

// POST /posts/edit 更新一篇文章
router.post('/update', checkLogin, function(req, res, next) {
  var postTitle = req.body.title;
  var postContent = req.body.content;
  var postId = req.body.postId;
    
  PostsEntity
      .updatePostById(postId,postContent,postTitle)
      .then(result=>{
        //重定向到单文章
        res.redirect(`/api/posts/${result._id}`);
      })
      .catch(err=>{
        res.send({
          success:true,
          message:err.message
        });
      });
});

// GET /posts/remove 删除一篇文章
router.post('/remove', checkLogin, function(req, res, next) {
  var postId = req.body.postId;

  PostsEntity
        .removePostById(postId)
        .then(result=>{
            PostsEntity
              .getPostsCounts()
              .then(counts=>{
                res.send({
                  counts:counts,
                  success:true,
                  message:"post deleted"
                });
              });
        })
        .catch(err=>{
          console.log(err);
          res.send({
            success:false,
            message:err.message
          });
        });
});

module.exports = router;
