import { RiChatSmile3Fill } from "react-icons/ri";
import { HiPaperAirplane } from "react-icons/hi2";
import { FiPaperclip } from "react-icons/fi";
import { HiPhoto } from "react-icons/hi2";
import { IMessage } from "../@types/messageType";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { Fetcher } from "../utils/Fetcher";
import { useConnectionContext } from "../Context/ConnectionProvider";
import ChatLoader from "./ChatLoader";
import AWS from "aws-sdk";
import { motion } from "framer-motion";

interface IProps {
  talkingTo: ITalkingTo;
  messages: IMessage[] | undefined;
}

const ChatLog = (props: IProps) => {
  const [messageInput, setMessageInput] = useState<string>("");
  const [checkerVal, setCheckerVal] = useState<boolean>(false);
  const [showFileInput, setShowFileInput] = useState<boolean>(false);
  const [fileInput, setFileInput] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conCtx = useConnectionContext();
  const ctx = useAuth();

  const messageAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
  );
  messageAudio.volume = 0.2;

  const s3 = new AWS.S3({
    region: "eu-central-1",
    accessKeyId: "AKIA6H5KPEMDWXWIF3IM",
    secretAccessKey: "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",
  });
  const messageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setFileInput(file);
        setPreviewImage(reader.result as string);
      };
      setShowFileInput(false);
      reader.readAsDataURL(file);
    }
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fileInput) {
      const params = {
        Bucket: "chatappv2/",
        Key: fileInput.name,
        Body: fileInput,
        ACL: "public-read",
      };
      const dataS3 = await s3.upload(params).promise();
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
        contentImageUrl: fileInput && dataS3.Location,
      };
      const res = await Fetcher({
        method: "POST",
        body: sendMessagePayload,
        url: "/api/messages/addmessage",
        token: ctx?.getCookie("jwt"),
      });
      const data = await res.json();
      messageAudio.play();

      ctx?.setMessages((prev) => [...(prev || []), data]);
      let dateNow = new Date();
      ctx?.setFriendList((prev) => {
        let friend = prev?.find((f) => f.id === props.talkingTo.friendBoxId);
        if (friend) {
          friend.updateTime = dateNow.toISOString();
          friend.lastMessage = data.contentText;
          friend.lastMessageFrom = data.fromUser.name;

          return [...(prev || [])];
        }
        return prev || [];
      });
      await conCtx?.connection?.invoke("SendMessage", data);
      setCheckerVal(true);
      setMessageInput("");
      setFileInput(undefined);
      setPreviewImage(null);
    } else {
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
      const data = await res.json();
      messageAudio.play();

      ctx?.setMessages((prev) => [...(prev || []), data]);
      let dateNow = new Date();
      ctx?.setFriendList((prev) => {
        let friend = prev?.find((f) => f.id === props.talkingTo.friendBoxId);
        if (friend) {
          friend.updateTime = dateNow.toISOString();
          friend.lastMessage = data.contentText;
          friend.lastMessageFrom = data.fromUser.name;

          return [...(prev || [])];
        }
        return prev || [];
      });
      await conCtx?.connection?.invoke("SendMessage", data);
      setCheckerVal(true);
      setMessageInput("");
      setFileInput(undefined);
      setPreviewImage(null);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (checkerVal === false) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
  const item = {
    hidden: { opacity: 0, scale:0},
    visible: {
      
      opacity: 1,
      scale:1
    },
  };
  return (
    <div className=" bg-[#363636] w-full    flex-1  flex flex-col  h-full fade-in">
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

      {showFullImage && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowFullImage("");
          }}
          className="w-full h-full absolute z-30 flex bg-[rgba(0,0,0,0.4)] items-center justify-center  backdrop-blur-sm"
        >
          <motion.img
            variants={item}
            initial="hidden"
            animate="visible"
            src={showFullImage}
            className="w-[700px] rounded-xl object-cover"
            alt=""
          />
        </div>
      )}

      {/* LOG */}

      <div
        className={`flex flex-1 flex-col px-1  gap-0 overflow-y-scroll overflow-x-hidden  pb-2`}
      >
        {props.messages
          ? props.messages
              .filter(
                (message) => message.friendBoxId === props.talkingTo.friendBoxId
              )
              .map((message, index) => (
                <div
                  key={message.id}
                  className={` flex max-md:pr-2  rounded-lg gap-3 p-1 w-max  items-end    ${
                    ctx?.user?.id === message.fromUserId
                      ? "self-end  justify-end flex-row-reverse"
                      : "self-start justify-start"
                  }`}
                >
                  {props.messages &&
                  message.fromUserId !==
                    props.messages[index + 1]?.fromUserId ? (
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
                    className={`relative flex  rounded-lg mb-3 p-1 min-h-8 gap-2   w-max max-w-[300px] sm:max-w-sm  md:max-w-md  lg:max-w-lg     ${
                      ctx?.user && ctx.user.id === message.fromUserId
                        ? "  bg-green-700 text-[#efefef] "
                        : "  bg-[#efefef] text-black"
                    }   ${
                      props.messages &&
                      message.fromUserId !==
                        props.messages[index + 1]?.fromUserId
                        ? ctx?.user && ctx.user.id === message.fromUserId
                          ? "rounded-br-none right-tri"
                          : "rounded-bl-none left-tri"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      {message.contentImageUrl && (
                        <img
                          loading="eager"
                          onClick={() => {
                            setShowFullImage(message.contentImageUrl);
                          }}
                          className="h-auto max-w-full rounded-md cursor-pointer"
                          src={message.contentImageUrl}
                          alt="image"
                        />
                      )}

                      <div className="flex px-1  justify-between gap-3">
                        <span className="text-lg  break-words whitespace-pre-line max-sm:max-w-[60dvw]  max-w-[450px]  ">
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
                            } flex w-2 h-3   relative mx-1`}
                          >
                            <div
                              className={`${
                                message.isRead
                                  ? " border-r-sky-500 border-b-sky-500"
                                  : "border-r-neutral-300 border-b-neutral-300"
                              } ${
                                message.fromUserId !== ctx?.user?.id && "hidden"
                              } absolute  w-1.5 h-3.5 border-[2.3px] border-t-transparent border-l-transparent  inline-block  rotate-[52deg] -right-[1.5px] -top-[2px] skew-x-12 `}
                            ></div>
                            <div
                              className={` ${
                                message.isRead
                                  ? " border-r-blue-400 border-b-blue-300"
                                  : "border-r-neutral-300 border-b-neutral-300"
                              }
                        ${
                          message.fromUserId !== ctx?.user?.id && "hidden"
                        } border-r-neutral-300 border-b-neutral-300 absolute  w-2 h-3 border-[2.3px] border-t-transparent border-l-transparent -top-[0px] right-1  inline-block skew-x-12  rotate-[52deg]  `}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          : Array(6)
              .fill(null)
              .map((e, i) => (
                <div key={i}>
                  <div className="flex w-full justify-end">
                    <ChatLoader reverse={true} />
                  </div>
                  <div className="flex w-full justify-start">
                    <ChatLoader />
                  </div>
                </div>
              ))}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessageHandler}
        className=" p-1 flex gap-2 items-center"
      >
        <button
          onClick={(e) => {
            setShowFileInput((prev) => !prev);
          }}
          type="button"
          className="text-xl relative"
        >
          {showFileInput && (
            <motion.div className="file-upload absolute -top-[4.5rem] z-10 bg-[#ffffff] backdrop-blur-lg text-sm w-12 h-14 cursor-default  px-1 py-2 rounded-lg ">
              <label
                onClick={(e) => {
                  e.stopPropagation();
                }}
                htmlFor="file-upload"
                className=" h-10 w-10 overflow-hidden cursor-pointer"
              >
                <HiPhoto size={40} className="  text-green-500" />
                <input
                  id="file-upload"
                  type="file"
                  size={2}
                  className="opacity-0 hidden"
                  accept="image/png, image/webp, image/*"
                  onChange={fileInputChangeHandler}
                />
              </label>
            </motion.div>
          )}
          <FiPaperclip />
        </button>
        <div className=" flex flex-1 px-2 py-1 h-full items-center  gap-2 bg-white rounded-lg  ">
          <RiChatSmile3Fill size={20} className=" text-green-500" />
          <div className="flex gap-2 w-full">
            {previewImage && (
              <div className="relative ">
                <button
                  type="button"
                  onClick={() => {
                    setFileInput(undefined);
                    setPreviewImage(null);
                  }}
                  className="absolute w-7 right-1 top-1 bg-red-500  rounded-full   aspect-square "
                >
                  X
                </button>
                <img
                  src={previewImage}
                  className="w-96 h-auto rounded-md"
                  alt="Preview"
                />
              </div>
            )}
            <input
              type="text"
              onChange={messageChangeHandler}
              value={messageInput}
              placeholder="Say Hi!"
              className="bg-transparent self-end  resize-none text-black w-full outline-none  "
            />
          </div>
          <button
            type={"submit"}
            disabled={fileInput || messageInput.length > 0 ? false : true}
            className="disabled:bg-neutral-400  bg-green-500 px-4 py-1 rounded-md text-white font-semibold text-2xl"
          >
            <HiPaperAirplane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatLog;
