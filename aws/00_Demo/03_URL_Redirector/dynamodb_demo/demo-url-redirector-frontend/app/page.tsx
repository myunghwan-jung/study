"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
	const [url, setUrl] = useState<string>("");
	const [shortlink, setShortlink] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Helper function to check if the URL has http or https scheme
	const isValidUrl = (url: string): boolean => {
		return /^(http:\/\/|https:\/\/)/.test(url);
	};

	// Handle submission to the API
	const handleSubmit = async () => {
		if (!url) {
			alert("Please enter a URL.");
			return;
		}

		// Check if URL has http or https scheme
		if (!isValidUrl(url)) {
			alert("URL은  http:// 혹은 https:// 로 시작해야 합니다.");
			return;
		}

		try {
			// Call the API to register the URL
			const response = await axios.post(`https://${process.env.NEXT_PUBLIC_SHORTLINK_URL}/register`, {
				url,
			});

			// Update the state with the received shortlink
			setShortlink(`https://${process.env.NEXT_PUBLIC_SHORTLINK_URL}/ln/${response.data.shortlink}`);
			setError(null); // Clear any previous errors
		} catch (error) {
			console.error("Error registering URL:", error);
			setError("Failed to register the URL. Please try again.");
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "#f7f9fc",
				color: "#333",
				fontFamily: "Arial, sans-serif",
				padding: "20px",
			}}
		>
			<h1 style={{ marginBottom: "20px", fontSize: "36px", fontWeight: "bold", color: "#0070f3" }}>URL Redirector - AWS Classroom Demo</h1>

			<input
				type="text"
				placeholder="Enter your URL here"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				style={{
					padding: "10px",
					width: "300px",
					marginBottom: "20px",
					border: "1px solid #ccc",
					borderRadius: "4px",
				}}
			/>

			<button
				onClick={handleSubmit}
				style={{
					padding: "12px 24px",
					cursor: "pointer",
					backgroundColor: "#0070f3",
					color: "white",
					border: "none",
					borderRadius: "4px",
					fontWeight: "bold",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				Shorten URL
			</button>

			{shortlink && (
				<div
					style={{
						marginTop: "20px",
						padding: "10px",
						border: "1px solid #0070f3",
						borderRadius: "4px",
						backgroundColor: "#fff",
						color: "#0070f3",
						fontWeight: "bold",
					}}
				>
					Shortlink:{" "}
					<a href={shortlink} target="_blank" rel="noopener noreferrer">
						{shortlink}
					</a>
				</div>
			)}

			{error && (
				<div
					style={{
						marginTop: "20px",
						padding: "10px",
						border: "1px solid red",
						borderRadius: "4px",
						backgroundColor: "#ffe6e6",
						color: "red",
						fontWeight: "bold",
					}}
				>
					{error}
				</div>
			)}
		</div>
	);
}
