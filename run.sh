#!/bin/bash

docker run -it --rm \
  --name peidi-order-recognition-h5 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -p 10086:10086 \
  peidi-order-recognition-h5
