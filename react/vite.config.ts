import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	// depending on your application, base can also be "/"
	resolve: {
		alias: {
			components: "./src/components",
			pages: "./src/pages",
			store: "./src/store",
		},
	},
	plugins: [react(), viteTsconfigPaths()],
	server: {
		open: true,
		port: 3000,
	},
});
