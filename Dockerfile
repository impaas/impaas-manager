# Use an official Node.js runtime as the base image
FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Copy the rest of the app's source code to the working directory
COPY . .

RUN npm install --force

EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start", "--host", "0.0.0.0"]
