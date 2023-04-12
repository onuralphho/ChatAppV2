import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import Welcome from "../Components/Welcome";
import AlertBox from "../Components/AlertBox";
import { useAlertContext } from "../Context/AlertProvider";
import { sleep } from "../utils/sleep";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const alertCtx = useAlertContext();
  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const joinRoom = async () => {
      if (!ctx?.talkingTo?.friendBoxId) return;
      if (ctx?.talkingTo?.friendBoxId) {
        ctx?.connection?.on("RecieveMessage", (message) => {
          if (ctx.talkingTo?.friendBoxId === message.friendBoxId) {
            console.log("Recieve message Listening...", message);
            ctx?.setMessages((prev) => [...(prev || []), message]);
          }
        });
      }

      console.log("JoinRoom isteği atıldı. Payload", ctx?.user?.id.toString());
      await ctx?.connection?.invoke("JoinRoom", {
        UserId: ctx.user?.id.toString(),
      });
    };
    joinRoom();

    return () => {
      ctx?.connection?.off("RecieveMessage");
    };
  }, [ctx?.talkingTo?.friendBoxId, ctx?.connection]);

  useEffect(() => {
    const loginHub = async () => {
      ctx?.connection?.on("RecieveMessage", async (message) => {
        console.log("AAAAAAAA", message);

        let a = ctx.friendList?.find((f) => f.id === message.friendBoxId ); //BURDA KALDIN İsmi yazdırmaya çalışıyosun

        alertCtx?.setAlert({
          shown: true,
          type:
            "New message from " + a?.fromUser
        });
        await sleep(1500);
        alertCtx?.setAlert({
          shown: false,
          type:
            "New message from " +
            ctx.friendList?.find((f) => {
              if (f.id === message.friendBoxId) {
                return f.fromUser.name;
              } else return;
            }),
        });
        console.log(ctx.friendList);
      });

      if (ctx?.user?.id) {
        console.log(
          "JoinRoom isteği atıldı. Payload",
          ctx?.user?.id.toString()
        );
        await ctx?.connection?.invoke("JoinRoom", {
          UserId: ctx.user?.id.toString(),
        });
      }
    };

    loginHub();
  }, [ctx?.connection]);

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
        <AlertBox
          message={alertCtx?.alert.type}
          isShown={alertCtx?.alert.shown}
          closeBox={alertCtx?.setAlert}
        />
        {/* TopBar Temp
        <div className="bg-green-500 p-2 max-lg:hidden">
          <ul className="flex justify-between px-4">
            <li className="text-2xl text-white font-bold">Logo</li>
          </ul>
        </div> */}

        <div className="flex   lg:p-5 lg:px-10   xl:px-20  2xl:px-40   text-white h-full ">
          <div className="flex w-full max-w-[1920px] mx-auto lg:rounded-xl  overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]">
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
