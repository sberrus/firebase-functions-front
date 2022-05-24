export type UserType = {
	uid?: string | null;
	email?: string | null;
	activo?: boolean | null;
	rol?: "admin" | "author" | "invitado";
};

export type UserContextType = {
	usuario: UserType;
	logIn: () => void;
	logOut: () => void;
};

export type UserProviderProps = {
	children: JSX.Element;
};
