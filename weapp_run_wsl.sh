#!/bin/bash

docker run -it --rm \
  --name peidi-order-recognition-h5 \
  -v $(pwd):/app \
  -v /mnt/c/Users/Oliver/peidi-order-recognition-h5:/app/dist \
  -v /app/node_modules \
  peidi-order-recognition-h5
