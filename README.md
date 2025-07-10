# Demo Shop - Backend - API REST

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## After clone, do

1. Install dependencies

   ```sh
   yarn install
   ```

2. Create `.env` file from `.env.template`. Then, Fill in the required environment variables in the `.env` file.

3. Get up Docker environment

   ```sh
   docker-compose up -d
   ```

4. Execute app

   ```sh
   yarn start:dev
   ```

5. Load test data to database for development

   ```http
   GET http://localhost:3000/api/seed
   ```

6. Ready to develop
