// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

class SocketAdapter extends IoAdapter {
	createIOServer(
		port: number,
		options?: ServerOptions & {
			namespace?: string;
			server?: any;
		},
	) {
		const server = super.createIOServer(port, {
			...options,
			connectionStateRecovery: {
				// the backup duration of the sessions and the packets
				maxDisconnectionDuration: 2 * 60 * 1000,
				// whether to skip middlewares upon successful recovery
				skipMiddlewares: true,
			},
		});
		return server;
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS for WebSocket allow *
	app.enableCors({ origin: "*" });
	app.useWebSocketAdapter(new SocketAdapter(app));

	await app.listen(process.env.SERVER_PORT);
}
bootstrap();
