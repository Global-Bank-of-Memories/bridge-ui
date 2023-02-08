FROM node:14-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm -v
RUN npm cache clean --force
RUN npm config set strict-ssl=false
RUN npm install --no-package-lock
RUN npm run build:prod

EXPOSE 4200
CMD ["npm", "run", "start:prod"]
