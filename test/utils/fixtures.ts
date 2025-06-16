import { User } from "@src/database/entities";
import { generateMockUUID } from "./factories";

export const DB_USER_MOCK: Partial<User> = {
	username: "Test123",
	email: "test123@example.com",
	password: "Test123.+",
	createdAt: new Date(),
	uuid: generateMockUUID(),
	id: 1,
};
