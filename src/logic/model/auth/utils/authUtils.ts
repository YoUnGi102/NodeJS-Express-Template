import { JWTPayload } from "@src/logic/shared/types/auth.types";
import { ERRORS } from "@src/logic/shared/utils/errors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const signRefreshToken = (userUUID: string) => {
	const refreshToken = jwt.sign(
		{
			uuid: userUUID,
			tokenUUID: uuidv4(),
			type: "refresh",
		},
		process.env.JWT_REFRESH_SECRET!,
		{
			expiresIn: (process.env.JWT_ACCESS_EXPIRATION ||
				"7d") as jwt.SignOptions["expiresIn"],
		},
	);
	return refreshToken;
};

const signAccessToken = (username: string, uuid: string, email: string) => {
	const token = jwt.sign(
		{ username, uuid, email, jti: uuidv4() },
		process.env.JWT_ACCESS_SECRET!,
		{
			expiresIn: (process.env.JWT_ACCESS_EXPIRATION ||
				"1h") as jwt.SignOptions["expiresIn"],
		},
	);
	return token;
};

const verifyAccessToken = (token?: string): JWTPayload => {
	if (!token) {
		throw ERRORS.AUTH.ACCESS_TOKEN_NOT_PROVIDED();
	}

	const decoded = jwt.verify(
		token,
		process.env.JWT_ACCESS_SECRET as string,
	) as JWTPayload;

	if (
		typeof decoded !== "object" ||
		!("username" in decoded) ||
		!("email" in decoded) ||
		!("uuid" in decoded)
	) {
		throw ERRORS.AUTH.ACCESS_TOKEN_INVALID();
	}

	return decoded;
};

export default { signAccessToken, signRefreshToken, verifyAccessToken };
