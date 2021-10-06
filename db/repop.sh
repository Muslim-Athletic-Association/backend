#This file should be executed in it's local directory
psql postgres < ./drop.sql
psql maadmin < ./schema.sql
psql maadmin < ./soccer21.sql
psql maadmin < ./views.sql

