export type UserRolesType = {
	admin?: boolean;
	author?: boolean;
};

export type UserType = {
	uid?: string | null;
	email?: string | null;
	activo?: boolean | null;
	rol?: UserRolesType;
};

export type UserContextType = {
	usuario: UserType;
	logIn: () => void;
	logOut: () => void;
};

export type UserProviderProps = {
	children: JSX.Element;
};

export type BookType =
	| {
			id: string;
			author: string;
			paginas: number;
			titulo: string;
	  }
	| DocumentData;

export type BookManagerStateType = "dashboard" | "addBook" | "editBook";

export interface BookDashboardProps {
	booksCollection: BookType[];
	modifyState(newState: BookManagerStateType): void;
}
export interface AddBookProps {
	modifyState(newState: BookManagerStateType): void;
}
