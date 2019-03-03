# LeadershipArtform

To load:

npm start

To start with nodemon (automatically refreshes when pages are changed (not views, just type 'rs' to restart with nodemon)):

nodemon --exec npm start


in browser: localhost:3000


Running migrations for sql database:
make sure you have mysql installed (i can run it from the command line mysql -u root -p)
mysql should be on your computer from when we did 201.
if it is saying command not found for mysql try: export PATH=${PATH}:/usr/local/mysql/bin

create database in mysql that is: Leadership_Artform

in migration.js, change username and password to match your username and password

to run:
run migration.js up
  This will run all of the migrations to create each database
  
run migration.js down
  This will delete all databases (not currently working for some reason, but you can go in and manually delete
  databases if needed.
