#!/bin/bash

export NODE_ENV=develop
rm -R docs
mkdir docs
mkdir docs/css
touch docs/css/style.css
mkdir docs/js
touch docs/js/app.js

cp src/css/font-awesome.min.css docs/css
cp -r src/fonts docs

cp src/html/index.html docs/index.html
cp icon.png docs/icon.png

cp -r lib/ docs/js/

cp -r src/css/images docs/css/images
cp -r src/images docs/images
# copy piano keys image
cp mockups/sketch01.png docs/images

echo "starting browserify"
cd node_modules
ls
cd ..
node_modules/.bin/browserify -e src/js/index.js -o "docs/js/app.js" -t [ babelify ]
echo "starting node-sass"
node_modules/.bin/node-sass src/css -o docs/css
