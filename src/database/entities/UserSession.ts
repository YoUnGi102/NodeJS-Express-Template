import { Entity, Column, ManyToOne } from "typeorm";
import { AuditableEntity } from "./AuditableEntity";
import { User } from "./User";

@Entity()
export class UserSession extends AuditableEntity {
	@ManyToOne(
		() => User,
		(user) => user.sessions,
		{ onDelete: "CASCADE" },
	)
	user: User;

	@Column({ type: "varchar", unique: true })
	refreshToken: string;

	@Column({ type: "varchar", nullable: true })
	userAgent?: string | null;

	@Column({ type: "varchar", nullable: true })
	ipAddress?: string | null;

	constructor(
		user: User,
		ipAddress: string,
		refreshToken: string,
		userAgent?: string,
	) {
		super();
		this.user = user;
		this.ipAddress = ipAddress;
		this.refreshToken = refreshToken;
		this.userAgent = userAgent;
	}
}
