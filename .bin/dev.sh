#!/bin/bash

export NODE_ENV=develop

rm -R build
mkdir build
mkdir build/css
touch build/css/style.css
mkdir build/js
touch build/js/app.js

cp src/css/font-awesome.min.css build/css
cp -r src/fonts build

cp src/html/index.html build/index.html
cp icon.png build/icon.png

cp -r lib/ build/js/

cp -r src/css/images build/css/images
cp -r src/images build/images
# copy piano keys image
cp mockups/sketch01.png build/images

echo "starting watchify"
node_modules/.bin/watchify -e src/js/index.js -o "build/js/app.js" -d -v -t [ babelify ] &
echo "starting node-sass"
node_modules/.bin/node-sass --source-map true src/css -o build/css
node_modules/.bin/node-sass --source-map true -w src/css -o build/css &
echo "starting browser-sync"
node_modules/.bin/browser-sync start --files "build/css/*.css, build/js/*.js" --server build
