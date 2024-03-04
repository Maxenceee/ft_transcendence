#Nginx container

#init the base environement
FROM debian:oldstable
RUN apt update -y && apt upgrade -y
RUN apt install nginx curl -y

#copy the nginx config file
COPY ./nginx.conf /etc/nginx/nginx.conf

#set the working directory
WORKDIR /etc/nginx/

#launch
CMD ["nginx", "-g", "daemon off;"]