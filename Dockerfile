
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# install dependencies (including dev deps for build)
COPY package*.json ./
RUN npm install

# copy source and compile TypeScript to /dist
COPY . .
RUN npx tsc

FROM node:18-alpine
WORKDIR /usr/src/app

# install only production deps for smaller image
COPY package*.json ./
RUN npm install --only=production

# copy compiled output
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]

