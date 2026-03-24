FROM node:20-alpine

# Set working directory
WORKDIR /app 

# Copy package files 
COPY package*.json ./ 

# Install deps 
RUN npm install 

# Copy all source 
COPY . . 

# Build TypeScript 
RUN npm run build 

# Expose port 
EXPOSE 8080

# Run the app
CMD ["npm", "run", "start"]