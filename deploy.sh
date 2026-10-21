#!/bin/bash
set -e
cd /var/www/salvi/www
npm run build -- --dest dist_new
rm -rf dist_old
mv dist dist_old
mv dist_new dist
