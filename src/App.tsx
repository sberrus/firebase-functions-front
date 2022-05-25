// Components
import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { MainMenu, VistaAdmin } from "./components";
import BooksManager from "./components/BooksManager";
import Libros from "./components/Libros";
import { UsuarioContext } from "./contexts/UsuarioProvider";

const App: FC = () => {
	const userContext = useContext(UsuarioContext);
	return (
		<>
			<MainMenu />
			<Container>
				{userContext?.usuario.rol?.admin && <VistaAdmin />}
				{userContext?.usuario.rol?.author && <BooksManager />}
				<Libros />
			</Container>
		</>
	);
};

export default App;
