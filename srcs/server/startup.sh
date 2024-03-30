#!/bin/sh
cd /app/client && npm run pack

cd /app/server

python3 manage.py makemigrations

python3 manage.py makemigrations index

python3 manage.py makemigrations game

python3 manage.py migrate

python3 manage.py collectstatic -c --noinput

python3 manage.py runserver 0.0.0.0:3000