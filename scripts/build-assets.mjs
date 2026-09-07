import { copyFile } from "node:fs/promises";

const styles = [
  "styles.css",
  "builtin/intrinsic.css",
  "builtin/data-form.css",
  "builtin/data-form-headers.css",
];

await Promise.all(
  styles.map((file) => copyFile(`src/lib/${file}`, `dist/lib/${file}`))
);
