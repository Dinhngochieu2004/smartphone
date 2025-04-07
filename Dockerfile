FROM node:18-alpine
WORKDIR /app

# Copy files
COPY package*.json ./
COPY ./src ./src
COPY ./config ./config

# Install dependencies
RUN npm install

# Expose port
EXPOSE 8000

# Start the app
CMD ["npm", "start"]
