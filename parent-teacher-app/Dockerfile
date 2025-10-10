# Use Node.js 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the port CRA runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
