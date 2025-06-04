import { BeforeInsert, Column } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AuditableEntity } from "./AuditableEntity";

export abstract class AuditableEntityUUID extends AuditableEntity {
	@Column({ type: "uuid", unique: true })
	uuid!: string;

	@BeforeInsert()
	generateUuid() {
		this.uuid = uuidv4();
	}
}
