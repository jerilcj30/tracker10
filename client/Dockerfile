FROM node:18.18.2-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN chown -R node:node node_modules

COPY . .

RUN npm run build


FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY default.conf  /etc/nginx/conf.d/default.conf

COPY --from=development /usr/src/app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]


