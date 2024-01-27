# FROM debian:oldstable

# # Install python3 and pip3 and django
# RUN apt-get update && apt-get install -y \
# 	python3 \
# 	python3-pip \
# 	python3-django \
# 	python3-django-common \
# 	python3-django-doc \
# 	python3-django-horizon \
# 	python3-django-pyscss \
# 	python3-django-tables2 \
# 	python3-django-testscenarios \
# 	python3-django-uwsgi \
# 	python3-django-uwsgidecorators \
# 	python3-django-xmlrpc \
# 	python3-djangorestframework \
# 	python3-djangorestframework-doc

# WORKDIR /app

# # Copy the current directory contents into the container at /app
# ADD . /app

# # Install any needed packages specified in requirements.txt
# RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

# # Make port 80 available to the world outside this container
# EXPOSE 80 443

# # Define environment variable
# ENV NAME World

# # Run app.py when the container launches
# CMD ["python3", "manage.py", "runserver"]


############################################
#
# Server de test temporaire
#
############################################

FROM node:18-alpine

#Create app dir 
WORKDIR /app

#Install dependendies
COPY express.tmp/package.json .

#Run npm install
RUN npm install

#Bundle app source
COPY express.tmp .

COPY client .

EXPOSE 3004

#Start app
CMD [ "npm", "run", "dev" ]