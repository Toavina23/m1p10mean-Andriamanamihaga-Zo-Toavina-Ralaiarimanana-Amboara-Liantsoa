FROM node:18.19-alpine3.19
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev 
COPY . .
WORKDIR /app/client
RUN npm install
RUN npm run build
WORKDIR /app
EXPOSE 8000
# for smtp protocol
EXPOSE 587
CMD ["npm", "start"]

