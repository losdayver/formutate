import "./styles.css";
import "../lib/builtin/intrinsic.css";
import "../lib/builtin/data-form.css";
import "../lib/builtin/data-form-headers.css";
import { createRoot } from "react-dom/client";
import { PreviewApp } from "./previewApp/previewApp";

const root = createRoot(
  document.querySelector<HTMLDivElement>("#preview-app-root")!
);
root.render(<PreviewApp />);
