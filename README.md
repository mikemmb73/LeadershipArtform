# LeadershipArtform

To load:

npm start

To start with nodemon (automatically refreshes when pages are changed (not views, just type 'rs' to restart with nodemon)):

nodemon --exec npm start


in browser: localhost:3000


Running migrations for sql database:
make sure you have mysql installed (mysql -u root -p)
if it is saying command not found for mysql try: export PATH=${PATH}:/usr/local/mysql/bin

in mysql:
create Leadership_Artform;

in migration.js, change username and password to match your username and password

to run (quit mysql):
node migration.js up
  
run migration.js down
  This will delete all databases (not currently working for some reason, but you can go in and manually delete
  databases if needed.
