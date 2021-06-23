#This file should be executed in it's local directory
psql postgres < ./drop.ddl
psql maadmin < ./schema.ddl
psql maadmin < ./soccer21.ddl
psql maadmin < ./views.ddl

