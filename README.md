# Requirements
## Install PostgreSQL
Run:  
`docker pull postgres`  
`docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres`

## Create a Database
Find out the docker container ID with `sudo docker ps`.  
Now enter the container: `sudo docker exec -it 14e073887846 bash`  
Login into PostgreSQL: `psql -U postgres`  
`postgres-# CREATE DATABASE example;
postgres-# \q`

# Execute PCComponentes scraper
Run `node pccomponentesPricesParser.js` or `NODE_ENV=production node pccomponentesPricesParser.js` for production.

# Execute products completer
Run `node productsCompleter.js` or `NODE_ENV=production node productsCompleter.js` for production.
