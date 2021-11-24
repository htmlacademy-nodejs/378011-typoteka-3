'use strict';

const {ArticlesNumberRestrict, CommentsNumberRestrict} = require(`./constants`);

const findErrorTextByType = (errorList, errorType) => {
  const allErrors = new Map(errorList);
  return allErrors.get(errorType) || null;
};


const getArticlesForAnnounces = (allArticles) => {
  const articlesWithComments = allArticles.filter((article)=> article.comments.length);
  const articlesByCommentsCount = articlesWithComments.sort((a, b)=>b.comments.length - a.comments.length);
  return articlesByCommentsCount.slice(ArticlesNumberRestrict.FIRST, ArticlesNumberRestrict.LAST);
};

const getCommentsForLastComments = (allArticles) => {
  const commentsFromArticles = allArticles.map((article)=> article.comments);
  const allComments = commentsFromArticles.reduce((acc, next)=>[...acc, ...next]);
  const sortedComments = allComments.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt));
  return sortedComments.slice(CommentsNumberRestrict.FIRST, CommentsNumberRestrict.LAST);
};

module.exports = {
  findErrorTextByType,
  getArticlesForAnnounces,
  getCommentsForLastComments,
};
