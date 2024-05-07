#This should auto populate. install docker autopopulate

#download and use the nodjs:slim image
FROM node:slim

#set working directory as /app
WORKDIR /app

#Copy all the contents of the current folder to /app
COPY . /app

#Delete all node_modules
CMD sudo rm -rf node_modules

#Install dependencies
RUN npm install

#Open the tcp port 3000 from the container for communicating with apis 
EXPOSE 3000

#start the nodejs server
CMD node index.js
