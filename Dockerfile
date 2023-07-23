ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-slim AS build
WORKDIR /opt/app
ADD . .
RUN npm ci --omit=dev

FROM node:${NODE_VERSION}-slim AS final
WORKDIR /opt/app
COPY --from=build /opt/app/package-lock.json .
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/src ./src
ENTRYPOINT ["node", "src/index.mjs"]