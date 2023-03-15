FROM node:17-alpine
WORKDIR /Bison-Bank-of-Canada/front-end
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "ci"]
CMD ["npm", "start"]