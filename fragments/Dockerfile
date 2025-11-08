# This is a Dockerfile for lab 6.

# ------------------------------------------------------------
# Stage 1: Build dependencies
# ------------------------------------------------------------

# Use node version 20 slim as the base image - optimized for smaller size.
FROM node:20-slim AS build

# ------------------------------------------------------------
# Metadata: who maintains this image and what it's for
# ------------------------------------------------------------
LABEL maintainer="Khiet Van Phan <kvphan@myseneca.ca>"
LABEL description="Fragments Node.js microservice optimized for CCP555 lab 6"

# Environment variables
ENV PORT=8080 \
    NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# ------------------------------------------------------------
# Copy dependency files (choose one style, here Option 2)
# ------------------------------------------------------------
# Option 1: COPY package*.json /app/
# Option 2: COPY package*.json ./       <- commonly used after WORKDIR
# Option 3: COPY package.json package-lock.json ./
COPY package*.json ./

# Install production dependencies and ensure all modules are up-to-date
RUN npm ci --only=production && npm install

# ------------------------------------------------------------
# Copy source code
# ------------------------------------------------------------
# Copies our application source files into the image
# so that /app/src exists and contains our server code
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# ------------------------------------------------------------
# Stage 2: Final runtime image
# ------------------------------------------------------------

FROM node:20-slim

# Metadata
LABEL maintainer="Khiet Van Phan <kvphan@myseneca.ca>"
LABEL description="Final Fragments runtime image for Lab 6"

# Set working directory
WORKDIR /app

# Copy built app from previous stage
COPY --from=build /app /app

# Expose the service port
EXPOSE 8080

# Default command
CMD ["npm", "start"]