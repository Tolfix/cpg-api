FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

LABEL author="Tolfix" maintainer="support@tolfix.com"

# Upgrade/Update apt[-get]
RUN apt update -qq -y && apt -qq upgrade -y
RUN apt-get upgrade -y && apt-get update -y

# Install curl
RUN apt-get install curl -y

RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Get nodejs setup
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

# Install node.js
RUN apt -y install nodejs

RUN npm install -g @types/node \
    && npm install -g typescript

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . ./

RUN tsc -b

ENV JWT_ACCESS_TOKEN ""
ENV DEBUG ""
ENV MONGO_URI ""
ENV SESSION_SECRET ""
ENV PORT ""

EXPOSE 8080

CMD [ "node", "./build/Server.js" ]