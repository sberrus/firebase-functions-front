import {
	collection,
	getFirestore,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { UsuarioContext } from "../contexts/UsuarioProvider";
import { BookManagerStateType, BookType } from "../types/types";

const BooksManager: FC = () => {
	const [bookManagerState, setBookManagerState] =
		useState<BookManagerStateType>("dashboard");
	const [booksCollection, setBooksCollection] = useState<BookType[]>([]);

	//todo Obtener los lista de libros del usuario
	const userContext = useContext(UsuarioContext);

	useEffect(() => {
		obtenerLibros();
	}, []);

	const obtenerLibros = async () => {
		const db = getFirestore();
		const usersBooksQuery = query(
			collection(db, "libros"),
			where("author", "==", userContext?.usuario.email)
		);
		const unsubscribe = onSnapshot(usersBooksQuery, (booksSnapshot) => {
			const userBooks: BookType[] = [];
			booksSnapshot.forEach((book) => {
				userBooks.push(book.data());
			});
			setBooksCollection(userBooks);
		});
	};

	//todo Crear vista para dashboard

	//todo Vista para agregar

	//todo Vista para editar

	return (
		<>
			{bookManagerState === "dashboard" && (
				<>
					<h3>Books Dashboard</h3>
					<hr />
					{booksCollection.length <= 0 ? (
						<div className="d-flex align-items-center justify-content-center flex-column">
							<p>
								No tienes libros para agregar. <br />
								¿Deseas añadir tu primer libro?
							</p>
							<Button variant="outline-success">Añadir libro</Button>
						</div>
					) : (
						<>
							<table className="table">
								<thead>
									<tr>
										<th scope="col">Titulo</th>
										<th scope="col">Author</th>
										<th scope="col">Páginas</th>
										<th scope="col">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{booksCollection.map((book, idx: number) => (
										<tr key={book.titulo}>
											<th scope="row">{idx + 1}</th>
											<td>{book.titulo}</td>
											<td>{book.author}</td>
											<Row as="td">
												<Button
													variant="warning"
													className="btn-block col-6"
												>
													Editar
												</Button>
												<Button
													variant="danger"
													className="btn-block col-6"
												>
													Eliminar
												</Button>
											</Row>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
				</>
			)}
		</>
	);
};

export default BooksManager;
