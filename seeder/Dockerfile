FROM node:18-alpine

WORKDIR /app

# Kopier package.json først
COPY package*.json ./

# Installer dependencies
RUN npm install

# Kopier TypeScript kode
COPY . .

# Byg TypeScript
RUN npm run build

# Start kommando
CMD ["npm", "run", "seed"]
