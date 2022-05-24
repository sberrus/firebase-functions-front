// React
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// Firebase config
import "./firebase/config";
// UserContext
import UsuarioProvider from "./contexts/UsuarioProvider";
// React-Bootstrap Css Config
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UsuarioProvider>
			<App />
		</UsuarioProvider>
	</React.StrictMode>
);
