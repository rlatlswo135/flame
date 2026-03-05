import { useState } from "react";

export const KeepMountedExample = () => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<h1>Count: {count}</h1>
			<button type="button" onClick={() => setCount((c) => c + 1)}>
				Increment
			</button>
			<button type="button" onClick={() => setCount((c) => c - 1)}>
				Decrement
			</button>
		</div>
	);
};
