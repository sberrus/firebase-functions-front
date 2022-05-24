// React
import { FC, useEffect, useState } from "react";
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
import { Unsubscribe } from "firebase/auth";

const VistaAdmin: FC = () => {
	const [usuarios, setUsuarios] = useState<DocumentData>([]);
	const [db] = useState(getFirestore());

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

	/**
	 *
	 */
	const addAdminUser = (email: string) => {
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
				console.log("No cuentas con los permisos necesarios");
				return;
			}

			const docRef = doc(db, "usuarios", email);
			await setDoc(docRef, { rol: "admin" }, { merge: true });
			console.log("Usuario creado con exito");
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
							<td>{usuario.rol}</td>
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
											onClick={() => addAdminUser(usuario.email)}
										>
											Administrador
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
