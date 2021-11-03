FROM node:14.15.0-alpine

WORKDIR /usr/src/app

COPY package.* /usr/src/app

RUN yarn install

COPY . /usr/src/app

EXPOSE 3000

CMD ["sh", "-c", "yarn build && yarn serve"]