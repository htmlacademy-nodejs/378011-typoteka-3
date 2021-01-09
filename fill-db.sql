-- добавление пользователей
INSERT INTO users (first_name, last_name, email, password, avatar)
VALUES
('Alexander', 'Petrov', 'alex@fmail.com', 'qwerty', 'avatar'),
('Tatyana', 'Veselova', 'tatyana@fmail.com', 'ytrewq', 'foto');


-- добавление публикаций
INSERT INTO articles (title, announce, full_text, created_date, picture, user_id)
VALUES
(
 'Что такое золотое сечение',
  'Это один из лучших рок-музыкантов. Он написал больше 30 хитов.',
  'Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.',
  '2020-12-03',
  'picture',
  2
),
(
 'Как собрать камни бесконечности',
  'Лисица размножается раз в год, весной.',
  'Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.',
  '2019-12-03',
  'foto',
  1
),
(
 'Таяние льдов Арктики. Миф или реальность?',
  'Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Основываясь на математических моделях в Китае проживает не более 500 миллионов человек.',
  'Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
  '2020-12-07',
  'picture',
  1
);

-- добавление комментариев
INSERT INTO comments (text, created_date, article_id, user_id)
VALUES
(
 'Совсем немного... Согласен с автором! Мне кажется или я уже читал это где-то?',
  '2020-12-08',
  1,
  1
),
(
 'Это где ж такие красоты?',
  '2020-12-08',
  1,
  2
),
(
 'Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.',
  '2020-12-29',
  2,
  1
),
(
 'Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.',
  '2020-12-28',
  2,
  2
),
(
 'Хочу такую же футболку :-) Плюсую, но слишком много буквы!',
  '2020-12-29',
  3,
  1
),
(
 'Планируете записать видосик на эту тему',
  '2020-12-28',
  3,
  2
);

-- добавление категорий
INSERT INTO categories (title)
VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо'),
('Читальный зал'),
('Авто'),
('Насущные проблемы России'),
('DIY'),
('Робототехника');


-- связь категорий с объявлениями
INSERT INTO articles_categories (article_id, category_id)
VALUES
(1, 4),
(1, 3),
(1, 14),
(1, 13),
(2, 4),
(2, 8),
(2, 12),
(3, 12);
