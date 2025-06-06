# Use the official Node.js 22 Alpine image (lightweight and secure)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for Docker cache efficiency
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the app port (change if your app uses a different port)
EXPOSE 5000

# Optional: Use a non-root user for better security
# RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
# USER nodejs

# Start the app
CMD ["npm", "start"]
