#!/bin/bash
# Builds the container image from the source tarball.

set -e
set -o pipefail

INPUT="$(realpath $1)"
COMMIT="$2"

echo "Attempting to build ${INPUT}"
mkdir build_dir
tar -C build_dir -xf "${INPUT}"

# My patch failed with out of memory. Let's use git instead.
cd build_dir/grafana-dist
git init
git config user.email "you@example.com"
git config user.name "Your Name"
git add -A
git commit -m "baseline version"
git am patches/*.patch


mkdir -p public/build/static
cp "${INPUT}" public/build/static
docker build --tag ghcr.io/goldmansachs/grafana:10-ubi8-"${COMMIT}" -f ./Dockerfile.ubi8 .