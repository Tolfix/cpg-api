FROM node:16-alpine AS base
ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript@4.3.5 \
    && npm install turbo -g

WORKDIR /app
ENV YARN_CACHE_FOLDER=.yarn-cache
COPY . .

FROM base AS builder
RUN yarn turbo run build --scope=*cpg-api* --include-dependencies --no-deps
RUN find . -name node_modules | xargs rm -rf

FROM base AS runner
# COPY --from=prod-deps /app/ .
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
