'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_ELEMENTS = 4;


  const createCommentsElement=(comment)=>{
    const commentTemplate = document.querySelector('#comment-template');
    const commentCardElement = commentTemplate.content.cloneNode(true)
    commentCardElement.querySelector('.last__list-image').src = `/img/${comment.users.avatar}`;
    commentCardElement.querySelector('.last__list-name').textContent = comment.users.name;
    commentCardElement.querySelector('.last__list-link').href = `/articles/${comment.articleId}`;
    commentCardElement.querySelector('.last__list-link').textContent = comment.text.slice(0, 101);
    return commentCardElement
  }

  const hotArticleElement=(article)=>{
    const hotArticleTemplate = document.querySelector('#hot-article-template');
    const hotArticleCardElement = hotArticleTemplate.cloneNode(true).content;
    const articleLink = hotArticleCardElement.querySelector('.hot__list-link');
    articleLink.href = `/articles/${article.id}`;
    articleLink.prepend(`${article.announce.slice(0, 101)}...`);
    articleLink.querySelector('sup').textContent = article.comments.length;
    return hotArticleCardElement
  }

  const updateElements = (comments, articles) => {
    const commentListElements = document.querySelector('.last__list');
    const commentElements = commentListElements.querySelectorAll('li');
    if (commentElements.length === COUNT_ELEMENTS) {
      commentElements[commentElements.length - 1].remove();
    }
    const lastComment = comments.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt))[0]
    commentListElements.prepend(createCommentsElement(lastComment));


    const hotArticlesListElements = document.querySelector('.hot__list');
    const articleElements = hotArticlesListElements.querySelectorAll('li');
    articleElements.forEach(el=> el.remove());
    const sortedArticles = articles.filter((article)=> article.comments.length).sort((a, b)=>b.comments.length - a.comments.length);
    const lastHotArticles = sortedArticles.slice(0, 4);
    lastHotArticles.forEach(el=> hotArticlesListElements.append(hotArticleElement(el)));
  }

  const socket = io(SERVER_URL);
  socket.addEventListener('comments:update', (comments, articles) => {updateElements(comments, articles)})
})();
