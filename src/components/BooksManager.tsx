import {
	addDoc,
	collection,
	doc,
	getFirestore,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { UsuarioContext } from "../contexts/UsuarioProvider";
import {
	AddBookProps,
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
			where("author", "==", userContext?.usuario.email),
			where("state", "==", true)
		);
		onSnapshot(usersBooksQuery, (booksSnapshot) => {
			const userBooks: BookType[] = [];
			booksSnapshot.forEach((book) => {
				userBooks.push({ id: book.id, ...book.data() });
			});
			setBooksCollection(userBooks);
		});
	};

	/**
	 * Modifica el state de los estados
	 * @param newState estado nuevo
	 */
	const modifyState = (newState: BookManagerStateType) => {
		setBookManagerState(newState);
	};

	//todo Vista para editar

	//todo Funcionalidad eliminar libro

	return (
		<>
			{bookManagerState === "dashboard" && (
				<BooksDashboard
					booksCollection={booksCollection}
					modifyState={modifyState}
				/>
			)}
			{bookManagerState === "addBook" && (
				<AddBook modifyState={modifyState} />
			)}
		</>
	);
};

export default BooksManager;

const BooksDashboard: FC<BookDashboardProps> = ({
	booksCollection,
	modifyState,
}) => {
	const deleteBook = async (id: string) => {
		const db = getFirestore();
		const bookRef = doc(db, "libros", id);
		await setDoc(bookRef, { state: false }, { merge: true });

		console.log(`Libro ${id} eliminado`);
	};

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
					<Button
						variant="outline-success"
						onClick={() => {
							modifyState("addBook");
						}}
					>
						Añadir libro
					</Button>
				</div>
			) : (
				<>
					<Row>
						<Col xs={3}>
							<Button
								variant="success"
								onClick={() => {
									modifyState("addBook");
								}}
							>
								Añadir Libro <i className="bi bi-plus-circle"></i>
							</Button>
						</Col>
						<Col xs={9}></Col>
					</Row>
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
							{booksCollection.map((book: BookType, idx: number) => (
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
											onClick={() => {
												deleteBook(book.id);
											}}
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

const AddBook: FC<AddBookProps> = ({ modifyState }) => {
	const [titleField, setTitleField] = useState<string>("");
	const [pagesField, setPagesField] = useState<number>(0);

	const defaultErrors = { title: false, pages: false };
	const [showErrors, setShowErrors] = useState(defaultErrors);

	const userContext = useContext(UsuarioContext);

	const handleAddBookSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (titleField.length < 4 || pagesField < 50) {
			let errors = {
				pages: false,
				title: false,
			};
			if (titleField.length < 4) {
				errors = { ...errors, title: true };
				console.log("El titulo es demasiado corto min-len 4");
			}
			if (pagesField < 50) {
				errors = { ...errors, pages: true };
				console.log("El título es demasiado corto min-pages 50");
			}
			setShowErrors(errors);
			return;
		}

		addBookToFirestore();
	};

	const addBookToFirestore = async () => {
		const db = getFirestore();
		const booksRef = collection(db, "libros");
		await addDoc(booksRef, {
			paginas: pagesField,
			titulo: titleField,
			author: userContext?.usuario.email,
			state: true,
		});
		setShowErrors(defaultErrors);
		setPagesField(0);
		setTitleField("");
		modifyState("dashboard");
		console.log("Libro " + titleField + " creado");
	};

	return (
		<>
			<h3>Agregar Nuevo Libro</h3>
			<hr />
			<>
				<Form
					onSubmit={(e) => {
						handleAddBookSubmit(e);
					}}
				>
					<h5>Titulo</h5>
					<Form.Control
						type="text"
						placeholder="Título"
						value={titleField}
						isInvalid={showErrors.title}
						onChange={(e) => {
							setShowErrors({ ...showErrors, title: false });
							setTitleField(e.currentTarget.value);
						}}
					/>
					<br />
					<h5>Páginas</h5>
					<Form.Control
						type="number"
						placeholder="Normal text"
						value={pagesField}
						isInvalid={showErrors.pages}
						onChange={(e) => {
							setShowErrors({ ...showErrors, pages: false });
							setPagesField(Number(e.currentTarget.value));
						}}
					/>
					<Button variant="success" type="submit">
						Agregar Libro
					</Button>
					<Button variant="danger">Cancelar</Button>
				</Form>
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
