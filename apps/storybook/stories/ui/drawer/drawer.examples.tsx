import { Drawer } from "@flame/ui";
import { useState } from "react";

export const DefaultExample = () => {
	const [placement, setPlacement] =
		useState<Parameters<typeof Drawer>[0]["placement"]>("right");

	return (
		<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
			{(["right", "left", "top", "bottom"] as const).map((p) => (
				<Drawer key={p} placement={p}>
					<Drawer.Trigger>
						<button type="button">{p}</button>
					</Drawer.Trigger>
					<Drawer.Content
						style={{
							position: "fixed",
							background: "#fff",
							padding: "24px",
							boxShadow: "0 0 20px rgba(0,0,0,0.15)",
							...(p === "right" && {
								top: 0,
								right: 0,
								height: "100%",
								width: "320px",
							}),
							...(p === "left" && {
								top: 0,
								left: 0,
								height: "100%",
								width: "320px",
							}),
							...(p === "top" && {
								top: 0,
								left: 0,
								width: "100%",
								height: "200px",
							}),
							...(p === "bottom" && {
								bottom: 0,
								left: 0,
								width: "100%",
								height: "200px",
							}),
						}}
					>
						<h3>Drawer ({p})</h3>
						<p>Slide-in panel content.</p>
						<Drawer.Closer>
							<button type="button">close</button>
						</Drawer.Closer>
					</Drawer.Content>
				</Drawer>
			))}
		</div>
	);
};

export const NestedExample = () => (
	<Drawer>
		<Drawer.Trigger>
			<button type="button">open outer</button>
		</Drawer.Trigger>
		<Drawer.Content
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				height: "100%",
				width: "320px",
				background: "#fff",
				padding: "24px",
				boxShadow: "0 0 20px rgba(0,0,0,0.15)",
			}}
		>
			<h3>Outer Drawer</h3>
			<p>This is the outer drawer. Open the inner one below.</p>
			<Drawer>
				<Drawer.Trigger>
					<button type="button">open inner</button>
				</Drawer.Trigger>
				<Drawer.Content
					style={{
						position: "fixed",
						top: 0,
						right: 0,
						height: "100%",
						width: "280px",
						background: "#f9f9f9",
						padding: "24px",
						boxShadow: "0 0 20px rgba(0,0,0,0.15)",
					}}
				>
					<h3>Inner Drawer</h3>
					<p>ESC closes only this drawer. Focus is trapped here.</p>
					<Drawer.Closer>
						<button type="button">close inner</button>
					</Drawer.Closer>
				</Drawer.Content>
			</Drawer>
			<Drawer.Closer>
				<button type="button">close outer</button>
			</Drawer.Closer>
		</Drawer.Content>
	</Drawer>
);
