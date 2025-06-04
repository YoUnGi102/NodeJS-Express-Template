import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

const envTestPath = path.resolve(__dirname, "../.env.test");

if (fs.existsSync(envTestPath)) {
	dotenv.config({ path: envTestPath });
}
