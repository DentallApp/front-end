#
# Build stage/image
#
FROM node:14.17.0-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

#
# Final stage/image
#
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html

# Copy config nginx
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from build stage
COPY --from=build /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]