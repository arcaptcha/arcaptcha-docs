FROM node:16.14.0 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Deployment step

FROM busybox:1.35 as deploy

RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /usr/src/app/build/ ./

EXPOSE 3000

CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]