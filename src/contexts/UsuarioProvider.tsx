// React
import { createContext, useEffect, useState } from "react";
// Firebase
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
// Types
import { UserContextType, UserProviderProps, UserType } from "../types/types";

// Context
export const UsuarioContext = createContext<UserContextType | null>(null);

const UsuarioProvider = ({ children }: UserProviderProps) => {
	// User Model
	const dataUsuarioInicial: UserType = {
		email: "",
		uid: "",
		activo: false,
		rol: { admin: false, author: false },
	};

	// UserContext state
	const [usuario, setUsuario] = useState(dataUsuarioInicial);
	const [auth] = useState(() => getAuth());
	const [db] = useState(() => getFirestore());

	// Manage user sesion
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			// detect if user exists
			if (user) {
				let rol = {};
				// Getting the user signed in claims
				user.getIdTokenResult().then((idTokenResult) => {
					// Los claims son los atributos especiales que solo pueden ser modificados a travez del backend.
					// Es aquí donde incorporaremos los permisos especiales para dar permisos de administrador o de usuario normal.

					// En esta condición comprobamos que el usuario sea administrador
					// Cabe destacar que usamos la doble negación por un motivo especial. Con la doble negación comprobamos rápidamente
					// que una condición sea booleana, por lo que en la siguiente condicional estamos preguntando que si el valor es TRUE
					// sea TRUE y no otro valor trully.
					const isAdmin = !!idTokenResult.claims.admin;
					const isAuthor = !!idTokenResult.claims.author;

					setUsuario({
						email: user.email,
						uid: user.uid,
						activo: true,
						rol: { admin: isAdmin, author: isAuthor },
					});
				});
			} else {
				setUsuario(dataUsuarioInicial);
			}
		});
	}, []);

	/**
	 * Login with google popup
	 */
	const logIn = async () => {
		// auth config
		const provider = new GoogleAuthProvider();

		try {
			// Show popup
			const { user } = await signInWithPopup(auth, provider);
			const { email, uid } = user;

			//todo: Pemdiente de arreglar los types
			const userRef = doc(db, "usuarios", `${email}`);

			const userSnap = await getDoc(userRef);
			if (!userSnap.exists()) {
				// Agregando a usuario
				await setDoc(userRef, {
					uid,
					email,
					rol: { invitado: true },
				});
				return;
			}
			console.log("Usuario logeado");
			setUsuario({ email, uid, activo: true, rol: userSnap.data().rol });
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Sign Out
	 */
	const logOut = async () => {
		await signOut(auth);
		setUsuario(dataUsuarioInicial);
	};

	return (
		<UsuarioContext.Provider value={{ usuario, logIn, logOut }}>
			{children}
		</UsuarioContext.Provider>
	);
};

export default UsuarioProvider;
