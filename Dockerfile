FROM node:22-alpine AS build

WORKDIR /so-chart

COPY . .

RUN npm install --global pnpm@9.15.5 \
  && pnpm install --frozen-lockfile
RUN pnpm run preview:build

FROM nginx:1.27-alpine

COPY server.conf /etc/nginx/conf.d/default.conf
COPY --from=build /so-chart/dist /usr/share/nginx/html

EXPOSE 31450
CMD ["nginx", "-g", "daemon off;"]
