# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
# Copy the rest of the application files and build the frontend
COPY . .
RUN npm run build

# Install http-server (for serving the static build)
RUN npm install -g http-server

# Expose port 3000
EXPOSE 3000

# Command to run the backend server
CMD ["http-server", "dist", "-p", "3000"]