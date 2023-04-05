import FriendsList from "../Components/FriendsList";
import { AiFillCaretRight } from "react-icons/ai";
import { useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

interface ISideBarProps {
  openProfile: Function;
}

const SideBar = (props: ISideBarProps) => {
  const [showMenu, setShowMenu] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ctx = useAuth();
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const logOut = () => {
    navigate("/");
    ctx?.logout();
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <Modal confirm={logOut} cancel={closeModal} title={"Logout?"} />
      )}

      {/* Flag */}
      <div
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className={`cursor-pointer transition-all bottom-14 z-[2]  w-10 h-14 rounded-r-lg flex items-center justify-center bg-green-500 absolute ${
          showMenu ? "lg:translate-x-64" : "lg:translate-x-[4.5rem]"
        }   ${showMenu ? "max-lg:translate-x-64" : "max-lg:translate-x-0"} `}
      >
        <AiFillCaretRight
          size={30}
          className={`transition-all ${showMenu ? "rotate-180" : ""}`}
        />
      </div>
      {showMenu && (
        <div
          onClick={() => {
            setShowMenu(false);
          }}
          className="w-[100dvw] z-[1] h-[100dvh] absolute left-0 top-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm lg:hidden"
        ></div>
      )}
      {/* Flag */}

      <div
        className={` p-2  bg-[#252525] z-[2] transition-all relative overflow-hidden  w-64  ${
          !!showMenu ? "lg:w-64" : "lg:w-[4.5rem]"
        }  gap-6 flex flex-col  ${
          showMenu ? "max-lg:translate-0" : "max-lg:-translate-x-64"
        } max-lg:absolute max-lg:bottom-0 max-lg:top-0 `}
      >
        <div className="flex px-2  items-center gap-2 justify">
          <img
            onClick={() => {
              setShowMenu(true);
            }}
            src={ctx?.user.picture}
            className="w-10 aspect-square shadow shadow-green-500 rounded-full object-cover"
            alt=""
          />
          <div className={`flex gap-2 flex-wrap ${showMenu ? "" : "hidden"}`}>
            <span>
              {ctx?.user.name.charAt(0).toUpperCase() +
                ctx?.user.name.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <label
          onClick={() => {
            setShowMenu(true);
          }}
          htmlFor="search"
          className={`relative border py-1 ml-2 ${
            showMenu ? "lg:pl-8 " : "lg:pl-6 mr-2 aspect-square"
          }pl-9 border-green-400 text-green-500 text-xl focus-within:border-purple-500  pr-4 rounded-full`}
        >
          <div className="absolute left-2 top-2 ">
            <BiSearchAlt className="w-full h-full" />
          </div>
          <input
            id="search"
            className="bg-transparent outline-none w-full"
            type="text"
          />
        </label>

        <FriendsList showMenu={showMenu} />
        {/* Settings */}
        <div className="bg-green-500 h-[2.95rem] flex absolute bottom-0 py-2 left-0 right-0">
         
            {showMenu ? (
              <ul className="flex w-full justify-around items-center">
                <li onClick={() => {
                  props.openProfile()
                }} className="cursor-pointer        ">
                  <IoSettingsSharp size={25} className="" />
                </li>

                <li
                  onClick={() => {
                    openModal();
                  }}
                  className="cursor-pointer"
                >
                  <IoLogOutOutline size={30} className="text-red-500 " />
                </li>
              </ul>
            ) : (
            
              <button
                onClick={() => {
                  setShowMenu(true);
                }}
                className="w-full flex justify-center items-center"
              >
                <IoSettingsSharp size={25} className="" />
              </button>
            )}
         
        </div>
      </div>
    </>
  );
};

export default SideBar;
