FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the app on port 3000
EXPOSE 3001

# Run the app
CMD ["node", "app.js"]
