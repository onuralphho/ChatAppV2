import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import Welcome from "../Components/Welcome";

import { IMessage } from "../@types/messageType";
import { useConnectionContext } from "../Context/ConnectionProvider";
import { sleep } from "../utils/sleep";
import { ITalkingTo } from "../@types/talkingTo";

type Notification = {
  shown: boolean;
  talkingTo?: ITalkingTo;
  message?: IMessage;
};

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );

  const conCtx = useConnectionContext();
  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loginHub = async () => {
      const receiveMessage = async (message: any) => {
        console.log("RecieveMessage Listening...", message);
        ctx?.setMessages((prev) => [...(prev || []), message]);
      };

      conCtx?.connection?.on("RecieveMessage", receiveMessage);

      if (ctx?.user?.id) {
        console.log(
          "JoinRoom isteği atıldı. Payload",
          ctx?.user?.id.toString()
        );
        await conCtx?.connection?.invoke("JoinRoom", {
          UserId: ctx.user?.id.toString(),
        });
      }
    };

    loginHub();
  }, [ctx?.user]);

  useEffect(() => {
    const receiveMessage = async (message: IMessage) => {
      console.log("Comparing:", ctx?.talkingTo?.id, message.fromUserId);
      console.log(ctx?.talkingTo?.id !== message.fromUserId);

      if (
        (ctx?.talkingTo && ctx.talkingTo.id !== message.fromUserId) ||
        !ctx?.talkingTo
      ) {
        setNotification({
          shown: true,
          message: message,
          talkingTo: ctx?.talkingTo,
        });
        await sleep(1500);
        setNotification({
          shown: false,
          message: message,
          talkingTo: ctx?.talkingTo,
        });
      }
    };

    conCtx?.connection?.on("RecieveMessage", receiveMessage);

    return () => {
      conCtx?.connection?.off("RecieveMessage", receiveMessage);
    };
  }, [ctx?.talkingTo, conCtx?.connection]);

  useEffect(() => {
    const getUser = async () => {
      const jwt = ctx?.getCookie("jwt");

      if (!jwt) {
        navigate("/");
        return;
      }

      const sessionData = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/authentication/session",
        token: jwt,
      });

      if (sessionData?.status !== 401) {
        ctx?.setUser(sessionData);
      }

      const friendsData = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/friendboxes/friends",
        token: jwt,
      });

      ctx?.setFriendList(friendsData);
    };

    getUser();
  }, []);

  const closeProfile = () => {
    setShowProfile(false);
  };
  const openProfile = () => {
    setShowProfile(true);
  };

  if (ctx?.user) {
    return (
      <>
        {/* TopBar Temp
        <div className="bg-green-500 p-2 max-lg:hidden">
          <ul className="flex justify-between px-4">
            <li className="text-2xl text-white font-bold">Logo</li>
          </ul>
        </div> */}

        <div className="flex   lg:p-5 lg:px-10   xl:px-20  2xl:px-40   text-white h-full ">
          <div className="flex w-full relative max-w-[1920px] mx-auto lg:rounded-xl  overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]">
            {/* Notification */}
            <div
              className={`${
                notification?.shown ? "translate-y-0" : "-translate-y-20"
              } flex ease-out duration-500 items-center gap-3 absolute px-4 py-1 w-max   top-2 bg-[#efefef] border-purple-500 border-[2px] shadow-md rounded-lg text-black z-40 m-auto left-0 right-0 `}
            >
              <img
                src={notification?.message?.fromUser.picture}
                alt=""
                className="w-10 aspect-square object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">
                  {notification?.message?.fromUser.name}
                </span>
                <span className="truncate w-52">
                  {notification?.message?.contentText}
                </span>
              </div>
            </div>

            {/* SideBar */}
            <SideBar openProfile={openProfile} closeProfile={closeProfile} />
            {/* ChatLog */}
            {showProfile ? (
              <ProfileSettings closeProfile={closeProfile} />
            ) : ctx.talkingTo && ctx.talkingTo.isApproved ? (
              <ChatLog talkingTo={ctx.talkingTo} messages={ctx.messages} />
            ) : (
              showWelcome && <Welcome />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="flex lg:p-5 lg:px-10  xl:px-20  2xl:px-40   text-white h-full ">
        <div
          className={`flex  w-full max-w-[1920px] mx-auto lg:rounded-xl overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]`}
        >
          <div
            className={` p-2  bg-[#252525]  overflow-hidden relative  w-64 `}
          >
            <ul className="flex flex-col gap-1 ">
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
            </ul>
            <div className="bg-green-500 h-12 flex absolute bottom-0 py-2 left-0 right-0"></div>
          </div>

          <div className="bg-[#363636] flex-1 flex items-center  justify-center h-full">
            <span className="dots  gap-5">
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatPage;
