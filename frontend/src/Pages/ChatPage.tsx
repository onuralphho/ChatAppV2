import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import Welcome from "../Components/Welcome";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const ctx = useAuth();
  const navigate = useNavigate();

  const [hubConnection, setHubConnection] = useState<HubConnection>();

  const connectHub = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_ENDPOINT_URL}/chatHub`)
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("RecieveMessage", (message) => {
      console.log(message);
    });

    await connection.start();
    await connection.invoke("JoinRoom", { UserId: ctx?.user?.id.toString() });

    setHubConnection(connection);
  };



  useEffect(() => {
    
    if (ctx?.user && !hubConnection) {
      connectHub();
    }
  }, [ctx?.user, hubConnection, connectHub]);

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
