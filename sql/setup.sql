-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS cognito_users CASCADE;
DROP TABLE IF EXISTS stripe_customers CASCADE;
-- DROP TABLE IF EXISTS stripe_cognito CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

-- CREATE TABLE cognito_users (
--   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   sub VARCHAR(255),
--   email VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE stripe_customers (
  -- id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- customer_id VARCHAR(255) UNIQUE,
  -- start_date VARCHAR(255) NOT NULL,
  -- end_date VARCHAR(255) NOT NULL,
  -- is_active VARCHAR DEFAULT false
-- );

-- CREATE TABLE stripe_cognito (
--   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--   stripe_id BIGINT,
--   cognito_id BIGINT,
--   FOREIGN KEY (stripe_id) REFERENCES stripe_customers(id),
--   FOREIGN KEY (cognito_id) REFERENCES cognito_users(id)
-- );

CREATE TABLE cognito_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sub VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL
);  

CREATE TABLE stripe_customers (
aws_sub VARCHAR(255) UNIQUE,
customer_id VARCHAR(255) UNIQUE PRIMARY KEY NOT NULL,
email VARCHAR(255),
name VARCHAR(255),
phone VARCHAR(255),
FOREIGN KEY (aws_sub) REFERENCES cognito_users(sub) 
);

CREATE TABLE subscriptions (
customer_id VARCHAR(255)UNIQUE NOT NULL,
subscription_id VARCHAR(255)  PRIMARY KEY NOT NULL,
is_active BOOLEAN NOT NULL,
FOREIGN KEY (customer_id) REFERENCES stripe_customers(customer_id)
);
 
 CREATE TABLE invoices (
  customer_id VARCHAR(255)  NOT NULL,
  invoice_id VARCHAR(255)   PRIMARY KEY,
  start_date BIGINT ,
  end_date BIGINT ,
  invoice_status VARCHAR(255) ,
  subscription_id VARCHAR(255) NOT NULL,
  amount_due DECIMAL(9,2) ,
  amount_paid DECIMAL(9,2) ,
  FOREIGN KEY (customer_id) REFERENCES stripe_customers(customer_id)
 )

