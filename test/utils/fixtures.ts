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

export const INVALID_JWT =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZXhwIjoxNzE4NDA0MzY4fQ.zLOUGmMTU5E7D9Dk8CeHkq1bfp4XcmQtKRT-bZznZwA";
