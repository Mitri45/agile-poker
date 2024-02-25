import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StartPage from "./routes/StartPage";
import ErrorPage from "./routes/ErrorPage";
import AgilePokerPage from "./routes/AgilePoker";
import Root from "./routes/Root";

const router = createBrowserRouter([
	{
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <StartPage />,
			},
			{
				path: "/room/:roomId",
				element: <AgilePokerPage />,
				loader: ({ params }) => {
					return params;
				},
			},
		],
	},
]);
const root = document.getElementById("root");
if (root)
	createRoot(root).render(
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>,
	);
