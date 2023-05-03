FROM node:17-alpine
RUN mkdir -p /app
WORKDIR /app
COPY front-end/package*.json ./
RUN npm install
COPY front-end/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]