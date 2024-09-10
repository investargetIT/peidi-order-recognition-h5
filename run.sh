#!/bin/bash

docker run -it --rm \
  --name peidi-planet-weapp \
  -v $(pwd):/app \
  -v /app/node_modules \
  -p 10086:10086 \
  peidi-planet-weapp
