import {
	collection,
	doc,
	DocumentData,
	DocumentReference,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	query,
} from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { Table } from "react-bootstrap";

type BookType =
	| {
			id: string;

			titulo: string;
			paginas: number;
			author: DocumentReference;
	  }
	| DocumentData;

const Libros: FC = () => {
	const [db] = useState(getFirestore());
	const [books, setBooks] = useState<BookType[]>([]);

	const getBooksPaginated = async () => {
		const booksQuery = query(collection(db, "libros"), limit(10));
		const booksSnapshot = await getDocs(booksQuery);

		// Manage the data
		const bookspayload: BookType[] = [];
		booksSnapshot.forEach((book) => {
			const id = book.id;
			const { paginas, author, titulo } = book.data();
			bookspayload.push({ id, paginas, author, titulo });
		});

		// send data to state
		setBooks(bookspayload);
	};

	useEffect(() => {
		getBooksPaginated();

		return () => {};
	}, []);

	return (
		<>
			<h5>Lista de libros</h5>
			<hr />
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th scope="col">Título</th>
						<th scope="col">Author</th>
						<th scope="col">Paginas</th>
					</tr>
				</thead>
				<tbody>
					{books.map((book) => (
						<tr key={book.id}>
							<th scope="row">{book.titulo}</th>
							<td>
								<AuthorEmail authorId={book.author} />
							</td>
							<td>{book.paginas}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};

export default Libros;

const AuthorEmail = ({ authorId }: { authorId: string }) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		getAuthor();
	}, []);

	const getAuthor = async () => {
		const db = getFirestore();

		// todo: esta shit no quiere darme el documento
		const authorRef = doc(db, "usuarios", authorId.trim());
		const authorSnapshot = await getDoc(authorRef);

		if (authorSnapshot.exists()) {
			setData(authorSnapshot.data().email);
		} else console.log("El documento no existe");
	};

	return <>{data ? data : "cargando..."}</>;
};
