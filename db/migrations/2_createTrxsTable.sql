DROP TABLE IF EXISTS trxs;

CREATE TABLE trxs(
  id SERIAL PRIMARY KEY,
  description VARCHAR(100),
  date timestamp NOT NULL DEFAULT NOW(),
  amount INT,
  accountId INT,
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);