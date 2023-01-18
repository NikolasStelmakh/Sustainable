FROM node:18.13.0

WORKDIR /usr/sustainable/server

COPY package.json /usr/sustainable/server
RUN npm i

COPY . .

RUN ls

EXPOSE 3000
RUN npm run seed
CMD ["npm", "run", "server:prod"]
