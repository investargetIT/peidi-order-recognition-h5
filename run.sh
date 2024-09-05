#!/bin/bash

docker run -it --rm \
  --name peidi-planet-weapp \
  -v $(pwd):/app \
  -v /app/node_modules \
  peidi-planet-weapp
