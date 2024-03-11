#Nginx container

#init the base environement
FROM debian:oldstable
RUN apt update -y && apt upgrade -y
RUN apt install nginx curl -y

COPY /opt/bitnami/apache/conf/bitnami/certs/maxencegama.dev_ssl_certificate.cer /etc/nginx/ssl/
COPY /opt/bitnami/apache/conf/bitnami/certs/dev_private_key.key /etc/nginx/ssl/

#copy the nginx config file
COPY ./nginx.conf /etc/nginx/nginx.conf

#set the working directory
WORKDIR /etc/nginx/

#launch
CMD ["nginx", "-g", "daemon off;"]