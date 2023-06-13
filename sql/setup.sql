-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS cognito_users CASCADE;
DROP TABLE IF EXISTS stripe_customers CASCADE;
DROP TABLE IF EXISTS stripe_cognito CASCADE;

CREATE TABLE cognito_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sub VARCHAR(255),
  email VARCHAR(255) NOT NULL
);

CREATE TABLE stripe_customers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id VARCHAR(255) UNIQUE,
  -- start_date VARCHAR(255) NOT NULL,
  -- end_date VARCHAR(255) NOT NULL,
  is_active VARCHAR DEFAULT false
);

CREATE TABLE stripe_cognito (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stripe_id BIGINT,
  cognito_id BIGINT,
  FOREIGN KEY (stripe_id) REFERENCES stripe_customers(id),
  FOREIGN KEY (cognito_id) REFERENCES cognito_users(id)
);

