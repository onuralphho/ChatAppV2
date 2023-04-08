import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);

  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const jwt = ctx?.getCookie("jwt");

      if (!jwt) {
        navigate("/");
        return;
      }

      const data = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/authentication/session",
        token: jwt,
      });

      if (data?.status !== 401) {
        ctx?.setUser(data);
      }

      const data2 = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/friendboxes/friends",
        token: jwt,
      });

      ctx?.setFriendList(data2);
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

        <div className="flex lg:p-10 bg-purple-900  text-white h-full ">
          <div className="flex w-full rounded-sm overflow-hidden">
            {/* SideBar */}
            <SideBar openProfile={openProfile} closeProfile={closeProfile} />
            {/* ChatLog */}
            {showProfile ? (
              <ProfileSettings closeProfile={closeProfile} />
            ) : (
              ctx.talkingTo &&
              ctx.talkingTo.isApproved && (
                <ChatLog talkingTo={ctx.talkingTo} messages={ctx.messages} />
              )
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <div className=" h-[100dvh] bg-[#252525] text-white flex justify-center items-center w-full gap-4">
          <h2 className="">
            <span className="dots  gap-5">
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
            </span>{" "}
          </h2>
        </div>
      </div>
    );
  }
};

export default ChatPage;
