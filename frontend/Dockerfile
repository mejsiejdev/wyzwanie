# Pull the official base image
FROM node:19-alpine
# Set working direction (directory for my project)
WORKDIR /app
# Set environment path
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy everything from local machine to our server, second dot refers to the directory on the container.

# Install app's dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Add app
COPY . ./

# Expose the port
EXPOSE 3000

CMD ["npm", "run", "dev"]
