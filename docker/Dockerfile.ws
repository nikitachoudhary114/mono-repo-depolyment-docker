FROM oven/bun:1

WORKDIR /usr/src/app

COPY ./package.json /package.json
COPY ./bun.lock ./bun.lock
COPY ./packages ./packages
COPY ./turbo.json ./turbo.json

COPY ./apps/ws ./app/ws

RUN bun install
RUN bun run db:generate

EXPOSE 8081

CMD [ "bun", "run", "start:ws" ]