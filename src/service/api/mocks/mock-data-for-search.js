'use strict';

const mockCategories = [
  `Авто`,
  `Разное`,
  `IT`,
  `Кино`,
  `За жизнь`,
  `Деревья`,
  `Без рамки`
];


const mockArticles = [
  {
    "user": `petrov@example.com`,
    "title": `Сколько людей на самом деле живет в Китае?`,
    "createdAt": `2020-10-19T18:30:59.785Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Когда-то была профессия будильщика - по утрам специальный человек ходил и стучал палкой в окна людей. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь.`,
    "categories": [
      `Авто`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Согласен с автором! Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Планируете записать видосик на эту тему`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Что такое золотое сечение`,
    "createdAt": `2020-08-24T05:50:35.096Z`,
    "announce": `Основываясь на математических моделях в Китае проживает не более 500 миллионов человек. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Лисица размножается раз в год, весной. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fullText": `Таяние Арктических льдов на 70 лет опередило мрачные прогонозы.`,
    "categories": [
      `Разное`,
      `IT`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Планируете записать видосик на эту тему Плюсую, но слишком много буквы!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Коты. Друзья или поработители человечества.`,
    "createdAt": `2020-09-06T19:57:41.918Z`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Основываясь на математических моделях в Китае проживает не более 500 миллионов человек. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Основываясь на математических моделях в Китае проживает не более 500 миллионов человек. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения.`,
    "categories": [
      `Кино`,
      `За жизнь`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "title": `Таяние льдов Арктики. Миф или реальность?`,
    "createdAt": `2020-09-24T12:51:57.164Z`,
    "announce": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы считаете, что заводите кота для себя, чтобы гладить теплое и пушистое существо и снимать стресс. Возможно, главный в доме уже не вы. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Лисица размножается раз в год, весной. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Когда-то была профессия будильщика - по утрам специальный человек ходил и стучал палкой в окна людей. Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Основываясь на математических моделях в Китае проживает не более 500 миллионов человек. Таяние Арктических льдов на 70 лет опередило мрачные прогонозы. Лисица размножается раз в год, весной.`,
    "categories": [
      `Деревья`,
      `Без рамки`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного... Хочу такую же футболку :-)`
      }
    ]
  }
];

module.exports = {
  mockCategories,
  mockArticles
};
