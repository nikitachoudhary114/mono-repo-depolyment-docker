FROM oven/bun:1

WORKDIR /usr/src/app

# Copy root configs
COPY package.json ./
COPY bun.lock ./bun.lock
COPY turbo.json ./turbo.json

# Copy repo structure
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN bun install

# Generate Prisma client
RUN bun run db:generate

EXPOSE 8081

CMD ["bun", "run", "start:ws"]
