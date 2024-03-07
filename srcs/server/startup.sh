#!/bin/sh

python3 manage.py migrate

python3 manage.py collectstatic -c --noinput

python3 manage.py runserver 0.0.0.0:3000