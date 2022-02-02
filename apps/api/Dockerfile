FROM node:16-alpine

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

RUN apk update && \
    apk upgrade && \
    apk add git

RUN npm install -g @types/node \
    && npm install -g typescript@4.3.5

WORKDIR /usr/build

COPY . ./

RUN npm install --force

RUN yarn turbo run build --scope=*cpg-api*

# ls in ./
RUN ls -la
# ls in ./apps/api
RUN ls -la ./apps/api

RUN mkdir -p /usr/src

ADD ./apps/api/build /usr/src

# Copy modules
ADD ./node_modules /usr/src/node_modules

# Remove /usr/build
RUN rm -rf /usr/build

WORKDIR /usr/src
# Remove unused files
#RUN rm -r ./src && \
#    rm -r ./test

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

CMD [ "node", "./build/Main.js" ]
