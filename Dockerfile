# Use an official Node.js runtime as the base image
FROM node:18

COPY app/package.json ./
COPY app/package-lock.json ./

# Copy the rest of the app's source code to the working directory
COPY . .

WORKDIR app

RUN npm install --force

RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Define the command to run the app
CMD ["npm", "start"]
