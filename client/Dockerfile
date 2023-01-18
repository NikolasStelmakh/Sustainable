FROM node:18.13.0

WORKDIR /usr/sustainable/client

COPY package.json /usr/sustainable/client
RUN npm i

COPY . .

EXPOSE 3010
CMD ["npm", "run", "start"]
