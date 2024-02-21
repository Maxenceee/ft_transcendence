#!/bin/sh
echo "Starting Django Server"

python3 manage.py makemigrations

echo "migrations prapared"

python3 manage.py migrate

echo "migrations done"

python manage.py showmigrations

echo "migrations shown"

python3 manage.py runserver 0.0.0.0:3000
