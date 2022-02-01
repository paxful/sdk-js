FROM maven:3.8-jdk-11

RUN git clone https://github.com/swagger-api/swagger-codegen && cd swagger-codegen && git checkout v3.0.30 && mvn package
RUN mkdir -p /engine/src
ADD pom.xml /engine/
ADD src /engine/src

RUN cd /engine && mvn package