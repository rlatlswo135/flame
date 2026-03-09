import { useState } from "react";

export const FormExample = () => {
	const [name, setName] = useState("");
	return (
		<div>
			<h3>Step with Form State</h3>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Enter your name"
			/>
			<p>Current value: {name}</p>
		</div>
	);
};
