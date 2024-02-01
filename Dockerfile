FROM node:21-alpine

WORKDIR /

COPY . /app

RUN npm install pnpm

RUN pnpm install

EXPOSE 8000

CMD ["pnpm", "start"]