#!/bin/bash

export NODE_ENV=develop

rm -R build
mkdir build
mkdir build/css
touch build/css/style.css
mkdir build/js
touch build/js/app.js

cp font-awesome-4.7.0/css/font-awesome.min.css build/css
cp -r font-awesome-4.7.0/fonts build

cp src/html/index.html build/index.html
cp icon.png build/icon.png

cp -r lib/ build/js/

echo "starting watchify"
node_modules/.bin/watchify -e src/js/index.js -o "build/js/app.js" -d -v -t [ babelify ] &
echo "starting node-sass"
node_modules/.bin/node-sass --source-map true src/css -o build/css
node_modules/.bin/node-sass --source-map true -w src/css -o build/css &
echo "starting browser-sync"
node_modules/.bin/browser-sync start --files "build/css/*.css, build/js/*.js" --server build
