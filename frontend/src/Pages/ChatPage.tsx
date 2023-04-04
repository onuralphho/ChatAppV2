import { useEffect, useState } from "react";
import Modal from "../Components/Modal";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
const ChatPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function getCookie(name: string): string | undefined {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }
    }
    const getUser = async () => {
      const jwt = getCookie("jwt");

      // if (!jwt) {
      //   navigate("/");
      //   return;
      // }
      const data = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/authentication/session",
        token: jwt,
      });

      if (data?.status !== 401) {
        localStorage.setItem("session", JSON.stringify(data)); //optional
        ctx?.setUser(data);
      }
    };

    getUser();
  }, []);

  const logOut = () => {
    ctx?.logout();
    navigate("/");
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  if (ctx?.user) {
    return (
      <>
        {/* Modal */}
        {isModalOpen && (
          <Modal confirm={logOut} cancel={closeModal} title={"Logout?"} />
        )}

        {/* TopBar Temp
        <div className="bg-green-500 p-2 max-lg:hidden">
          <ul className="flex justify-between px-4">
            <li className="text-2xl text-white font-bold">Logo</li>
          </ul>
        </div> */}

        <div className="flex text-white h-[100dvh] ">
          {/* SideBar */}
          <SideBar user={ctx.user} openModal={openModal} />

          {/* ChatLog */}
          <ChatLog />
        </div>
      </>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default ChatPage;
