'use strict';
const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH,
} = require(`../cli/constants`);

class CommentService {
  findAll(article) {
    return article.comments;
  }

  delete(article, commentId) {
    const deletedComment = article.comments
    .find((item) => item.id === commentId);

    if (!deletedComment) {
      return null;
    }
    article.comments.filter((comment)=>comment.id !== commentId);

    return deletedComment;
  }

  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    article.comments.push(newComment);
    return comment;
  }

}

module.exports = CommentService;
