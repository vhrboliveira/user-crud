# USER - Crud

## Requirements

In order to run this service, you must have installed:
  - [**NodeJS**](https://nodejs.org/en/download/) (preferable v14.16.1)
  - [**NPM**](https://nodejs.org/en/download/) (preferable v6.14.12)
  - [**Docker**](https://store.docker.com/search?type=edition&offering=community)
  - [**Docker Compose**](https://docs.docker.com/compose/install/)

#
## Starting the service

**To start the service, you can run with two possibilites:**

  1. Monitoring any changes in your code:

    npm run docker:dev

  2. Without monitoring the changes in your code (If you change the code, you will need to restart the service):

    npm run docker

Your service will be running on: [http://localhost:4000](http://localhost:4000).
#
## Documentation and try it out
**Once your application is running, in order to see the API documentation and try it out with Swagger, you can access: [http://localhost:4000/doc](http://localhost:4000/doc)** 
#
## Logs
**To see the logs while running the service, run the script:**

    npm run docker:logs
#
## Stopping the service
**To stop the service, run the script:**

    npm run docker:down
#
## Running Integration Tests
**To run the integration tests, run the script:**
    
    npm run docker:test
  
