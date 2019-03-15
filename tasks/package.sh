#!/bin/bash
# Package a distribution as a zip and tar.gz archive

set -e

npm run dist
mkdir bin
cd dist/
zip -r ../bin/asciidoctor-caniuse.dist.zip .
tar -zcvf ../bin/asciidoctor-caniuse.dist.tar.gz .
cd -
