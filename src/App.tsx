// Components
import { FC } from "react";
import { Container } from "react-bootstrap";
import { MainMenu, VistaAdmin } from "./components";

const App: FC = () => {
	return (
		<>
			<MainMenu />
			<Container>
				<VistaAdmin />
			</Container>
		</>
	);
};

export default App;
