import { Tabs } from "@flame/ui";
import { useState } from "react";

export const WithOnChangeExample = () => {
	const [selected, setSelected] = useState("home");

	return (
		<div>
			<Tabs initialTab="home" onChange={setSelected}>
				<Tabs.Item value="home">홈</Tabs.Item>
				<Tabs.Item value="profile">프로필</Tabs.Item>
				<Tabs.Item value="settings">설정</Tabs.Item>
			</Tabs>
			<p>선택된 탭: {selected}</p>
		</div>
	);
};
