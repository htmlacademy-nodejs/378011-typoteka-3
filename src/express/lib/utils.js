'use strict';

const findErrorTextByType = (errorList, errorType)=> {
  const allErrors = new Map(errorList);
  return allErrors.get(errorType) || null;
};


const getArticlesForAnnounces = (allArticles)=>{
  const articlesWithComments = allArticles.filter((article)=> article.comments.length);
  const articlesByCommentsCount = articlesWithComments.sort((a, b)=>b.comments.length - a.comments.length);
  return articlesByCommentsCount.slice(0, 4);
};

const getCommentsForLastComments = (allArticles)=>{
  const commentsFromAticles = allArticles.map((article)=> article.comments);
  const allComments = commentsFromAticles.reduce((acc, next)=>[...acc, ...next]);
  const sortedComments = allComments.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt));
  return sortedComments.slice(0, 4);
};

module.exports = {
  findErrorTextByType,
  getArticlesForAnnounces,
  getCommentsForLastComments,
};
