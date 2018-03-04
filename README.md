# NC News Backend

I have used Node.js, Express and MongoDB to build an API for my [Reddit](https://www.reddit.com/) clone. This repository will store article, comment and user data and their relationships. Serving this information via RESTful endpoints. The frontend for this application will consume this data, I will provide a url for this at a later date.

A link to the deployed version will be added later.

## Getting Started

I have followed TDD (Test Driven Development) best practises when building this application. If you would like to see the tests in action or run the application locally instructions to do so are below.

### Prerequisites

This application uses Node v8.9.4 (Stable) and MongoDB v3.4.4. To verify you have each installed you will need to open a terminal window and run the following commands

```
$ which node
$ which mongod
```

If either/both command does not return a file path you will need to follow the appropriate instructions below:

* [Node (and npm)](https://docs.npmjs.com/getting-started/installing-node)
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)

### Installing

After verifying you have both Node.js and MongoDB installed you can install a local version by completing the following steps:

1. Open a terminal instance
2. Clone this repository from GitHub by running `git clone https://github.com/adieCodes/nc-news-be.git` in the terminal
3. Add dependencies by typing `npm install` in the terminal
4. Run an instance of the database using the command `mongod`, this will keep running in that terminal window
5. Start a new terminal window and enter `npm run seed:dev` to add data to the database. This may take a few minutes as there's a fair amount of data. When the process is complete the console will display 'Database seeded' and the node process will terminate.
6. You can then run the application using `npm run dev`

## Running the tests

To run the tests you will need to open a new terminal instance and run `npm test`. You will see the result of each test along with a brief explanation of the test.

### What's tested?

Each of the applications endpoints, with both successful and unsuccessful requests (where applicable).

#### Routes

* `GET /api/topics` - Return all topics
* `GET /api/topics/:topic_id/articles` - Return all articles for a particular topic ID
* `GET /api/articles` - Return all articles
* `GET /api/articles/:article_id/` - Return an individual article by its ID
* `GET /api/articles/:article_id/comments` - Return all comments for a single article ID
* `POST /api/articles/:article_id/comments` - Add a new comment to the appropriate article ID
* `PUT /api/articles/:article_id` - Increment/decrement votes on an article
* `PUT /api/comments/:comment_id` - Increment/decrement votes on a comment
* `DELETE /api/comments/:comment_id` - Delete a comment
* `GET /api/users/:username` - Return a user profile

### Build steps

Build steps are included to ensure:

1. code meets [Airbnb's JavaScript style guide](https://github.com/airbnb/javascript)
2. tests are passed before code is committed to git

## Built With

* [NodeJS](https://nodejs.org/en/) - JavaScript runtime
* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [Mongoose](http://mongoosejs.com/) - Object Data Modeling (ODM) for mongo
* [Express](https://expressjs.com/) - Web Application Framework

## Worth noting

The `config` file has been commited to allow local deployment and testing, under usual circumstances this would have been added to the `gitignore`.

## Acknowledgments

Everyone at [Northcoders](https://northcoders.com/) for their outstanding curriculum and support. They gave me the knowledge and confidence to build a career in Software Development.
