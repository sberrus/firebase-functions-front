import {
	collection,
	getFirestore,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { UsuarioContext } from "../contexts/UsuarioProvider";
import {
	BookDashboardProps,
	BookManagerStateType,
	BookType,
} from "../types/types";

const BooksManager: FC = () => {
	// Context
	const userContext = useContext(UsuarioContext);
	// States
	const [bookManagerState, setBookManagerState] =
		useState<BookManagerStateType>("dashboard");
	const [editingBookId, setEditingBookId] = useState<string>("");
	const [booksCollection, setBooksCollection] = useState<BookType[]>([]);

	useEffect(() => {
		obtenerLibros();
	}, []);

	/**
	 * Obtiene la colleción de libros del usuario loggeado.
	 */
	const obtenerLibros = async () => {
		const db = getFirestore();
		const usersBooksQuery = query(
			collection(db, "libros"),
			where("author", "==", userContext?.usuario.email)
		);
		onSnapshot(usersBooksQuery, (booksSnapshot) => {
			const userBooks: BookType[] = [];
			booksSnapshot.forEach((book) => {
				userBooks.push(book.data());
			});
			setBooksCollection(userBooks);
		});
	};

	//todo Vista para agregar

	//todo Vista para editar

	//todo Funcionalidad eliminar libro

	return (
		<>
			{bookManagerState === "dashboard" && (
				<BooksDashboard booksCollection={booksCollection} />
			)}
			<AddBook />
		</>
	);
};

export default BooksManager;

const BooksDashboard: FC<BookDashboardProps> = ({ booksCollection }) => {
	return (
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
	);
};

const AddBook: FC = () => {
	const [validFields, setValidFields] = useState<{
		title: boolean;
		pages: boolean;
	}>();

	// todo: añadir logica sencilla para comprobar los campos validos
	// todo: title min-len 4
	// todo: pages not-less than 0

	return (
		<>
			<h3>Agregar Nuevo Libro</h3>
			<hr />
			<>
				<h5>Titulo</h5>
				<Form.Control
					type="text"
					placeholder="Título"
					isValid={validFields?.title}
				/>
				<br />
				<h5>Páginas</h5>
				<Form.Control
					type="number"
					placeholder="Normal text"
					isValid={validFields?.pages}
				/>
				<br />
			</>
		</>
	);
};

const EditBook: FC = () => {
	return (
		<>
			<h3>Editar Libro {"idLibro"}</h3>
			<hr />
		</>
	);
};
