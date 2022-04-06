# Install dependencies
FROM node:16.14-alpine as install

WORKDIR /usr/src/app

ARG OPS_ENV=local
ENV REACT_APP_OPS_ENV=$OPS_ENV

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --production=false

EXPOSE 3000

# production build
FROM node:16.14-alpine as build

WORKDIR /usr/src/app

ARG OPS_ENV=local
ENV REACT_APP_OPS_ENV=$OPS_ENV
ENV SKIP_PREFLIGHT_CHECK=true

COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

# nginx
FROM nginx:1.20-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

