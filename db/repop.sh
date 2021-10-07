#This file should be executed in it's local directory
PGPASSWORD=VeryG00dPassword psql -U maadmin postgres < ./drop.sql
PGPASSWORD=VeryG00dPassword psql -U maadmin maadmin < ./schema.sql
PGPASSWORD=VeryG00dPassword psql -U maadmin maadmin < ./soccer21.sql
PGPASSWORD=VeryG00dPassword psql -U maadmin maadmin < ./views.sql

