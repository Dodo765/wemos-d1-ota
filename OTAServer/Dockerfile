FROM node:latest
RUN mkdir /app
RUN mkdir /data
COPY index.js /app
COPY package-lock.json /app
COPY package.json /app
COPY node_modules /app
WORKDIR /app
RUN npm install express
WORKDIR /data
EXPOSE 3000
CMD node /app/index.js
# add files to /app