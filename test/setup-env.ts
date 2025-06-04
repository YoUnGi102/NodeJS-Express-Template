import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const envTestPath = path.resolve(__dirname, "../.env.test");

if (fs.existsSync(envTestPath)) {
	dotenv.config({ path: envTestPath });
}
