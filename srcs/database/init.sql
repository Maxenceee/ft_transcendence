CREATE USER ENV_USERNAME WITH PASSWORD ENV_POSTGRES_PASSWORD;

CREATE DATABASE ENV_POSTGRES_DB;
GRANT ALL PRIVILEGES ON DATABASE ENV_POSTGRES_DB TO ENV_USERNAME;