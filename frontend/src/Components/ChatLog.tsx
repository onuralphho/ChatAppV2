import { RiChatSmile3Fill } from "react-icons/ri";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { FiPaperclip } from "react-icons/fi";
import { CgSmartphoneShake } from "react-icons/cg";
import { IoIosColorPalette } from "react-icons/io";
import { BiBlock } from "react-icons/bi";
import { SiScaleway } from "react-icons/si";

import { IMessage } from "../@types/messageType";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../Context/AuthProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { Fetcher } from "../utils/Fetcher";
import { useConnectionContext } from "../Context/ConnectionProvider";
import ChatLoader from "./UI/ChatLoader";
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
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [showFullImage, setShowFullImage] = useState<string | undefined>("");
  const [animationType, setAnimationType] = useState<
    "shake" | "scale" | "colorful" | undefined
  >(undefined);
  const [animationSelectorShow, setAnimationSelectorShow] =
    useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conCtx = useConnectionContext();
  const ctx = useAuth();

  const messageAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
  );
  messageAudio.volume = 0.2;

  const s3 = new AWS.S3({
    region: "eu-central-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESSKEY,
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
    let dateNow = new Date();

    setCheckerVal(true);
    setMessageInput("");
    setFileInput(undefined);
    setPreviewImage(undefined);

    const messagePayload: IMessage = {
      isDeleted: false,
      isRead: false,
      id: 0,
      sentDate: dateNow.toISOString(),
      contentText: messageInput,
      fromUserId: ctx?.user?.id,
      toUserId: props.talkingTo.id,
      friendBoxId: props.talkingTo.friendBoxId,
      fromUser: {
        name: ctx?.user?.name,
        id: ctx?.user?.id,
        picture: ctx?.user?.picture,
      },
      contentImageUrl: previewImage ?? undefined,
      animationType: animationType ?? undefined,
    };

    ctx?.setMessages((prev) => [...(prev || []), messagePayload]);
    messageAudio.play();
    ctx?.setFriendList((prev) => {
      let friend = prev?.find((f) => f.id === props.talkingTo.friendBoxId);
      if (friend) {
        friend.updateTime = dateNow.toISOString();
        friend.lastMessage = messagePayload.contentText;
        friend.lastMessageFrom = messagePayload.fromUser.name;

        return [...(prev || [])];
      }
      return prev || [];
    });

    if (fileInput) {
      const params = {
        Bucket: "chatappv2/",
        Key: fileInput.name,
        Body: fileInput,
        ACL: "public-read",
      };
      var awss3imgurl;
      const dataS3 = await s3.upload(params).promise();
      awss3imgurl = dataS3.Location;
    }

    messagePayload.contentImageUrl = awss3imgurl;

    const res = await Fetcher({
      method: "POST",
      body: messagePayload,
      url: "/api/messages/addmessage",
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();
    await conCtx?.connection?.invoke("SendMessage", data);
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
  }, [ctx?.messages, scrollToBottom, checkerVal]);
  const item = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };
  return (
    <div className=" bg-[#363636] w-full relative   flex-1  flex flex-col  h-full fade-in">
      {/* TALKINGTO */}

      <div className="flex items-center w-full gap-3 p-2 pl-12 ">
        <img
          className="object-cover w-10 h-10 rounded-full"
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
            className=" h-full w-full max-h-[80%] max-w-[900px]  object-contain"
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
                  key={index}
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
                    className={`relative flex pb-5 rounded-lg mb-3 p-1 min-h-8 gap-2 min-w-[100px]   lg:max-w-[50vw] sm:max-w-sm  md:max-w-md    ${
                      ctx?.user && ctx.user.id === message.fromUserId
                        ? "  bg-green-700 text-[#efefef] "
                        : "  bg-[#efefef] text-black"
                    }   ${
                      props.messages &&
                      message.fromUserId !==
                        props.messages[index + 1]?.fromUserId
                        ? ctx?.user && ctx.user.id === message.fromUserId
                          ? "rounded-br-none right-tri "
                          : "rounded-bl-none left-tri  "
                        : ""
                    } ${message.animationType ? message.animationType : ""} `}
                  >
                    <div className="flex flex-col">
                      {message.contentImageUrl && (
                        <img
                          loading="eager"
                          onClick={() => {
                            setShowFullImage(message?.contentImageUrl);
                          }}
                          className="h-auto max-w-[250px]  rounded-md cursor-pointer"
                          src={message.contentImageUrl}
                          alt=""
                        />
                      )}

                      <div className="flex  justify-between gap-2  px-1">
                        <span className="text-lg  break-words whitespace-pre-line max-sm:max-w-[60vw] max-w-[40vw]  ">
                          {message.contentText}
                        </span>
                        <div className="flex items-end gap-1.5 absolute right-1 bottom-0.5  h-max self-end">
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
                            } flex w-2 h-3    relative mx-1`}
                          >
                            <div
                              className={`${
                                message.isRead
                                  ? " border-r-sky-500 border-b-sky-500"
                                  : "border-r-neutral-300 border-b-neutral-300"
                              } ${
                                message.fromUserId !== ctx?.user?.id && "hidden"
                              } absolute  w-1.5 h-3.5 border-[2.3px] border-t-transparent border-l-transparent  inline-block  rotate-[52deg] -right-[1.5px] bottom-[3.5px] skew-x-12 `}
                            ></div>
                            <div
                              className={` ${
                                message.isRead
                                  ? " border-r-blue-400 border-b-blue-300"
                                  : "border-r-neutral-300 border-b-neutral-300"
                              }
                        ${
                          message.fromUserId !== ctx?.user?.id && "hidden"
                        } border-r-neutral-300 border-b-neutral-300 absolute  w-2 h-3 border-[2.3px] border-t-transparent border-l-transparent  right-1 bottom-1  inline-block skew-x-12  rotate-[52deg]  `}
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
                  <div className="flex justify-end w-full">
                    <ChatLoader reverse={true} />
                  </div>
                  <div className="flex justify-start w-full">
                    <ChatLoader />
                  </div>
                </div>
              ))}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessageHandler}
        className="flex items-center gap-1 p-1 "
      >
        <button
          onClick={(e) => {
            setShowFileInput((prev) => !prev);
          }}
          type="button"
          className="relative text-xl  p-2 hover:bg-[#616161] rounded-lg"
        >
          <FiPaperclip size={25} />

          {showFileInput && (
            <motion.div
              variants={item}
              initial="hidden"
              animate="visible"
              className="file-upload absolute  -top-[4.5rem] z-10 bg-[#ffffff] backdrop-blur-lg text-sm w-12 h-14 cursor-default  px-1 py-2 rounded-lg "
            >
              <label
                onClick={(e) => {
                  e.stopPropagation();
                }}
                htmlFor="file-upload"
                className="w-10 h-10 overflow-hidden cursor-pointer "
              >
                <HiPhoto size={40} className="text-green-500 " />
                <input
                  id="file-upload"
                  type="file"
                  size={2}
                  className="hidden opacity-0"
                  accept="image/png, image/webp, image/*"
                  onChange={fileInputChangeHandler}
                />
              </label>
            </motion.div>
          )}
        </button>
        <div className="flex relative items-center flex-1 h-full gap-2 px-2 py-1 bg-white rounded-lg ">
          <div
            className="relative w-auto"
            onMouseEnter={() => {
              setAnimationSelectorShow(true);
            }}
          >
            <div
              onMouseLeave={() => {
                setAnimationSelectorShow(false);
              }}
              className={`${
                animationSelectorShow ? "opacity-100" : "opacity-0 hidden"
              } absolute gap-2 -top-16 left-1 p-1  flex justify-center bg-white rounded-md`}
            >
              <div>
                <input
                  type="radio"
                  name="animationselector"
                  id="none"
                  className="hidden peer"
                  onChange={() => {
                    setAnimationType(undefined);
                  }}
                />
                <label
                  htmlFor="none"
                  className="flex p-1 items-center  text-red-500 cursor-pointer rounded-md border-2 peer-checked:border-sky-500 "
                >
                  <BiBlock size={30} className="" />
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  name="animationselector"
                  id="scale"
                  className="hidden peer"
                  onChange={() => {
                    setAnimationType("scale");
                  }}
                />
                <label
                  htmlFor="scale"
                  className="flex p-1 text-purple-600 cursor-pointer rounded-md border-2 peer-checked:border-sky-500  "
                >
                  <SiScaleway size={30} />
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  name="animationselector"
                  id="shake"
                  className="hidden peer"
                  onChange={() => {
                    setAnimationType("shake");
                  }}
                />
                <label
                  htmlFor="shake"
                  className="flex p-1 text-green-500 cursor-pointer rounded-md border-2 peer-checked:border-sky-500   "
                >
                  <CgSmartphoneShake size={30} />
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  name="animationselector"
                  id="colorful"
                  className="hidden peer"
                  onChange={() => {
                    setAnimationType("colorful");
                  }}
                />
                <label
                  htmlFor="colorful"
                  className="flex p-1 text-orange-500 cursor-pointer rounded-md border-2 peer-checked:border-sky-500  "
                >
                  <IoIosColorPalette size={30} />
                </label>
              </div>
            </div>

            <RiChatSmile3Fill size={20} className="text-green-500 " />
          </div>
          <div className="flex w-full gap-2">
            {previewImage && (
              <div className="absolute bottom-10 bg-white p-2 rounded-t-lg left-2">
                <button
                  type="button"
                  onClick={() => {
                    setFileInput(undefined);
                    setPreviewImage(undefined);
                  }}
                  className="absolute bg-red-500 rounded-full w-7 right-1 top-1 aspect-square "
                >
                  X
                </button>
                <img
                  src={previewImage}
                  className="h-auto rounded-md w-56 "
                  alt="Preview"
                />
              </div>
            )}
            <input
              type="text"
              onChange={messageChangeHandler}
              value={messageInput}
              placeholder="Say Hi!"
              className="self-end w-full text-black bg-transparent outline-none resize-none "
            />
          </div>
          <button
            type={"submit"}
            disabled={fileInput || messageInput.length > 0 ? false : true}
            className="px-4 py-1 text-2xl font-semibold text-white bg-green-500 rounded-md disabled:bg-neutral-400"
          >
            <HiPaperAirplane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatLog;
