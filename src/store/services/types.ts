export type LoginPayloadType = {
	success?: boolean;
	message?: string;
	userId?: string;
	role?: string;
	token?: string;
	refreshToken?: string;
};

export type LoginBodyType = {
	email: string;
	password: string;
};
