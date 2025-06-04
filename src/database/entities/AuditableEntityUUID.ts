import { BeforeInsert, Column } from "typeorm";
import { AuditableEntity } from "./AuditableEntity";
import { v4 as uuidv4 } from "uuid";

export abstract class AuditableEntityUUID extends AuditableEntity {
	@Column({ type: "uuid", unique: true })
	uuid!: string;

	@BeforeInsert()
	generateUuid() {
		this.uuid = uuidv4();
	}
}
