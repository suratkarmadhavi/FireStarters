# Use the official Node.js 18.x image as the base image
# FROM node:12-alpine

FROM registry.access.redhat.com/ubi8/nodejs-16:1

# Install git
#RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Clear npm cache and install Vitepress v1.0.0-beta.6 and other dependencies
RUN npm install

# Install specific packages @popperjs/core, moment, and lodash
RUN npm install @popperjs/core moment lodash

# Copy the rest of the project files
COPY . .

# Expose the port that Vitepress will run on (port 5000)
EXPOSE 5000

# Start the Vitepress development server on port 5000
CMD ["npm", "run", "docs:dev", "--", "--host", "0.0.0.0", "--port", "5000"]
