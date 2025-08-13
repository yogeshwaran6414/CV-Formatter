FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY src ./src
CMD ["node", "src/index.js"]
