import { RiChatSmile3Fill } from "react-icons/ri";
import { IMessage } from "../@types/messageType";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { Fetcher } from "../utils/Fetcher";
import { useConnectionContext } from "../Context/ConnectionProvider";

interface IProps {
  talkingTo: ITalkingTo;
  messages: IMessage[] | undefined;
}

const ChatLog = (props: IProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [checkerVal, setCheckerVal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conCtx = useConnectionContext();
  const ctx = useAuth();

  const messageAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
  );
  messageAudio.volume = 0.2;

  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendMessagePayload = {
      contentText: messageInput,
      fromUserId: ctx?.user?.id,
      toUserId: props.talkingTo.id,
      friendBoxId: props.talkingTo.friendBoxId,
      fromUser: {
        name: ctx?.user?.name,
        id: ctx?.user?.id,
        picture: ctx?.user?.picture,
      },
    };

    const res = await Fetcher({
      method: "POST",
      body: sendMessagePayload,
      url: "/api/messages/addmessage",
      token: ctx?.getCookie("jwt"),
    });

    messageAudio.play();

    ctx?.setMessages((prev) => [...(prev || []), res]);
    let dateNow = new Date();
    ctx?.setFriendList((prev) => {
      let friend = prev?.find((f) => f.id === props.talkingTo.friendBoxId);
      if (friend) {
        friend.updateTime = dateNow.toISOString();
        friend.lastMessage = res.contentText;
        friend.lastMessageFrom = res.fromUser.name;

        return [...(prev || [])];
      }
      return prev || [];
    });

    await conCtx?.connection?.invoke("SendMessage", res);
    setCheckerVal(true);
    setMessageInput("");
  };

  const scrollToBottom = useCallback(() => {
    if (checkerVal === false) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    } else {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }
  }, [checkerVal, messagesEndRef]);

  useEffect(() => {
    scrollToBottom();
  }, [ctx?.messages, scrollToBottom]);

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
        className={`flex flex-1 flex-col  gap-0 w-full overflow-y-scroll  px-2   pb-2 `}
      >
        {props.messages
          ?.filter(
            (message) => message.friendBoxId === props.talkingTo.friendBoxId
          )
          .map((message, index) => (
            <div
              key={message.id}
              className={` flex max-md:pr-3  rounded-lg gap-3 p-1 w-max  items-end    ${
                ctx?.user?.id === message.fromUserId
                  ? "self-end  justify-end flex-row-reverse"
                  : "self-start justify-start"
              }`}
            >
              {props.messages &&
              message.fromUserId !== props.messages[index + 1]?.fromUserId ? (
                <img
                  src={
                    ctx?.user && ctx.user.id === message.fromUserId
                      ? ctx?.user.picture
                      : props.talkingTo.picture
                  }
                  className={`w-8 rounded-full   ${
                    ctx?.user && ctx.user.id === message.fromUserId
                      ? "max-md:hidden"
                      : ""
                  }`}
                  alt=""
                />
              ) : (
                <div
                  className={`w-8  ${
                    ctx?.user && ctx.user.id === message.fromUserId
                      ? "max-md:hidden"
                      : ""
                  }`}
                ></div>
              )}

              <div
                className={`relative flex  rounded-lg mb-3  px-3 py-1 min-h-8 gap-2   w-max    ${
                  ctx?.user && ctx.user.id === message.fromUserId
                    ? "  bg-green-700 text-[#efefef] "
                    : "  bg-[#efefef] text-black"
                }   ${
                  props.messages &&
                  message.fromUserId !== props.messages[index + 1]?.fromUserId
                    ? ctx?.user && ctx.user.id === message.fromUserId
                      ? "rounded-br-none right-tri"
                      : "rounded-bl-none left-tri"
                    : ""
                }`}
              >
                <span className="text-lg  break-words whitespace-pre-line max-sm:max-w-[70dvw]  max-w-[450px]  ">
                  {message.contentText}
                </span>
                <div className="flex items-end gap-1.5 ">
                  <span
                    className={`text-xs italic self-end ${
                      ctx?.user && ctx.user.id === message.fromUserId
                        ? "text-[#efefef]"
                        : ""
                    } `}
                  >
                    {
                      message.sentDate
                        .toLocaleString()
                        .split("T")[1]
                        .split(".")[0]
                        .split(":")[0]
                    }
                    :
                    {
                      message.sentDate
                        .toLocaleString()
                        .split("T")[1]
                        .split(".")[0]
                        .split(":")[1]
                    }
                  </span>
                  <div
                    className={`${
                      message.fromUserId !== ctx?.user?.id && "hidden"
                    } flex w-2 h-4  relative mx-1`}
                  >
                    <div
                      className={`${
                        message.isRead
                          ? " border-r-blue-400 border-b-blue-300"
                          : "border-r-neutral-400 border-b-neutral-300"
                      } ${
                        message.fromUserId !== ctx?.user?.id && "hidden"
                      } absolute  w-1.5 h-4 border-[2.4px] border-t-transparent border-l-transparent  inline-block  rotate-[52deg] -right-[6px] -top-[1px] skew-x-12 `}
                    ></div>
                    <div
                      className={` ${
                        message.isRead
                          ? " border-r-blue-400 border-b-blue-300"
                          : "border-r-neutral-400 border-b-neutral-300"
                      }
                      ${
                        message.fromUserId !== ctx?.user?.id && "hidden"
                      } border-r-neutral-400 border-b-neutral-300 absolute  w-2 h-4 border-[2.5px] border-t-transparent border-l-transparent -top-[1px]  inline-block skew-x-12  rotate-[52deg]  `}
                    ></div>
                  </div>
                </div>
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
