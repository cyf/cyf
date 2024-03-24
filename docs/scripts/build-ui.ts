// @ts-nocheck
import fs from "fs";
import path from "path";

const baseUIPath = path.join(process.cwd(), "../ui/apps/www/registry");
const files = fs.readdirSync(baseUIPath, { withFileTypes: true });

for (const file of files) {
  if (file.isDirectory()) {
    const type = file.name;
    const componentsPath = path.join(baseUIPath, `${type}/ui`);
    const componentFiles = fs.readdirSync(componentsPath, {
      withFileTypes: true,
    });
    const componentNames = componentFiles.map((componentFile: any) =>
      path.basename(componentFile.name, path.extname(componentFile.name)),
    );

    let content = "";
    const baseCompPath = path.join(process.cwd(), `components/ui/${type}.ts`);
    if (fs.existsSync(baseCompPath)) {
      fs.rmSync(baseCompPath);
    }
    for (const componentName of componentNames) {
      if (componentName === "sonner") {
        content += `export { Toaster as Sonner } from "muse-ui/registry/${type}/ui/${componentName}";\n`;
      } else {
        content += `export * from "muse-ui/registry/${type}/ui/${componentName}";\n`;
      }
    }
    fs.writeFileSync(baseCompPath, content, "utf8");
  }
}

console.log("✅ Done!");
