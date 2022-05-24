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

type BookType = {
	id: string;
	data:
		| {
				id: string;
				titulo: string;
				paginas: number;
				author: DocumentReference;
		  }
		| DocumentData;
};

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
			const data = book.data();
			bookspayload.push({ id, data });
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
						<th>Título</th>
						<th>Paginas</th>
						<th>Author</th>
					</tr>
				</thead>
				<tbody>
					{books.map((book) => (
						<tr key={book.id}>
							<td>{book.data.titulo}</td>
							<td>{book.data.paginas}</td>
							<td>
								<AuthorEmail authorId={book.data.author} />
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};

export default Libros;

const AuthorEmail = ({ authorId }: { authorId: string }) => {
	const [data, setData] = useState();

	useEffect(() => {
		getAuthor();
	}, []);

	const getAuthor = async () => {
		const db = getFirestore();
		console.log(authorId);
		const authorRef = doc(db, "usuarios", authorId);
		const authorSnapshot = await getDoc(authorRef);

		if (authorSnapshot.exists()) {
			console.log(authorSnapshot.data());
		} else console.log("El documento no existe");
	};

	return <span>hola</span>;
};
