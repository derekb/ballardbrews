FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn tsc
EXPOSE 8080
CMD ["node", "dist/app.js"]