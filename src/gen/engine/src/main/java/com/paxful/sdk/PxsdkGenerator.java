package com.paxful.sdk;

import io.swagger.codegen.v3.*;
import io.swagger.codegen.v3.generators.DefaultCodegenConfig;
import io.swagger.codegen.v3.generators.typescript.TypeScriptFetchClientCodegen;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;

import java.util.*;
import java.io.File;

public class PxsdkGenerator extends TypeScriptFetchClientCodegen {

  // source folder where to write the files
  protected String sourceFolder = "src";
  protected String apiVersion = "1.0.0";

  /**
   * Configures the type of generator.
   * 
   * @return  the CodegenType for this generator
   * @see     io.swagger.codegen.CodegenType
   */
  public CodegenType getTag() {
    return CodegenType.CLIENT;
  }

  /**
   * Configures a friendly name for the generator.  This will be used by the generator
   * to select the library with the -l flag.
   * 
   * @return the friendly name for the generator
   */
  public String getName() {
    return "pxSdk";
  }

  /**
   * Returns human-friendly help for the generator.  Provide the consumer with help
   * tips, parameters here
   * 
   * @return A string value for the help message
   */
  public String getHelp() {
    return "Generates a pxSdk client library.";
  }

  public PxsdkGenerator() {
    super();
  }

  @Override
  public CodegenOperation fromOperation(String path, String httpMethod, Operation operation, Map<String, Schema> schemas) {
    return super.fromOperation(path, httpMethod, operation, schemas);
  }

  @Override
  public CodegenParameter fromParameter(Parameter parameter, Set<String> imports) {
    CodegenParameter codegenParameter = super.fromParameter(parameter, imports);
    if (codegenParameter.getDescription() == null) {
        codegenParameter.description = parameter.getSchema().getDescription();
    }
    return codegenParameter;
  }
}