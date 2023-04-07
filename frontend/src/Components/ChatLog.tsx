import { RiChatSmile3Fill } from "react-icons/ri";
import { IMessage } from "../@types/messageType";
import { useState } from "react";
import { Fetcher } from "../utils/Fetcher";
import { useAuth } from "../Context/AuthProvider";

interface IProps {
  talkingTo: ITalkingTo;
  messages: IMessage[] | undefined;
}

const ChatLog = (props: IProps) => {
  const [messageInput, setMessageInput] = useState("");

  const ctx = useAuth();

  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await Fetcher({
      method: "POST",
      body: {
        contentText: messageInput,
        fromUserId: ctx?.user.id,
        toUserId: props.talkingTo.id,
        friendBoxId: props.talkingTo.friendBoxId,
      },
      url: "/api/messages/addmessage",
      token: ctx?.getCookie("jwt"),
    });

    ctx?.setMessages((prev: IMessage[]) => [...(prev || []), res]);

    setMessageInput("");
  };

  return (
    <div className=" bg-[#363636] flex-1   h-full fade-in">
      {/* TALKINGTO */}
      <div className="flex ">
        <div className="  w-full p-2 flex items-center gap-3">
          <img
            className="w-10 h-10 object-cover rounded-full"
            src={props.talkingTo.picture}
            alt=""
          />
          <span className="text-xl">{props.talkingTo.name}</span>
        </div>
      </div>
      {/* LOG */}
      <div className="flex max-lg:h-[calc(100%-55px)] h-[calc(100%-39.5px)] flex-col">
        <div className=" flex-1">
          <div className="flex flex-col w-full">
            {props.messages?.map((message, index) => (
              <div key={index} className="text-2xl bg-white text-black">
                {message.contentText}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={sendMessageHandler} className=" relative  ">
          <label className=" border-t-4 focus-within:border-green-600 bg-white h-12 text-[#252525] left-0 right-0  max-lg:bottom-0 bottom-4 absolute   ">
            <div className="relative flex px-2 h-full items-center  gap-2">
              <RiChatSmile3Fill size={20} className=" text-green-500" />
              <input
                type="text"
                onChange={messageChangeHandler}
                value={messageInput}
                placeholder="Say Hi!"
                className="bg-transparent w-full outline-none  "
              />
              <button
                type={"submit"}
                className="bg-green-500 h-full px-4 text-white font-semibold text-xl"
              >
                Send
              </button>
            </div>
          </label>
        </form>
      </div>
    </div>
  );
};

export default ChatLog;
