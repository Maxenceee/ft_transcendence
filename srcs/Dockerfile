FROM python:3.7

RUN apt-get update -y && apt-get upgrade -y

RUN pip install Django

RUN mkdir /app

COPY ./server/src /app/server

WORKDIR /app/server

COPY ./client /app/client

EXPOSE 8000

RUN python3 manage.py makemigrations

RUN python3 manage.py migrate

CMD ["python3", "manage.py", "runserver"]
