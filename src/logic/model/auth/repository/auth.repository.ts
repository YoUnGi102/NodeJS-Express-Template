import { User } from "@src/database/entities";
import { inject, injectable } from "tsyringe";
import {
	DataSource,
	FindOptionsSelect,
	FindOptionsWhere,
	IsNull,
} from "typeorm";
import { AuthDTO, AuthRegisterRequest } from "../auth.types";
import { IAuthRepository } from "./auth.repository.interface";
import { AuthDTOSchema } from "../auth.schema";

const USER_ACTIVE_CONDITION = {
	active: true,
	deletedAt: IsNull(),
};

const DEFAULT_SELECT = {
	id: true,
	username: true,
	email: true,
	uuid: true,
	createdAt: true,
};

@injectable()
export class TypeormAuthRepository implements IAuthRepository {
	private userRepo;

	constructor(@inject(DataSource) private dataSource: DataSource) {
		this.userRepo = dataSource.getRepository(User);
	}

	private async findBy(
		where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
		extraFields: FindOptionsSelect<User> = {},
	): Promise<User | null> {
		const select = {
			...DEFAULT_SELECT,
			...extraFields,
		};

		const user = await this.userRepo.findOne({ where, select });
		return user;
	}

	async findByUsernameOrEmail(
		username: string,
		email: string,
	): Promise<AuthDTO | null> {
		const user = await this.findBy([{ username }, { email }]);
		return user ? AuthDTOSchema().parse(user) : null;
	}

	async findByUsernameWithPassword(username: string): Promise<AuthDTO | null> {
		const user = await this.findBy(
			{ ...USER_ACTIVE_CONDITION, username },
			{ password: true },
		);
		return user ? AuthDTOSchema().parse(user) : null;
	}

	async findByUUID(uuid: string): Promise<AuthDTO | null> {
		const user = await this.findBy({ ...USER_ACTIVE_CONDITION, uuid });
		return user ? AuthDTOSchema().parse(user) : null;
	}

	async create(auth: AuthRegisterRequest): Promise<AuthDTO> {
		const user = this.userRepo.create({
			username: auth.username,
			email: auth.email,
			password: auth.password,
		});
		const userCreated = await this.userRepo.save(user);
		return AuthDTOSchema().parse(userCreated);
	}
}
