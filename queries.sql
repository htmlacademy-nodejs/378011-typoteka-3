-- Получить список всех категорий (идентификатор, наименование категории)
SELECT
  id,
  title
FROM categories;

-- Получить список категорий для которых для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT
  articles_categories.category_id,
  categories.title
FROM articles_categories
INNER JOIN categories
	ON categories.id = articles_categories.category_id
GROUP BY articles_categories.category_id, categories.title;

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории)
SELECT
  articles_categories.category_id,
  categories.title,
  count(articles_categories.category_id) AS "articles number in category"
FROM articles_categories
INNER JOIN categories
	ON categories.id = articles_categories.category_id
GROUP BY articles_categories.category_id, categories.title;

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации,
-- дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий).
-- Сначала свежие публикации;
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created_date,
  concat(users.first_name, ' ', users.last_name) AS "first and last name",
  users.email,
  COUNT(comments.id) AS "comments count",
  STRING_AGG(DISTINCT categories.title, ', ') AS "category list"
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_date DESC

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации,
-- анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора,
-- контактный email, количество комментариев, наименование категорий);
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created_date,
  concat(users.first_name, ' ', users.last_name) AS "first and last name",
  users.email,
  COUNT(comments.id) AS "comments count",
  STRING_AGG(DISTINCT categories.title, ', ') AS "category list"
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id


-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id AS "comment id",
  comments.article_id AS "article id",
  concat(users.first_name, ' ', users.last_name) AS "first and last name",
  comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
ORDER BY comments.created_date DESC
LIMIT 5;

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии
SELECT
  comments.id AS "comment id",
  comments.article_id AS "article id",
  concat(users.first_name, ' ', users.last_name) AS "first and last name",
  comments.text
FROM comments
INNER JOIN users
	ON comments.user_id = users.id
WHERE
  comments.article_id = 1
ORDER BY comments.created_date DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
  set title = 'Как я встретил Новый год'
WHERE
  articles.id = 1;
