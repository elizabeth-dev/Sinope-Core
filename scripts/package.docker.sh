#!/usr/bin/env bash

echo -e '\033[0;34m==>\033[0m Packaging Copper in a container...'
docker buildx build -t sinope-copper . -f ./build/package/Dockerfile

exit 0