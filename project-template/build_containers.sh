#!/bin/sh
minikube start
eval $(minikube docker-env)
docker build -t ms ./ms
docker build -t api ./api
