FROM node:16-alpine AS base
ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript@4.3.5

WORKDIR /app
ENV YARN_CACHE_FOLDER=.yarn-cache

FROM base AS pruner
RUN yarn global add turbo@1.1.2
COPY . .
RUN turbo prune --scope=*cpg-api* --docker

FROM base AS dev-deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile

FROM base AS prod-deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=dev-deps /app/${YARN_CACHE_FOLDER} /${YARN_CACHE_FOLDER} 
RUN yarn install --frozen-lockfile --production --prefer-offline --ignore-scripts
RUN rm -rf /app/${YARN_CACHE_FOLDER}

FROM base AS builder
COPY --from=dev-deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --scope=*cpg-api* --include-dependencies --no-deps
RUN find . -name node_modules | xargs rm -rf

FROM base AS runner
COPY --from=prod-deps /app/ .
COPY --from=builder /app/ .

ENV JWT_ACCESS_TOKEN ""
ENV DEBUG "false"
ENV MONGO_URI ""
ENV DOMAIN ""
ENV HTTP_SCHEMA ""

ENV SESSION_SECRET ""
ENV PORT "3001"

ENV OSTICKET_URL ""
ENV OSTICKET_API_KEY ""

ENV SWISH_PAYEE_NUMBER ""

ENV PAYPAL_CLIENT_ID ""
ENV PAYPAL_CLIENT_SECRET ""

ENV STRIPE_SK_LIVE ""
ENV STRIPE_SK_PUBLIC ""
ENV STRIPE_WEBHOOK_SECRET ""

ENV PDF_TEMPLATE_URL ""

ENV PLUGINS "[]"

ENV WEBHOOK_SECRET ""

EXPOSE 3001

CMD yarn workspace cpg-api start
