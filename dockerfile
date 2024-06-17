# base
FROM node:20-alpine AS base
RUN apk add --no-cache bash
RUN npm install -g pnpm

# development (to be used with docker compose --watch)
FROM base AS development
ENV NODE_ENV=development
EXPOSE 80
EXPOSE 443
COPY ./src /app/src
COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./tsconfig.json /app/tsconfig.json
WORKDIR /app
RUN pnpm install
CMD pnpm run dev

# build - !!! NOT TESTED
FROM base AS build
ENV NODE_ENV=build
COPY . /build
WORKDIR /build
RUN pnpm install
RUN pnpm run build

# production - !!! NOT TESTED
FROM base AS production
ENV NODE_ENV=production
EXPOSE 80
EXPOSE 443
COPY --from=build /build/package.json /app/package.json
COPY --from=build /build/pnpm-lock.yaml /app/pnpm-lock.yaml
WORKDIR /app
RUN pnpm install --prod
COPY --from=build /build/dist /app
CMD pnpm run start
