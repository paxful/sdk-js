package com.paxful.jssdk;

import io.swagger.codegen.v3.CodegenOperation;
import io.swagger.codegen.v3.CodegenParameter;
import io.swagger.codegen.v3.CodegenType;
import io.swagger.codegen.v3.SupportingFile;
import io.swagger.codegen.v3.generators.typescript.TypeScriptFetchClientCodegen;
import io.swagger.v3.oas.models.parameters.Parameter;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

/**
 * Custom swagger generator for the Paxful js-sdk's fluent api
 * <p>
 * Main reason why typescript generator was extended is to fix bug
 * with empty description, make some naming fixes and generate only required files.
 */
public class PxsdkGenerator extends TypeScriptFetchClientCodegen {

    @Override
    public CodegenType getTag() {
        return CodegenType.CLIENT;
    }

    @Override
    public String getName() {
        return "pxSdk";
    }

    @Override
    public void processOpts() {
        super.processOpts();

        /*
        Typescript generator is ok, but we don't need all this files it generates. Just pick required ones.
         */
        supportingFiles.clear();
        supportingFiles.add(new SupportingFile("index.mustache", "", "index.ts"));
        supportingFiles.add(new SupportingFile("api.mustache", "", "api.ts"));
    }

    @Override
    public String getHelp() {
        return "Generates a pxSdk client library.";
    }

    public PxsdkGenerator() {
        super();
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> postProcessOperations(Map<String, Object> objs) {
        Map<String, Object> operations = (Map<String, Object>) objs.get("operations");

        String classname = (String) operations.get("classname");

        /*
        Remove redundant prefixes from operations. Example:
        WalletApi.walletBalance() -> WalletApi.balance()
         */

        if (classname.endsWith("Api")) {
            String prefix = classname.substring(0, 1).toLowerCase() + classname.substring(1, classname.length() - 3);
            for (CodegenOperation operation : (ArrayList<CodegenOperation>) operations.get("operation")) {
                if (operation.nickname.startsWith(prefix)) {
                    String newName = operation.nickname.substring(prefix.length());
                    newName = newName.substring(0, 1).toLowerCase() + newName.substring(1);
                    operation.nickname = newName;
                }
            }
        }

        return super.postProcessOperations(objs);
    }

    @Override
    public CodegenParameter fromParameter(Parameter parameter, Set<String> imports) {
        /*
        Sometimes description is not copied from schema properly.
        We don't care the reasons why, just copy it from there manually.
         */

        CodegenParameter codegenParameter = super.fromParameter(parameter, imports);
        if (codegenParameter.getDescription() == null) {
            codegenParameter.description = parameter.getSchema().getDescription();
        }

        return codegenParameter;
    }
}