FROM node:18.20.0-alpine3.19

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install --force

# Copier tout le projet
COPY . .

# Exposer le port Angular
EXPOSE 4200

# Lancer le serveur Angular
CMD ["npm", "run", "start"]
