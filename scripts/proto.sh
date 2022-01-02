#!/usr/bin/env bash

echo -e '\033[0;34m==>\033[0m Compiling protocol buffers...'

protoc --proto_path=api/proto/v1 --go_out=pkg/api --go_opt=paths=source_relative --go-grpc_out=pkg/api --go-grpc_opt=paths=source_relative $(ls api/proto/v1)

echo -e '\033[0;32m==>\033[0m Done!'


exit 0