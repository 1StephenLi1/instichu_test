Implementation from Stephen

# Instructions

- Packages used: `express` and `mongoose`
- Install packages before running files
- To run the files, enter `$node app.js`
- I used `Postman` to do the check the endpoints

# Endpoints
- `POST /users` to create new user
- `GET /users/{userId}` to view an user by ID
- `POST /users/{userId}/posts` to create a new post under an user
- `GET /users/{userId}/posts` to list all posts owned by an users
- `GET /users/{userIdd}/posts/{postId}` to get one post owned by an users

# New Endpoints
- `posts` -> All posts in the database
- `posts/limit` -> Returns posts with a certain amount (default 200). For example `posts/limit=20`.
- `posts/title` -> Matches posts with a title (default all posts). For example `posts/title=book`.
- `posts/sort` -> Returns posts which are sorted by either title or time(default by ascending order). For example, `posts/sort=title:desc,createdAt:desc` 

# Random users generator
- `POST user/random/:number` -> Creates (number) users with random names, DoB, and 10 posts of each created user.
- Package used to generate random data: `node-random-name`, `random-birthday`, `node-randomstring` and `random-date-generator`.
