# NC Games Backend API

This project serves as the backend API for the Newsworthy application, which provides features for tracking news events and articles with; comments, and likes or dislikes on those comments. It was developed as part of my continued personal development working at Northcoders.

The API is hosted on (INSERT HERE) and can be accessed at [Newsworthy API](TBA)

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Jest
- Supertest
- JWT

## API Documentation

All endpoints serve JSON responses. Detailed instructions on how to use the endpoints can be found in the `endpoints.json` file. Here is an example:

```json
"GET /api/topics": {
      "description": "serves all topics with there slug and description",
      "exampleResponse": {
        "topics": [
          {
            "description": "The man, the Mitch, the legend",
            "slug": "mitch"
          },
          {
            "description": "Not dogs",
            "slug": "cats"
          }
        ]
      }
    }
```

## Error Handling

The API is set up to provide generic error messages to protect the database but does give useful HTTP status codes to indicate the nature of the error:

- `400` for user errors
- `404` when the requested resource could not be found
- `500` when there is a server error

It also provides appropriate `200` level status codes for successful requests.

## Getting Started

### Prerequisites

- Node.js v18 or later
- PostgreSQL 14 or later

### Installation

1. Fork the repository.
2. Run `npm install` to install all the dependencies listed in the `package.json`.

### Initialising the Databases

1. Run `npm run setup-dbs` to set up the PostgreSQL databases.
2. Run `npm run seed` to populate the databases with data.

### Connecting to Local Database

To connect to your own database locally, create `.env.development` and `.env.test` files in the root folder of this project. These files should contain `PGDATABASE=<newsworthy>` and `PGDATABASE=<newsworthy_test>` respectively. Refer to the `env-example` file for a template.

### Testing

Run `npm test` to execute the tests using Jest. To start the local server, run `npm run dev`.

## Contributing

If you wish to contribute, you can make a pull request or drop a comment.

## Versioning

This is version 1.0 of the Newsworthy Backend API.

## License

This project is fully open-source and is available under the [MIT License](LICENSE).
