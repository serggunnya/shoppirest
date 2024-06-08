## Приложение Интернет магазин.

React, RTK query, Typescript, Nest, Postgres(Supabase), hosting (Render.com)

- [x] - Получение списка товаров
- [x] - Получение категории с атрибутами поиска
- [ ] - Постраничная навигация
- [ ] - Получение данных товара (описание, параметры и изображения)
- [ ] - Фильтрация товаров
- [ ] - JWT Авторизация и аутентификация

### Клиентское React приложение

- https://shoppirest.onrender.com

### Swagger спецификации API эндпоинтов

- https://shoppirest-api.onrender.com/docs

### База данных

![схема](schema.png?raw=true)

#### Скрипты (package.json)

`nest:dev`- запуск сервера в режиме разработки

`react:dev` - запуск react клиента в режиме разработки

`start:dev` - запуск сервера и react клиента

`nest:build` - сборка сервера

`prisma:gen` - сгенерировать PrismaClient на основе файла schema.prisma.

`prisma:push` - создать таблицы в базе данных на основе файла schema.prisma

`prisma:seed` - заполнить таблицы данными на основе файла seed.ts

#### Переменные окружения

SUPABASE_URL=""
SUPABASE_KEY=""
DATABASE_URL=""
ACCESS_SECRET=""
REFRESH_SECRET=""
