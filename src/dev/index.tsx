import { notDevVar } from "../notDevFile";
import { createRoot } from "react-dom/client";
import "./styles.css";

console.log(notDevVar);

const PreviewApp = () => {
  return <div>Hello World!</div>;
};

const root = createRoot(
  document.querySelector<HTMLDivElement>("#preview-app-root")!
);
root.render(<PreviewApp />);
