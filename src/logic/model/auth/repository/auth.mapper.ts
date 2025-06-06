import { User } from "@src/database/entities";
import { AuthDTO } from "../auth.types";

export const toAuthDTO = (user: User): AuthDTO => ({
	id: user.id,
	username: user.username,
	email: user.email,
	password: user.password,
	uuid: user.uuid,
	createdAt: user.createdAt,
});


// import { User } from "@src/database/entities";
// import { AuthDTO } from "../auth.types";
// import { AuthDTOSchema } from "../auth.schema";

// export const toAuthDTO = (user: User): AuthDTO => AuthDTOSchema().parse(user);
