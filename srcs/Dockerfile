FROM python:3.9-slim

RUN apt-get update -y && apt-get upgrade -y

RUN pip install --upgrade pip

RUN pip install django==4.0.0 channels==3.0.4 psycopg2-binary python-dotenv passlib requests

RUN apt-get install -y curl wget

RUN mkdir /app

EXPOSE 3000

WORKDIR /app/server

COPY ./client /app/client

COPY ./server/ /app/server

CMD ["sh", "./startup.sh"]
