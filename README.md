# Pipe-it

## Overview
**Pipe-it** is a <u>webhook management Back-End REST API</u> that allows users to create webhooks' pipelines and specifying a source URL, an action and a list of subscribers to receive the result. The user can create a task by triggering a webhook. The task is added to a job queue, executed asynchronously, and the result is delivered to the subscribers.

This is the final project in **Foothill Technology Solutions (FTS)** <u>Back-End Internship</u> (Feb. - Mar. 2026). 
___

## Supported Actions
#### **<u>Text Summarization</u>**
Summarize text using **_Gemini API_**.

#### **<u>Text Translation</u>**
Translate text into a specified target language using **_DeepL API_**.

#### **<u>Weather in a City</u>**
Retrieve weather data for a given city using **_Weatherbit API_**. City names are automatically converted into latitude and longitude using **_Nominatim / OpenStreetMap API_**.

#### **<u>Today's Matches</u>**
Fetches today's matches in popular leagues using **_API-Football API_**, extract the required fields and re-format them with an enhanced structure. 
___

## Basic Technologies
* **`TypeScript`** Language. 
    * **`Express`** Back-End Framework. 
* **`PostgresSQL`** Relational Database. 
    * **`Drizzle ORM`**.
* **`Redis`**: Implementing _Rate-Limiter_ & _Job-Queue_ via `BullMQ`. 
___

## Architecture
* **`src`**: 
    * **`db`**: Database-related code. 
        * `index.ts`: Creates a connection to the database. 
        * `schema.ts`: Defines tables and relations. 
        * `queries`: Implements CRUD operations for each table. 
    * **`types`**: Defines application types, request DTO and response DTO for each entity.
    * **`assets`**: Contains HTML templates used for emails (In case of forget password).
    * **`utils`**: Utility functions such as:
        * `encryption.ts`: Uses `argon2` for password hashing and verification.
        * `jwt.ts`: Handles creation and validation of JWTs and refresh tokens.
        * `password-strength-checker.ts`: Checks whether a password is strong.
        * `password-generator.ts`: Generates a random strong password.
        * `templates-generator.ts`: Reads HTML templates and replaces placeholders before sending them via email.
        * `email-sender.ts`: Sends HTML emails using predefined templates.
    * **`errors`**: Creates custom `HttpErrors` that extends `Error` class. 
    * **`services`**: Implements core business logic.
    * **`controllers`**: Extracts request parameters and body, calls service layer methods, and returns responses. 
    * **`middlewares`**: 
        * `error-handler.ts`: Returns error responses for the failed requests. 
        * `rate-limiter.ts`: Implements three rate-limiting strategies for <u>users</u>, <u>webhooks</u> and <u>tasks</u> requests, allowing different behaviors for window time and maximum requests.
    * **`routes`**: Defines API routes and registers controllers' methods and middlewares -If any-. 
    * **`actions`**: 
        * `summarization.ts`: Implements <u>Text Summarization</u> action.
        * `translation.ts`: Implements <u>Text Translation</u> action.
        * `weather-query.ts`: Implements <u>Weather in a City</u> action.
        * `today-matches.ts`: Implements <u>Today's Matches</u> action.
        * `action-executor.ts`: Executes a specific action and returns the result.
    * **`queue`**: 
        * `tasks-queue`: Creates a Job-Queue for tasks using `BullMQ`.
        * `tasks-worker`: Create a worker to execute the tasks asynchronously and send the result to the subscribers. 
    * **`config.ts`**: Defines and loads the application configuration from `.env` file.
    * **`index.ts`**: Application entry point.
* **`.github/workflows/ci.yml`**: Defines a CI pipeline for building the project, running the test cases -If any-, and checking code formatting and linting.
* **`Dockerfile`**: Builds the Node application. 
* **`docker-compose.yml`**: Builds and runs everything in different containers using `docker compose up`.
___

## Database Schema
#### Users

| Column      | Type         |
|-------------|--------------|
| id          | UUID         |
| first_name  | VARCHAR(256) |
| last_name   | VARCHAR(256) |
| username    | VARCHAR(256) |
| password    | VARCHAR(256) |
| email       | VARCHAR(256) |
| created_at  | TIMESTAMP    |
| updated_at  | TIMESTAMP    |

#### Refresh Tokens

| Column      | Type         |
|-------------|--------------|
| token       | TEXT         |
| user_id     | UUID         |
| created_at  | TIMESTAMP    |
| updated_at  | TIMESTAMP    |
| expires_at  | TIMESTAMP    |
| revoked_at  | TIMESTAMP    |

#### Webhooks

| Column      | Type                                                                 |
|-------------|----------------------------------------------------------------------|
| id          | UUID                                                                 |
| source      | VARCHAR(512)                                                         |
| action      | ENUM (SUMMARIZATION, TRANSLATION, WEATHER-QUERY, TODAY-MATCHES)      |
| user_id     | UUID                                                                 |
| created_at  | TIMESTAMP                                                            |
| updated_at  | TIMESTAMP                                                            |

#### Subscribers

| Column      | Type         |
|-------------|--------------|
| id          | UUID         |
| url         | VARCHAR(512) |
| webhook_id  | UUID         |

#### Tasks

| Column       | Type                                              |
|--------------|---------------------------------------------------|
| id           | UUID                                              |
| webhook_id   | UUID                                              |
| payload      | JSONB                                             |
| status       | ENUM (CREATED, IN_PROCESS, FINISHED)              |
| created_at   | TIMESTAMP                                         |
| processed_at | TIMESTAMP                                         |

#### Deliveries

| Column           | Type                                      |
|------------------|-------------------------------------------|
| id               | UUID                                      |
| task_id          | UUID                                      |
| subscriber_id    | UUID                                      |
| attempts_number  | INTEGER                                   |
| status           | ENUM (NOT_DELIVERED, FAILED, SUCCESS)     |
| delivered_at     | TIMESTAMP                                 |
___

## Running the Project 
#### Using Docker (Recommended)
Requirements: `Docker`. 
```shell
git clone https://github.com/najat-mansour/pipe-it.git
cd pipe-it 
cp .env.example .env                # Creates .env file                                  
docker compose up 
```
#### Local Development Setup  
Requirements: `Node.js`, `postgresSQL`, `Docker`.
```shell
git clone https://github.com/najat-mansour/pipe-it.git     
cd pipe-it  
cp .env.example .env                # Creates .env file                                  
npm install                         # Install project dependencies
npm run generate                    # Generate database schema (Drizzle)
npm run migrate                     # Run database migrations
docker run -d -p 6379:6379 redis    # Start Redis container
npm run start                       # Start the back-end server
npm run worker                      # Start the background worker
```
___

## Developer
**&copy; Najat Mansour - March 2026.**