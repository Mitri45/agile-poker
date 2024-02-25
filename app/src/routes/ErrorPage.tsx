import notFound from "../assets/404.jpg";

export default function ErrorPage() {
	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded shadow-md text-center">
				<h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Where is that one?</h1>
				<p className="text-gray-700 text-lg mb-8">
					Stay calm and return to the{" "}
					<a href="/" className="text-blue-500">
						home page
					</a>
					.
				</p>
				<img src={notFound} alt="Not found" className="max-w-full mx-auto" />
			</div>
		</div>
	);
}
