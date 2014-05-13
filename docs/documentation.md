# MongoDB

## Setup
In the `adify` directory, create a subdir called "data". Now type the following, depending wether working on Windows or Unix.
```
mongod --dbpath C:\Users\Jonas\mongod --dbpath ~/Adify.be/adify/data/
Adify.be\adify\data
```

## Shell

To start the shell, type:
```
mongo
```

## Creating and Selecting Database
```
use adify
```

## Inserting Data into Collection
or
```
newstuff = [{ "title" : "Advertisement Name", "description" : "Description is cool" }, { "title" : "Advertisement Name 2", "description" : "Description is cool 2" }]
db.advertisements.insert(newstuff);
```

## Find Entries of Collection
```
db.advertisements.find().pretty()
```