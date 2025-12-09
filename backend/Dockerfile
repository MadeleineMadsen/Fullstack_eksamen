FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# COPY logs/ ./logs/
EXPOSE 5000
CMD ["npm", "start"]