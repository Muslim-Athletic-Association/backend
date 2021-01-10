#This file should be executed in it's local directory
psql postgres < ./drop.ddl
psql maadmin < ./schema.ddl
psql maadmin < ./testing.ddl
psql maadmin < ./views.ddl

