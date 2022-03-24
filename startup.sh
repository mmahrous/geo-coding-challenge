#!/bin/bash
echo "Installing Rust"
apt update 
apt install -y build-essential cmake make gcc rustc

echo "Build Rust package"
cd /code/src/geofence/raycasting-rust
yarn
cd /code

echo "Installing dependencies"
yarn

echo "Run tests"
yarn test

echo "Startup commands are completed successfully"
bash
