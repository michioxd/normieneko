# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.5.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
#ARG PNPM_VERSION=8.6.12
#RUN npm install -g pnpm@$PNPM_VERSION
RUN npm install -g pnpm

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3 wget unzip fontconfig

# Install node modules
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY --link . .

# Build application
RUN pnpm run build-fly

# Remove development dependencies
RUN pnpm prune --prod
RUN wget https://m01.michioxd.com/public/gsf.zip -P /app && unzip /app/gsf.zip -d /app && mv -v /app/gs/* /usr/share/fonts && fc-cache -fv

# Final stage for app image
FROM base 

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
#RUN mkdir -p /data
#VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
#ENV DATABASE_URL="file:///data/sqlite.db"
CMD apt update && apt install -y wget unzip fontconfig && wget https://m01.michioxd.com/public/gsf.zip -P /app && unzip /app/gsf.zip -d /app && mv -v /app/gs/* /usr/share/fonts && fc-cache -fv && node /app/index.js
# CMD ["node", "/app/index.js"]