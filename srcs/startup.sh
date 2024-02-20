#!/bin/sh
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser --

python3 manage.py runserver 0.0.0.0:3000