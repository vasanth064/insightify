FROM node:21-alpine

WORKDIR /app

COPY . /app

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 8000

CMD ["pnpm", "start"]

