#!/bin/sh
minikube start
eval $(minikube docker-env)
kubectl apply -f deployments/deploy-redis.yaml
kubectl apply -f deployments/deploy-api.yaml
kubectl apply -f deployments/deploy-ms.yaml
minikube tunnel &> /dev/null &