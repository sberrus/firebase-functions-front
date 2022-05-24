import React, { FC, useContext } from "react";
import { UsuarioContext } from "../contexts/UsuarioProvider";
import { UserContextType } from "../types/types";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const MainMenu: FC = () => {
	const context = useContext<UserContextType | null>(UsuarioContext);

	/**
	 * Devuelve las credenciales de administrador para el usuario samuelberrus@....
	 */
	const resetMainAccount = () => {
		const functions = getFunctions();

		const resetMainAccount = httpsCallable(functions, "resetMainAccount");

		resetMainAccount().then(async (res: any) => {
			if (res.data.error) {
				console.log(res.data.error);
				return;
			}

			const db = getFirestore();
			const docRef = doc(db, "usuarios", "samuelberrus@gmail.com");
			await setDoc(
				docRef,
				{ rol: { admin: true, invitado: false, author: false } },
				{ merge: true }
			);
			console.log(res.data.message);

			// logout for success changng state
			context?.logOut();
		});
	};

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand as="div" className="pe-3 border-end">
						Samdev
					</Navbar.Brand>
					<Navbar.Text>
						{context?.usuario.activo
							? `${context.usuario.email}`
							: "Inicie sesión"}
					</Navbar.Text>
					<Navbar.Text>
						{context?.usuario.email === "samuelberrus@gmail.com" &&
							!context?.usuario.rol?.admin && (
								<Button
									variant="warning"
									className="p-1 py-0 mx-3"
									onClick={() => {
										resetMainAccount();
									}}
								>
									<i className="bi bi-arrow-clockwise"></i>
								</Button>
							)}
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
