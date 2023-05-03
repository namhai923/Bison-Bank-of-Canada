FROM node:17-alpine
RUN mkdir -p /app
WORKDIR /app
COPY back-end/package*.json ./
RUN npm install
COPY back-end/ .
EXPOSE 5000
CMD ["npm", "start"]