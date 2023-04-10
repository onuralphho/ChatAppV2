import { RiChatSmile3Fill } from "react-icons/ri";
import { IMessage } from "../@types/messageType";
import { useState, useRef, useEffect } from "react";
import { Fetcher } from "../utils/Fetcher";
import { useAuth } from "../Context/AuthProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface IProps {
  talkingTo: ITalkingTo;
  messages: IMessage[] | undefined;
}

const ChatLog = (props: IProps) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [checkerVal, setCheckerVal] = useState(false);
  const [windowInnerHeight, setWindowInnerHeight] = useState<number>();
  const ctx = useAuth();

  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const res = await Fetcher({
    //   method: "POST",
    //   body: {
    //     contentText: messageInput,
    //     fromUserId: ctx?.user && ctx.user.id,
    //     toUserId: props.talkingTo.id,
    //     friendBoxId: props.talkingTo.friendBoxId,
    //   },
    //   url: "/api/messages/addmessage",
    //   token: ctx?.getCookie("jwt"),
    // });

    // ctx?.setMessages((prev) => [...(prev || []), res]);

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_ENDPOINT_URL}/chatHub`)
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("RecieveMessage", (message) => {
      //İlk mesaj 1 kere, 2. mesaj 2 kere, 3. mesaj 3 kere .... ve böyle devam ediyor (HATA!!!!!!)
      ctx?.setMessages((prev) => {
        if (prev && prev.some((premessage) => premessage.id === message.id)) {
          // Bu hatayı bu şekidle clienta göstermiyorum fakat console.log yaparsam mesajın her seferinde x katına çıktığını gözlemliyorum
          return prev;
        }

        return [...(prev || []), message];
      });
    });

    await connection.start();
    await connection.invoke("SendMessage", {
      contentText: messageInput,
      fromUserId: ctx?.user?.id,
      toUserId: props.talkingTo.id,
      friendBoxId: props.talkingTo.friendBoxId,
    });

    setCheckerVal(true);
    setMessageInput("");
  };

  const scrollToBottom = () => {
    if (checkerVal === false) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    } else {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }
  };

  useEffect(() => {
    setWindowInnerHeight(window.innerHeight);
    scrollToBottom();
  }, [ctx?.messages]);

  return (
    <div className=" bg-[#363636]    flex-1  flex flex-col  h-full fade-in">
      {/* TALKINGTO */}

      <div className="  w-full p-2 pl-12 flex items-center gap-3">
        <img
          className="w-10 h-10 object-cover rounded-full"
          src={
            ctx?.user && ctx.user.id === props.talkingTo.id
              ? ctx?.user.picture
              : props.talkingTo.picture
          }
          alt=""
        />
        <span className="text-xl">{props.talkingTo.name}</span>
      </div>

      {/* LOG */}

      <div
        className={`flex flex-1 flex-col h-20 gap-2 w-full overflow-y-scroll  px-2   pb-2 `}
      >
        {props.messages?.map((message) => (
          <div
            key={message.id}
            className={` flex  rounded-lg gap-2 p-1 w-max  items-end    ${
              ctx?.user && ctx.user.id === message.fromUserId
                ? "self-end  justify-end flex-row-reverse"
                : "self-start justify-start"
            }`}
          >
            <img
              src={
                ctx?.user && ctx.user.id === message.fromUserId
                  ? ctx?.user.picture
                  : props.talkingTo.picture
              }
              className="w-8 rounded-full "
              alt=""
            />

            <div
              className={` flex  rounded-lg bg-white mb-4 px-2 py-1 min-h-8 gap-2   w-max    ${
                ctx?.user && ctx.user.id === message.fromUserId
                  ? " rounded-br-none "
                  : " rounded-bl-none "
              }`}
            >
              <span className=" text-black  break-words whitespace-pre-line max-sm:max-w-[70dvw]  max-w-[450px]  ">
                {message.contentText}
              </span>
              <span className="text-neutral-500 text-xs italic self-end">
                {message.sentDate.split("T")[1].split(".")[0].split(":")[0]}:
                {message.sentDate.split("T")[1].split(".")[0].split(":")[1]}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessageHandler}
        className=" relative  bg-white h-12 border-t-4  focus-within:border-green-600 "
      >
        <div className="relative flex pl-2 h-full items-center  gap-2">
          <RiChatSmile3Fill size={20} className=" text-green-500" />
          <input
            type="text"
            onChange={messageChangeHandler}
            value={messageInput}
            placeholder="Say Hi!"
            className="bg-transparent text-black w-full outline-none  "
          />
          <button
            type={"submit"}
            disabled={messageInput.length === 0 ? true : false}
            className="disabled:bg-neutral-400 bg-green-500 h-full px-4 text-white font-semibold text-xl"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatLog;
