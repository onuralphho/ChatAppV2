import FriendsList from "../Components/FriendsList";
import { AiFillCaretRight } from "react-icons/ai";
import { useState } from "react";
const SideBar = (props: any) => {
  const [showChat, setShowChat] = useState(true);
  return (
    <>
      {/* Flag */}
      <div
        onClick={() => {
          setShowChat(!showChat);
        }}
        className={`cursor-pointer transition-all bottom-14 z-[2]  w-10 h-14 rounded-r-lg flex items-center justify-center bg-green-500 absolute  lg:hidden ${
          showChat ? "max-lg:translate-x-64" : "max-lg:translate-x-0"
        } `}
      >
        <AiFillCaretRight
          size={30}
          className={`transition-all ${showChat ? "rotate-180" : ""}`}
        />
      </div>
      {showChat && (
        <div
          onClick={() => {
            setShowChat(false);
          }}
          className="w-[100dvw] z-[1] h-[100dvh] absolute left-0 top-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm lg:hidden"
        ></div>
      )}
      {/* Flag */}
      <div
        className={`p-2  bg-[#252525] z-[2] transition-all  w-64 lg:w-2/12 gap-6 flex flex-col  ${
          showChat ? "max-lg:translate-x-0" : "max-lg:-translate-x-64"
        } max-lg:absolute max-lg:bottom-0 max-lg:top-0 `}
      >
        <div className="flex flex-wrap items-center gap-2">
          <img src={props.user.picture} className="w-10 rounded-full" alt="" />

          <span>Welcome, {props.user.name}</span>

          <button
            onClick={() => {
              props.openModal(true);
            }}
            className=" border px-2 rounded-md border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
        <label htmlFor="search" className="relative border py-2 pl-12 border-green-400 text-green-500 text-xl focus-within:border-purple-500  pr-4 rounded-full">
          <div>
            <div className="absolute left-3 top-2 w-5 h-5 border-2 border-green-500 rounded-full "></div>
            <div className="absolute w-3 h-[2px] rounded-full left-7 top-7 rotate-45 bg-green-500"></div>
          </div>
          <input
            id="search"
            className="bg-transparent outline-none w-full"
            type="text"
          />
        </label>

        <FriendsList />
      </div>
    </>
  );
};

export default SideBar;
