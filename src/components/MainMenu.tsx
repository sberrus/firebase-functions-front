import React, { FC, useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioProvider";
import { UserContextType } from "../types/types";
import { Container, Nav, Navbar } from "react-bootstrap";

const MainMenu: FC = () => {
	const context = useContext<UserContextType | null>(UsuarioContext);

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand as="div" className="pe-3 border-end">Samdev</Navbar.Brand>
					<Navbar.Text>
						{context?.usuario.activo
							? `${context.usuario.email}`
							: "Inicie sesión"}
					</Navbar.Text>
					<Nav className="ms-auto">
						{context?.usuario.activo ? (
							<Nav.Link
								as="button"
								className="btn btn-outline-danger"
								onClick={() => {
									context?.logOut();
								}}
							>
								Log out
							</Nav.Link>
						) : (
							<Nav.Link
								as="button"
								className="btn btn-outline-success"
								onClick={() => {
									context?.logIn();
								}}
							>
								Log in
							</Nav.Link>
						)}
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};

export default MainMenu;
