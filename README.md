Implementation from Stephen

# New Endpoints
- `posts` -> All posts in the database
- `posts/limit` -> Returns posts with a certain amount (default 200). For example `posts/limit=20`.
- `posts/title` -> Matches posts with a title (default all posts). For example `posts/title=book`.
- `posts/sort` -> Returns posts which are sorted by either title or time(default by ascending order). For example, `posts/sort=title:desc,createdAt:desc` 

# Random users generator
- `/random/:number` -> Creates (number) users with random names, DoB, and 10 posts of each created user.
- Package used to generate random data: `node-random-name`, `random-birthday`, `node-randomstring` and `random-date-generator`.
