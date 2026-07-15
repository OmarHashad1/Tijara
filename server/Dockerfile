FROM node:22.20.0 AS base

WORKDIR /tijara-app
COPY package*.json .

FROM base AS dev
RUN npm i
COPY . .

FROM base AS build
RUN npm i
COPY . .
RUN npm run build


FROM base AS prod
RUN npm i --only=production
COPY --from=build /tijara-app/dist ./dist



