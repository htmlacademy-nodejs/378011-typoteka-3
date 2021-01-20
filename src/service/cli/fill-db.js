'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const generator = require(`generate-password`);
const {
  getRandomInt,
  shuffle,
  getCreatedDate,
  readContent,
  createIdsArray,
} = require(`./utils`);
const {
  DEFAULT_COUNT,
  Messages,
  FullTextRestrict,
  AnnounceTextRestrict,
  EXIT_CODE_FAILURE,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_USERS_PATH,
  FILE_EMAILS_PATH,
  FILE_AVATARS_PATH,
  FILE_PICTURES_PATH,
  FILE_COMMENTS_PATH,
  FILL_DB_FILE,
  TextRestrict,
  MAX_ARTICLES_NUMBER,
} = require(`./constants`);

const generateUsers = (users, emails, avatars) =>users.map((user, index) => {
  const [firstName, lastName] = user.split(` `);
  return [
    `'${firstName}'`,
    `'${lastName}'`,
    `'${emails[index]}'`,
    `'${generator.generate({length: 10, numbers: true})}'`,
    `'${avatars[index]}'`
  ];
});

const generateArticles = (countArticle, usersLength, sentences, titles, pictures)=>
  Array(countArticle).fill({}).map(() => {
    return [
      `'${titles[getRandomInt(0, titles.length - 1)]}'`,
      `'${shuffle(sentences).slice(0, getRandomInt(AnnounceTextRestrict.MIN, AnnounceTextRestrict.MAX)).join(` `)}'`,
      `'${shuffle(sentences).slice(0, getRandomInt(FullTextRestrict.MIN, FullTextRestrict.MAX)).join(` `)}'`,
      `'${getCreatedDate()}'`,
      `'${pictures[getRandomInt(0, pictures.length - 1)]}'`,
      `${getRandomInt(1, usersLength)}`
    ];
  });

const generateComments = (countArticle, usersLength, comments)=> {
  const allArticlesIdArray = createIdsArray(countArticle);
  const randomArticlesIdArray = createIdsArray(getRandomInt(1, countArticle));
  const resultArticlesIdArray = shuffle([...allArticlesIdArray, ...randomArticlesIdArray]);
  const allUsersIdArray = createIdsArray(usersLength);
  return allUsersIdArray.map((userId)=>resultArticlesIdArray.map((articleId) => {
    return [
      `'${shuffle(comments).slice(0, getRandomInt(TextRestrict.MIN, TextRestrict.MAX)).join(` `)}'`,
      `'${getCreatedDate()}'`,
      `${articleId}`,
      `${userId}`
    ];
  })
  ).reduce((sum, current)=>{
    return [...sum, ...current];
  });
};

const generateCategories = (categories) => categories.map((category) => [
  `'${category}'`
]);

const generateArticlesToCategories = (countArticle, categoriesLength)=> {
  const allArticlesIdArray = createIdsArray(countArticle);
  const randomArticlesIdArray = createIdsArray(getRandomInt(1, countArticle));
  const resultArticlesIdArray = shuffle([...allArticlesIdArray, ...randomArticlesIdArray]);
  return resultArticlesIdArray.map((articleId) => {
    return [
      `${articleId}`,
      `${getRandomInt(1, categoriesLength)}`
    ];
  });
};

const createString = (rows) => `(${rows.map((row) => row.join(`, `)).join(`),\n(`)});`;

const generateSql = (
    countArticle,
    users,
    emails,
    avatars,
    categories,
    comments,
    sentences,
    titles,
    pictures
) => `--  Создан командой "--fill ${countArticle}"
 -- Добавление пользователей
INSERT INTO users (first_name, last_name, email, password, avatar) VALUES
${createString(generateUsers(users, emails, avatars))}

-- Добавление публикаций
INSERT INTO articles (title, announce, full_text, created_date, picture, user_id) VALUES
${createString(generateArticles(countArticle, users.length, sentences, titles, pictures))}

-- Добавление комментариев
INSERT INTO comments (text, created_date, article_id, user_id) VALUES
${createString(generateComments(countArticle, users.length, comments))}

-- Добавление категорий
INSERT INTO categories (title) VALUES
${createString(generateCategories(categories))}

-- Связь категорий с публикациями
INSERT INTO articles_categories (article_id, category_id) VALUES
${createString(generateArticlesToCategories(countArticle, categories.length))}
`;


module.exports = {
  name: `--fill`,
  async run(args) {
    const users = await readContent(FILE_USERS_PATH);
    const emails = await readContent(FILE_EMAILS_PATH);
    const avatars = await readContent(FILE_AVATARS_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const pictures = await readContent(FILE_PICTURES_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (count > MAX_ARTICLES_NUMBER) {
      console.error(chalk.red(Messages.OVERMUCH));
      process.exit(EXIT_CODE_FAILURE);
    }
    const content = generateSql(countArticle, users, emails, avatars, categories, comments, sentences, titles, pictures);

    try {
      await fs.writeFile(FILL_DB_FILE, content);
      console.info(chalk.green(Messages.SUCCESS));
    } catch (error) {
      console.error(chalk.red(Messages.WRITING_ERROR));
    }
  }
};
