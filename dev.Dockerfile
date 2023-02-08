FROM node:14-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200

CMD ["npm", "run", "start"]
