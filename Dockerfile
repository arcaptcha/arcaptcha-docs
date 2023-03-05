FROM node:16.14.0 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Deployment step

FROM nginx:1.16.0-alpine

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/

COPY --from=build /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]