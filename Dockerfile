FROM node:20 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG GOFTINO_WIDGET_ID
ARG GOFTINO_ENABLED
ENV GOFTINO_WIDGET_ID=$GOFTINO_WIDGET_ID
ENV GOFTINO_ENABLED=$GOFTINO_ENABLED
RUN npm run build

# Deployment step

FROM nginx:1.25-alpine

COPY --from=build /usr/src/app/nginx.conf /etc/nginx/

COPY --from=build /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]