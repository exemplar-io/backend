#!/bin/bash

echo "Waiting app to launch on 3000..."

while ! curl localhost:3000; do   
  sleep 1 # wait for 1s of the second before check again
done

echo "App launched"