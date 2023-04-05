import { useEffect, useState } from "react";

import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import { Link } from "react-router-dom";
const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);

  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    const getUser = async () => {
      const jwt = ctx?.getCookie("jwt")

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

        <div className="flex bg-[#363636] text-white h-[100dvh] ">
          {/* SideBar */}
          <SideBar openProfile={openProfile} />

          {showProfile ? (
            <ProfileSettings closeProfile={closeProfile} />
          ) : (
            <ChatLog />
          )}

          {/* ChatLog */}
        </div>
      </>
    );
  } else {
    return (
      <div>
        <div className=" h-[100dvh] bg-[#252525] text-white flex justify-center items-center w-full gap-4">
          <h2 className="text-5xl">Please </h2>
          <Link
            to={"/"}
            className="text-3xl border py-2 px-8  border-green-500 text-green-500 text-center rounded-md hover:bg-green-500 hover:text-white transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }
};

export default ChatPage;
