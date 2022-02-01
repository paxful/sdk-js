#!/usr/bin/env bash

docker build -t px-js-sdk-gen gen/engine

WRAPPER_CMD="docker run -it --rm -v $PWD/gen:/gen -v $PWD/src:/src px-js-sdk-gen"
SWAGGER_CODEGEN="$WRAPPER_CMD java -cp /engine/target/pxSdk-swagger-codegen-1.0.0.jar:/swagger-codegen/modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.v3.cli.SwaggerCodegen"

$SWAGGER_CODEGEN generate -i /gen/schema/paxful.json -l pxSdk -t /gen/templates -o /src/gen/paxful
$SWAGGER_CODEGEN generate -i /gen/schema/webhook.json -l pxSdk -t /gen/templates -o /src/gen/webhook
