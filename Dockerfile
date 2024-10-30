# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

RUN --mount=type=secret,id=github_token,env=GITHUB_TOKEN,required \
    --mount=type=secret,id=github_username,env=GITHUB_USERNAME,required \
    echo "Secrets are mounted for authentication"

COPY . .
RUN npm install && npm run build
FROM nginx:alpine
EXPOSE 80
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
