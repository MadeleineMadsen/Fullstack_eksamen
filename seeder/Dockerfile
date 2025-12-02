FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Wait for database to be ready and then run seeds
CMD ["sh", "-c", "sleep 20 && npm run seed"]