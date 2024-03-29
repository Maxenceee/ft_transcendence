# Utilisez une image Python comme base
FROM python:3.10-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Installez Node.js et npm
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

COPY ./client/package.json /app/client/package.json
WORKDIR /app/client
RUN npm install

WORKDIR /app

# Installez les dépendances Python pour le serveur Django
RUN pip install --upgrade pip

RUN pip install django==4.0.0 channels==3.0.4 psycopg2-binary python-dotenv passlib requests django-cors-headers Twisted[tls,http2] Pillow

# Copiez les fichiers de l'application
COPY ./server /app/server
COPY .env /app/client/.env
COPY ./client /app/client

# Déplacez-vous vers le répertoire client
WORKDIR /app/client

# Installez les dépendances Node.js et compilez l'application client avec Webpack
RUN npm run pack

# Revenez au répertoire principal de l'application
WORKDIR /app/server

# Exposez le port 3000
EXPOSE 3000

# Définissez la commande de démarrage
CMD ["sh", "./startup.sh"]
