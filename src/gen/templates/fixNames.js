const { Project, StructureKind } = require("ts-morph");

console.log("Refactoring ...")

// initialize
const project = new Project({});

project.addSourceFilesAtPaths("src/gen/*/*.ts");
const files = project.getSourceFiles("src/gen/*/api.ts")

files.map((file) => {
    file.getClasses().map(cls => {
        const name = cls.getName();
        if (name.endsWith("Api")) {
            let prefix = name.slice(0, name.length - 3);
            prefix = prefix[0].toLowerCase() + prefix.slice(1);


            // Rename prefix from method names if it match API name
            // OfferApi.offerList() -> OfferApi.list()
            cls.getMethods().map(method => {
                if (method.getName().startsWith(prefix)) {
                    let newMethodName = method.getName().slice(prefix.length);
                    newMethodName = newMethodName[0].toLowerCase() + newMethodName.slice(1);
                    method.rename(newMethodName);

                    console.log("Class", name, prefix, method.getName());
                }
            })
        }
    });
});

project.save().then(() => {
    console.log("Done.")
})