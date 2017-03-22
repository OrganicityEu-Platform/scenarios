FROM node:latest

RUN apt-get update && apt-get install vim -y

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install gulp -g

# Bundle app source
COPY . /usr/src/app

RUN gulp build

ENV WEB_HOST="http://localhost" \
    WEB_PORT=8080 \
    WEB_CONTEXTPATH="/organicity-scenario-tool" \
    WEB_DEV=false \
    WEB_TITLE="SynchroniCity Scenario Tool"

ENV MONGODB_URL      ="mongodb://localhost/scenarios" \
    MONGODB_TEST_URL ="mongodb://localhost/scenarios"

EXPOSE 8080
CMD [ "npm", "start" ]
