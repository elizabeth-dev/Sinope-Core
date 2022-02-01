#!/usr/bin/env bash

docker run -v ./api/proto/v1:/defs -v ./pkg/api:/pb-go namely/protoc-all -d /defs -o /pb-go -l go
docker run -v ./api/proto/v1:/defs namely/protoc-all -d /defs -o /pb-kotlin -l kotlin
