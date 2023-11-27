// Create web server
const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');

//post comment
router.post('/posts/:id/comments', commentsCtrl.create);
//delete comment
router.delete('/comments/:id', commentsCtrl.delete);

module.exports = router;
