FROM node:12.19.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV POSTGRES_PASSWORD=VeryG00dPassword
ENV POSTGRES_USER=maadmin
ENV POSTGRES_DB=maadmin
ENV POSTGRES_HOST=docker_postgres
ENV POSTGRES_PORT=5433

CMD ["node", "maaNode.js"]