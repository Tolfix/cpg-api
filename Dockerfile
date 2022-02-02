FROM node:16-alpine

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript@4.3.5

# Set working directory
WORKDIR /app

COPY . .

RUN npm install --force

RUN npm run build

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

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
