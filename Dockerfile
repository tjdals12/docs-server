FROM node:12-slim

RUN npm install -g yarn

RUN mkdir -p /app
ADD . /app
WORKDIR /app
RUN yarn

EXPOSE 4000

CMD ["yarn", "start"]