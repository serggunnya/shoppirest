import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService) {
		super({
			log: ["query", "info"],
			errorFormat: "pretty",
			datasources: { db: { url: config.get("DATABASE_URL") } },
		});
	}
}
