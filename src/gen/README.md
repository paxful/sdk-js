
# Installation

- Install maven
- cd ../
- git clone https://github.com/swagger-api/swagger-codegen
- cd swagger-codegen
- mvn package
- cd ../sdk-js/src/gen/engine
- mvn package

## Update generated code

- update schema.json & schema_webhook.json with latest schemas
- yarn gen
