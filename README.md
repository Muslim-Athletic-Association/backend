### MAA BACKEND
Contains all of the back-end server code for the Muslim Athletic Association.

### EXECUTION
In development you can run the docker environment from terminal.
Use `docker-compose up --build` the first time you are running. Every other time you can use `docker-compose up`.
To stop the container use `docker-compose down`.


We currently use pm2 with the regular production environment to serve the project on both our production and development server.
Don't forget to do npm install
