FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY package.json yarn.lock* ./
COPY resources /app/resources
RUN yarn install --frozen-lockfiles --production --ignore-scripts

COPY . .

RUN chown -R node:node /app
USER node

CMD [ "yarn", "start" ]
