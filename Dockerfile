FROM node:14-alpine

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . ./

RUN tsc -b

ENV JWT_ACCESS_TOKEN ""
ENV DEBUG "false"
ENV MONGO_URI ""
ENV SESSION_SECRET ""
ENV PORT "8080"
ENV OSTICKET_URL ""
ENV OSTICKET_API_KEY ""
ENV STRIPE_SK_TEST ""
ENV STRIPE_SK_LIVE ""
ENV SWISH_PAYEE_NUMBER ""

EXPOSE 8080

CMD [ "node", "./build/Main.js" ]