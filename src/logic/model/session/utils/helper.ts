import { UserSession } from "@src/database/entities/UserSession";
import { JWTPayload } from "@src/logic/shared/types/auth.types";
import { ERRORS } from "@src/logic/shared/utils/errors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserSessionDTO } from "../session.types";

export const signRefreshToken = (userUUID: string) => {
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

export const verifyRefreshToken = (refreshToken: string): JWTPayload => {
	let jwtPayload: JWTPayload;
	try {
		jwtPayload = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!,
		) as JWTPayload;
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw ERRORS.AUTH.REFRESH_TOKEN_EXPIRED();
		}
		throw ERRORS.AUTH.REFRESH_TOKEN_INVALID();
	}
	return jwtPayload;
};

export const toUserSessionDTO = (session: UserSession): UserSessionDTO => ({
	id: session.id,
	createdAt: session.createdAt,
	updatedAt: session.updatedAt,
	deletedAt: session.deletedAt,
	refreshToken: session.refreshToken,
	userAgent: session.userAgent,
	ipAddress: session.ipAddress,
	user: {
		username: session.user.username,
		email: session.user.email,
		uuid: session.user.uuid,
		createdAt: session.user.uuid,
	},
});
