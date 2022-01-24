#!/bin/sh
minikube start
eval $(minikube docker-env)
docker build -t auth_ms ./auth_ms
docker build -t api_gateway ./api_gateway
docker build -t ms ./ms