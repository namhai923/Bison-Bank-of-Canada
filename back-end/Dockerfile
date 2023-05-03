# FROM node:17-alpine
# WORKDIR /Bison-Bank-of-Canada/back-end
# COPY . .
# RUN npm install
# EXPOSE 5000
# CMD ["npm", "ci"]
# CMD ["npm", "start"]

FROM node:17-alpine
WORKDIR /Bison-Bank-of-Canada/back-end
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 5000
CMD ["npm", "start"]