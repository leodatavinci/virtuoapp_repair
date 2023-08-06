# Set the base image
FROM node:18-alpine

# Install ruby, ruby development headers, and bundler
RUN apk add --update ruby ruby-dev build-base && gem install bundler

# Create a new user
RUN adduser -D myuser

# Shopify API key
ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

# Expose the port
EXPOSE 8081

# Set the working directory
WORKDIR /home/myuser/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Change ownership of the working directory
RUN chown -R myuser:myuser /home/myuser/app

# Switch to 'myuser'
USER myuser

# Install dependencies
RUN npm install

# Build the frontend
RUN cd web/frontend && npm install && npm run build

# List files in /web/frontend
RUN ls -la /home/myuser/app/web/frontend

# Set the command to run your app using CMD which defines your runtime.
CMD [ "npm", "run", "serve" ]