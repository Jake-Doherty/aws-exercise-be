-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE cognito_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sub VARCHAR(255) NOT NULL
);

CREATE TABLE stripe_customers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES cognito_users(id)
);