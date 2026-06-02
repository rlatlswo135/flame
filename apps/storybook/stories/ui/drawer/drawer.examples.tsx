import { Drawer } from "@flame/ui";
import type { CSSProperties } from "react";

type Placement = "top" | "right" | "bottom" | "left";

// position과 엣지 도킹은 Drawer가 소유한다. 소비자는 주축 크기만 지정한다.
const PLACEMENT_SIZE: Record<Placement, CSSProperties> = {
	right: { width: "320px" },
	left: { width: "320px" },
	top: { height: "200px" },
	bottom: { height: "200px" },
};

const baseContentStyle: CSSProperties = {
	background: "#fff",
	padding: "24px",
	boxShadow: "0 0 20px rgba(0,0,0,0.15)",
};

export { PLACEMENT_SIZE, baseContentStyle };

export const DefaultExample = () => (
	<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
		{(["right", "left", "top", "bottom"] as const).map((p) => (
			<Drawer key={p} placement={p}>
				<Drawer.Trigger>
					<button type="button">{p}</button>
				</Drawer.Trigger>
				<Drawer.Content style={{ ...baseContentStyle, ...PLACEMENT_SIZE[p] }}>
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

export const NestedExample = () => (
	<Drawer>
		<Drawer.Trigger>
			<button type="button">open outer</button>
		</Drawer.Trigger>
		<Drawer.Content style={{ ...baseContentStyle, ...PLACEMENT_SIZE.right }}>
			<h3>Outer Drawer</h3>
			<p>This is the outer drawer. Open the inner one below.</p>
			<Drawer>
				<Drawer.Trigger>
					<button type="button">open inner</button>
				</Drawer.Trigger>
				<Drawer.Content
					style={{
						...baseContentStyle,
						...PLACEMENT_SIZE.right,
						width: "280px",
						background: "#f9f9f9",
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

export const CustomControlsExample = () => (
	<Drawer>
		<Drawer.Trigger>
			{({ open }) => (
				<button
					type="button"
					onClick={() => {
						console.log("opening");
						open();
					}}
				>
					open drawer
				</button>
			)}
		</Drawer.Trigger>
		<Drawer.Content style={{ ...baseContentStyle, ...PLACEMENT_SIZE.right }}>
			<h3>Custom Controls</h3>
			<Drawer.Closer>
				{({ close }) => (
					<button
						type="button"
						onClick={() => {
							console.log("closing");
							close();
						}}
					>
						close drawer
					</button>
				)}
			</Drawer.Closer>
		</Drawer.Content>
	</Drawer>
);

export const FormExample = () => (
	<Drawer placement="right">
		<Drawer.Trigger>
			<button type="button">open form drawer</button>
		</Drawer.Trigger>
		<Drawer.Content style={{ ...baseContentStyle, ...PLACEMENT_SIZE.right }}>
			<h3>Edit Profile</h3>
			<form
				style={{ display: "flex", flexDirection: "column", gap: "12px" }}
				onSubmit={(e) => e.preventDefault()}
			>
				<label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
					Name
					<input type="text" defaultValue="" />
				</label>
				<label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
					Email
					<input type="email" defaultValue="" />
				</label>
				<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
					<Drawer.Closer>
						<button type="button">cancel</button>
					</Drawer.Closer>
					<Drawer.Closer>
						<button type="submit">save</button>
					</Drawer.Closer>
				</div>
			</form>
		</Drawer.Content>
	</Drawer>
);
