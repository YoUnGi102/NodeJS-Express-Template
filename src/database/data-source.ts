import "reflect-metadata";
import { User, UserSession } from "@database/entities";
import { DataSource } from "typeorm";

if (typeof process.env.DB_PASS !== "string") {
	throw new Error("DB_PASS must be a string");
}

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: false, // never true in production !!!
	logging: process.env.NODE_ENV !== "production",
	entities: [User, UserSession],
	migrations: [
		process.env.NODE_ENV === "production"
			? "dist/database/migrations/**/*.js"
			: "src/database/migrations/**/*.ts",
	],
	subscribers: [],
});
export default AppDataSource;
