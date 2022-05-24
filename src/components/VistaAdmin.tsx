// React
import { FC, useEffect, useState, useContext } from "react";
// Firebase
import {
	collection,
	doc,
	DocumentData,
	getFirestore,
	onSnapshot,
	query,
	setDoc,
} from "firebase/firestore";
// Firebase Functions
import { getFunctions, httpsCallable } from "firebase/functions";
// React-bootstrap
import { Dropdown, Table } from "react-bootstrap";
// Context
import { UsuarioContext } from "../contexts/UsuarioProvider";

const VistaAdmin: FC = () => {
	const [usuarios, setUsuarios] = useState<DocumentData>([]);
	const [db] = useState(getFirestore());

	const userContext = useContext(UsuarioContext);

	useEffect(() => {
		fetchUsers();

		return () => {};
	}, []);

	const fetchUsers = async () => {
		const usersCollection = query(collection(db, "usuarios"));
		onSnapshot(usersCollection, (usersCollectionSnapshot) => {
			const snapshotCollection: any[] = [];
			usersCollectionSnapshot.forEach((user) => {
				snapshotCollection.push(user.data());
			});
			setUsuarios(snapshotCollection);
		});
	};

	const addAdminRol = (email: string) => {
		// Primero obtenemos las functions
		const functions = getFunctions();
		// Obtenemos la función que tenemos definida en el backend para usarla en nuestros front
		const agregarAdministrador = httpsCallable(
			// functions object
			functions,
			// Este es el namespace de la función que definimos en el backend de las functions
			"agregarAdministrador"
		);

		/**
		 * Function obtenida desde el backend la cual nos permite acceder a la función.
		 *
		 *
		 *  @param {} object recibe un objeto el cual enviamos al backend para que este lo utilize. El namespace que enviemos debe
		 * ser el mismo que como se va a interactuar en el backend. Es parecido al body de los métodos http.
		 *
		 *  @returns {Promise} devuelve una promesa la cual es la respueta del backend que hemos definido.
		 */
		agregarAdministrador({ email }).then(async (res: any) => {
			if (res.data.error) {
				console.log(res.data.error);
				return;
			}

			const docRef = doc(db, "usuarios", email);
			await setDoc(
				docRef,
				{ rol: { admin: true, invitado: false } },
				{ merge: true }
			);
			console.log("Usuario creado con exito");
		});
	};

	const addAuthorRol = (email: string) => {
		// Primero obtenemos las functions
		const functions = getFunctions();
		const crearAutor = httpsCallable(functions, "crearAutor");

		crearAutor({ email }).then(async (res: any) => {
			if (res.data.error) {
				console.log(res.data.error);
				return;
			}

			const docRef = doc(db, "usuarios", email);
			await setDoc(
				docRef,
				{ rol: { author: true, invitado: false } },
				{ merge: true }
			);
			console.log("Usuario modificado con exito");
		});
	};
	const addInvitadoRol = (email: string) => {
		// Primero obtenemos las functions
		const functions = getFunctions();
		const eliminarRoles = httpsCallable(functions, "eliminarRoles");

		eliminarRoles({ email }).then(async (res: any) => {
			if (res.data.error) {
				console.log("No cuentas con los permisos necesarios");
				return;
			}

			const docRef = doc(db, "usuarios", email);
			await setDoc(
				docRef,
				{ rol: { invitado: true, admin: false, author: false } },
				{ merge: true }
			);
			console.log(res.data.message);
		});
	};

	return (
		<div>
			<h3>Administración de usuarios</h3>
			<Table striped bordered hover variant="success">
				<thead>
					<tr className="text-center">
						<th>#</th>
						<th>Correo</th>
						<th>Rol</th>
						<th>Modificar Rol</th>
					</tr>
				</thead>
				<tbody>
					{usuarios.map((usuario: any, idx: number) => (
						<tr key={usuario.email}>
							<td>{idx + 1}</td>
							<td>{usuario.email}</td>

							<td>
								{usuario.rol.admin && (
									<span className="px-1">admin</span>
								)}
								{usuario.rol.author && (
									<span className="px-1">author</span>
								)}
								{usuario.rol.invitado && (
									<span className="px-1">invitado</span>
								)}
							</td>

							<td>
								<Dropdown>
									<Dropdown.Toggle
										variant="success w-100"
										id="dropdown-basic"
									>
										Opciones
									</Dropdown.Toggle>

									<Dropdown.Menu className="w-100 text-center">
										<Dropdown.Item
											as="button"
											disabled={usuario.rol.admin}
											onClick={() => addAdminRol(usuario.email)}
										>
											Administrador
										</Dropdown.Item>
										<Dropdown.Item
											as="button"
											disabled={usuario.rol.author}
											onClick={() => addAuthorRol(usuario.email)}
										>
											Author
										</Dropdown.Item>
										<Dropdown.Item
											as="button"
											disabled={usuario.rol.invitado}
											onClick={() => addInvitadoRol(usuario.email)}
										>
											Invitado
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default VistaAdmin;
