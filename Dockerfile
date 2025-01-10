FROM node:20-alpine3.19
COPY . /app
WORKDIR /app
RUN npm install && \
  npm run start

CMD ["node", "/app/dist/index.js"]