# Use an official Node.js runtime as the base image
FROM node:18

WORKDIR app

COPY app/package.json ./
COPY app/package-lock.json ./

# Copy the rest of the app's source code to the working directory
COPY . .

RUN npm install --force

# Define the command to run the app
CMD [ "npm", "start"]