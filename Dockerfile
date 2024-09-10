FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10086
CMD ["npm", "run", "dev:h5"]
