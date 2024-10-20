# API - TypeScript - Redis - Docker - Swagger - Jest

### Description
This is a basic example of a TS api using third party api, in this case, I'm using Amdoren Currency Api, 
but the main point of this is including the services of Redis to caching data, and respond to clients faster.
So, in the first request we take x time to make a request (usually one second or more), and the second time
we take less than 100ms to retrieve the info to the user.

#### Main Points
* Swagger
  * This project has **implemented Swagger Docs**, so if you navigate to "http://localhost:5500/docs/#" after starting
    the project, you can test the endpoints.
* Jest
  * Also, this project has implemented **jest unit testing**, and I have made the testing functions for the main controller
    of the app (CurrencyController).
* Good practices
  * The CurrencyController uses **dependency injection**, so it was easier to make the testing functions. It receives two
    arguments, provider service and caching service both **based on interfaces**, so, if we want to change the strategy we just
    have to create another class implementing those interfaces.
* Docker
  * This app uses **docker power**, so if you want to run it on your machine just navigate to the root of the project,
    add a .env file (you have the .env.example, so you just have to add the missing values), and run *docker compose up*

#### How to run it
> [!NOTE]
> You will have to create an account on [https://www.amdoren.com/currency-api/](https://www.amdoren.com/currency-api/) to get the api_key

> [!NOTE]
> You must have Docker installed and running on your machine

1. Clone the project
2. Install dependencies with *npm install*
3. Add the api key (token) in the .env file
4. Run *docker compose up -d"
