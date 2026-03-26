import { Toast, toast } from "@flame/ui";

export const CompoundExample = () => (
	<button
		type="button"
		onClick={() =>
			toast(
				<Toast>
					<Toast.Title>Saved</Toast.Title>
					<Toast.Description>Your changes have been saved.</Toast.Description>
				</Toast>,
			)
		}
	>
		Show compound toast
	</button>
);

export const CustomTimeoutExample = () => (
	<button
		type="button"
		onClick={() => toast(<div>I stay for 5 seconds</div>, { timeout: 5000 })}
	>
		Show 5s toast
	</button>
);
