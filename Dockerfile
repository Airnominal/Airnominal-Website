# Build the website
FROM node AS builder

WORKDIR /tmp/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Run the website
FROM codecentric/single-page-application-server AS runtime

COPY --from=builder /tmp/app /app
