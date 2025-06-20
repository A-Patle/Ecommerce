import { createRoot } from "react-dom/client";

// Import styles and dependencies
import "jquery";
import "popper.js/dist/umd/popper";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./index.css";

import App from "./app";
createRoot(document.getElementById("root")).render(<App />);
