import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
	const PORT = 5000;
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("/api/");
	app.enableVersioning({ type: VersioningType.URI });
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.enableCors({ origin: "*" });

	const config = new DocumentBuilder()
		.setTitle("Shoppirest")
		.setDescription("The e-commerce API")
		.setVersion("1.0")
		.addBearerAuth()
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
bootstrap();
