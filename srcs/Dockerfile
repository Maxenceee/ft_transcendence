# Utilisez une image Node.js pour exécuter Webpack
FROM node AS builder

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de l'application client
COPY ./client /app/client

# Installez les dépendances et compilez l'application client avec Webpack
WORKDIR /app/client
RUN npm install
RUN npm run pack

# Passez à la configuration du serveur Django
FROM python:3.10-slim

RUN apt-get update -y && apt-get upgrade -y

RUN pip install --upgrade pip

RUN pip install django==4.0.0 channels==3.0.4 psycopg2-binary python-dotenv passlib requests django-cors-headers Twisted[tls,http2] Pillow

RUN apt-get install -y curl wget 
# nodejs npm

# Copiez l'application serveur
RUN mkdir /app
COPY ./server /app/server
# COPY ./client /app/client

# Copiez les fichiers statiques compilés à partir de l'application client
COPY --from=builder /app/client /app/client
# WORKDIR /app/client

# RUN npm install
# RUN npm update
# RUN npm run pack

WORKDIR /app/server

EXPOSE 3000

CMD ["sh", "./startup.sh"]