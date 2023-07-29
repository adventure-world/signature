#!/bin/bash
export $(grep -v '^#' bin_dev/.env | xargs)

git pull --autostash
cd ./server/model
git pull
cd ../..
docker rmi dagen_admin_image:latest
docker build -f ./Dockerfile -t dagen_admin_image:latest .
docker-compose down
docker-compose up -d --remove-orphans
docker logs -f dagen-admin-web
