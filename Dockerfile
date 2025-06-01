FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 

RUN npm run build

# Debug step to list files in dist/ directory
RUN ls -l dist

EXPOSE 3000

# Run migration then start the server
CMD ["sh", "-c", "npx typeorm migration:run -d dist/database/data-source.js && node dist/index.js"]
