// Components
import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { MainMenu, VistaAdmin } from "./components";
import AgregarLibros from "./components/AgregarLibros";
import Libros from "./components/Libros";
import { UsuarioContext } from "./contexts/UsuarioProvider";

const App: FC = () => {
	const userContext = useContext(UsuarioContext);
	return (
		<>
			<MainMenu />
			<Container>
				{userContext?.usuario.rol?.admin && <VistaAdmin />}
				{userContext?.usuario.rol?.author && <AgregarLibros />}
				<Libros />
			</Container>
		</>
	);
};

export default App;
