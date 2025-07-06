import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
	const PORT = 5000;
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("/api/");
	app.use(cookieParser());
	app.enableVersioning({ type: VersioningType.URI });
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.enableCors({
		origin: process.env.ORIGIN,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	});

	const config = new DocumentBuilder()
		.setTitle("Shoppirest API")
		.setDescription("The e-commerce API")
		.setVersion("1.0")
		.addCookieAuth("ACCESS_TOKEN")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document, {
		swaggerOptions: {
			tagsSorter: "alpha",
			operationsSorter: "alpha",
		},
	});

	await app.listen(PORT, () => {
		console.log(`server started on localhost:${PORT}`);
	});
}

bootstrap().catch((err) => {
	console.error("Application failed to start", err);
	process.exit(1);
});
