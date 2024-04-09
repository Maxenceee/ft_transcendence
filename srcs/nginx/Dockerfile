#Nginx container

#init the base environement
FROM debian:oldstable
RUN apt update -y && apt upgrade -y
RUN apt install nginx curl openssl -y

#copy the nginx config file
COPY ./nginx.conf /etc/nginx/nginx.conf

#generate the ssl autosigned key
RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -newkey rsa:2048 \
	-keyout /etc/nginx/ssl/tracendance.418.tl.key \
	-out /etc/nginx/ssl/tracendance.418.tl.crt \
	-subj "/C=TL/L=TeapotCity/O=418/UID=tracendance"

#set the working directory
WORKDIR /etc/nginx/

#launch
CMD ["nginx", "-g", "daemon off;"]