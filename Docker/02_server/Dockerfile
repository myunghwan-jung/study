FROM node:22-slim
WORKDIR /app
COPY . .
RUN ["npm", "install"]
EXPOSE 8080
CMD ["node", "server.js"]