### STAGE 1: Build ###
FROM node:13-alpine3.10 AS build
WORKDIR /usr/src/app
COPY . .
RUN npm install --no-package-lock
RUN npm install -g @angular/cli
RUN ng build --prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/doctor-at-home /usr/share/nginx/html
