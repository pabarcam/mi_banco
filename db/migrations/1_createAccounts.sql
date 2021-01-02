DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts(
  id SERIAL PRIMARY KEY,
  balance INT CHECK (balance >= 0)
);