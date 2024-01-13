import React, { useEffect, useRef, useState } from "react";
import { Fetcher } from "../../../utils/Fetcher";
import { useAuth } from "../../../Context/AuthProvider";
import { useInView } from "framer-motion";

type Props = {

};

function MessageLoader({}: Props) {
	const [skipAmount, setSkipAmount] = useState<number>(20);

	const messageLoaderRef = useRef<HTMLDivElement>(null);

	const isInView = useInView(messageLoaderRef);

	const ctx = useAuth();

	const takeNextMessages = async () => {
		const res = await Fetcher({
			method: "GET",
			url: "/api/messages/" + ctx?.talkingTo?.friendBoxId + `/?skip=${skipAmount}`,
			token: ctx?.getCookie("jwt"),
		});
		setSkipAmount((prev) => prev + 20);

		const data = await res.json();

	
			ctx?.setMessages((prev) => {
				if (prev) {
					return [...prev, ...data];
				} else return data;
			});
		
	};

	useEffect(() => {
		if (isInView) {
			takeNextMessages();
		}
	}, [isInView]);

	return (
		<div ref={messageLoaderRef} className={`flex justify-center `}>
			<span className="w-10 h-10 rounded-full border-8 border-t-transparent border-green-500 animate-spin"></span>
		</div>
	);
}

export default MessageLoader;
