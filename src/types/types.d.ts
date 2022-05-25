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
