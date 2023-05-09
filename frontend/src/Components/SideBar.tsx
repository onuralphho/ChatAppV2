import { AiFillCaretRight, AiFillPlusCircle, AiFillHome } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import { MdTouchApp } from "react-icons/md";
import { useState } from "react";
import FriendsList from "../Components/FriendsList";
import { useAuth } from "../Context/AuthProvider";
import Modal from "./UI/Modal";
import { useNavigate } from "react-router-dom";
import AlertBox from "./UI/AlertBox";
import { Fetcher } from "../utils/Fetcher";
import { useAlertContext } from "../Context/AlertProvider";
import { sleep } from "../utils/sleep";
import { useConnectionContext } from "../Context/ConnectionProvider";
import { useTranslation } from "react-i18next";
import ModalBackground from "./UI/ModalBackground";
import { motion } from "framer-motion";
import { scaleEffect } from "../Constants/FramerMotionEffects/scaleEffect";

interface ISideBarProps {
  openProfile: Function;
  closeProfile: Function;
  openWelcome: Function;
  closeWelcome: Function;
}

interface ISearchResult {
  id: number;
  name: string;
  picture: string;
}

const SideBar = (props: ISideBarProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [showMenu, setShowMenu] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [feelingInput, setFeelingInput] = useState<string>("");

  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const conCtx = useConnectionContext();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const logOut = () => {
    ctx?.setTalkingTo(undefined);
    conCtx?.disconnectConnection();
    navigate("/");
    ctx?.logout();
  };

  const openSideBar = () => {
    setShowMenu(true);
  };
  const closeSideBar = () => {
    setShowMenu(false);
  };

  const submitFeelingFormHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const res = await Fetcher({
      method: "PUT",
      url: "/api/users/updatefeeling",
      body: { feeling: feelingInput },
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();

    if (ctx && ctx.user) {
      const updatedUser = { ...ctx.user, feeling: data.feeling };
      ctx.setUser(updatedUser);
    }
    setFeelingInput("");
  };

  const searchHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (searchInput.length - 1 === 0) {
      setSearchResult([]);
    }
    if (searchInput.length + 1 < 3) {
      return;
    }

    const res = await Fetcher({
      body: { searchValue: e.target.value.toLowerCase() },
      method: "POST",
      url: "/api/users/search",
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();
    setSearchResult(data);
  };

  const addFriendHandler = async (friendId: number) => {
    const res = await Fetcher({
      body: { fromId: ctx?.user?.id, toId: friendId },
      method: "POST",
      url: "/api/FriendBoxes/addfriend",
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();

    if (data.friend) {
      conCtx?.connection?.send("FriendRequest", data.friend);
      setSearchResult([]);
      setSearchInput("");

      alertCtx?.setAlert({ shown: true, type: t(data.message) });

      ctx?.setFriendList((prev) => [...(prev ?? []), data.friend]);

      await sleep(2000);
      alertCtx?.setAlert({ shown: false, type: t(data.message) });
    }
    if (data.status === 400) {
      alertCtx?.setAlert({ shown: true, type: t(data.title) });
      await sleep(2000);
      alertCtx?.setAlert({ shown: false, type: t(data.title) });
    }
  };

  return (
    <>
      <AlertBox
        message={alertCtx?.alert.type}
        isShown={alertCtx?.alert.shown}
        closeBox={alertCtx?.setAlert}
      />
      {/* //! Modal */}
      {isModalOpen && (
        <Modal confirm={logOut} cancel={closeModal} title={t("logout")} />
      )}

      {/*//!  Flag */}
      <div
        onClick={() => {
          setShowMenu((prev) => !prev);
        }}
        className={`cursor-pointer  transition-all top-1  z-[2]  w-10 h-12 rounded-r-lg flex items-center justify-center bg-green-500 absolute ${
          showMenu ? "lg:translate-x-80" : "lg:translate-x-[4.5rem]"
        }   ${showMenu ? "max-lg:translate-x-64" : "max-lg:translate-x-0"} `}
      >
        <AiFillCaretRight
          size={30}
          className={`transition-all ${showMenu ? "rotate-180" : ""}`}
        />
      </div>
      {/* //! Flag */}

      {/* //! Mobile menu blur */}
      {showMenu && (
        <div
          onClick={() => {
            setShowMenu(false);
          }}
          className="z-[1] w-full h-full absolute left-0 top-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <div
        className={` p-2 bg-[#252525] max-lg:z-20 transition-all relative overflow-hidden  w-64  gap-2 flex flex-col max-lg:absolute max-lg:bottom-0 max-lg:top-0 ${
          showMenu ? "lg:w-80" : "lg:w-[4.5rem]"
        }   ${showMenu ? "max-lg:translate-0" : "max-lg:-translate-x-64"} `}
      >
        <div className="flex px-2   flex-col  gap-2 ">
          <div className="flex  h-full gap-2 items-center ">
            <img
              onClick={() => {
                setShowMenu(true);
              }}
              src={ctx?.user?.picture}
              className=" w-10 aspect-square shadow-md shadow-black rounded-full object-cover"
              alt=""
            />
            {showMenu && (
              <form
                onSubmit={submitFeelingFormHandler}
                className={`whitespace-nowrap relative flex-1 flex justify-center lg:items-center gap-1 mx-2 ${
                  showMenu ? "opacity-100" : "opacity-0"
                }`}
              >
                <MdTouchApp
                  size={30}
                  className={`finger absolute -bottom-5 ${
                    feelingInput.length > 0 ? "hidden" : ""
                  } ${ctx?.user?.feeling ? "hidden" : ""}`}
                />
                <div
                  className={`circle_wave absolute w-5 bg-[#efefef24] rounded-full aspect-square -bottom-2 ${
                    feelingInput.length > 0 ? "hidden" : ""
                  } ${ctx?.user?.feeling ? "hidden" : ""}`}
                ></div>

                <div className="flex gap-1">
                  <span>"</span>
                  <input
                    placeholder={
                      ctx?.user?.feeling
                        ? ctx.user.feeling
                        : t("feelings").toString()
                    }
                    type="text"
                    value={feelingInput}
                    onChange={(e) => {
                      setFeelingInput(e.target.value);
                    }}
                    className="bg-transparent placeholder:italic placeholder:text-xs px-0.5 w-full border border-[#efefef00]"
                  />
                  <span>"</span>
                </div>
                {feelingInput.length > 0 && (
                  <motion.button
                    type="submit"
                    variants={scaleEffect}
                    initial="hidden"
                    animate="visible"
                    className="text-xs bg-green-500 px-1 py-1 rounded-md "
                  >
                    {t("submit")}
                  </motion.button>
                )}
              </form>
            )}
          </div>
          <div
            className={`flex flex-wrap ${
              showMenu ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-sm ">
              {ctx?.user &&
                ctx?.user.name.charAt(0).toUpperCase() +
                  ctx?.user.name.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* //! Search Bar */}
        {showMenu && searchResult.length > 0 && (
          <ModalBackground
            darkness={0.3}
            onClose={() => {
              setSearchResult([]);
              setSearchInput("");
            }}
          />
        )}
        <label
          onClick={() => {
            setShowMenu(true);
          }}
          htmlFor="search"
          className={`relative border py-1 mx-1 h-10 ${
            showMenu ? "lg:pl-8 " : "lg:pl-6  aspect-square"
          }px-10 border-green-400 text-green-500 text-xl focus-within:border-purple-500 cursor-pointer z-40  rounded-full`}
        >
          <div className="absolute left-2.5 top-2.5 w-5">
            <BiSearchAlt size={20} className="w-full h-full" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchInput("");
              setSearchResult([]);
            }}
            className={`${showMenu ? "" : "hidden"} ${
              searchInput.length < 3 && "hidden"
            } absolute right-2 top-2 text-red-600 `}
          >
            <IoCloseCircleOutline size={25} />
          </button>
          <input
            id="search"
            onChange={searchHandler}
            value={showMenu ? searchInput : ""}
            className="bg-transparent outline-none w-full"
            type="text"
          />
          {showMenu && (
            <div
              className={`${
                searchResult.length > 0 ? "p-1" : ""
              } bg-purple-600 z-30  transition-all flex flex-col  overflow-hidden absolute left-0 top-11 w-full rounded-md  `}
            >
              <div className="rounded-md overflow-hidden">
                {searchResult.map((item: ISearchResult) =>
                  item.id !== ctx?.user?.id ? (
                    <div
                      key={item.id}
                      className=" hover:bg-[#363636] cursor-default   select-none p-2 flex  justify-between items-center gap-2 bg-[#252525]"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.picture}
                          alt=""
                          className="h-10 rounded-full"
                        />
                        <span className="text-white truncate">{item.name}</span>
                      </div>
                      <AiFillPlusCircle
                        onClick={() => {
                          addFriendHandler(item.id);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </label>
        {/*//! FRIEND LIST */}
        <FriendsList
          showMenu={showMenu}
          openMenu={openSideBar}
          closeMenu={closeSideBar}
          closeWelcome={props.closeWelcome}
          closeProfile={props.closeProfile}
        />
        {/*//! Bottom menu */}
        <div className="h-12 flex bottom-0 py-2 left-0 right-0">
          {showMenu ? (
            <ul className="flex w-full justify-around items-center">
              <li
                onClick={() => {
                  props.openProfile();
                  ctx?.setTalkingTo(undefined);
                  ctx?.setMessages(undefined);
                }}
                className="cursor-pointer hover:bg-neutral-700 p-2 rounded-md"
              >
                <IoSettingsSharp size={22} className="" />
              </li>
              <li
                onClick={() => {
                  props.openWelcome();
                  ctx?.setTalkingTo(undefined);
                  ctx?.setMessages(undefined);
                }}
                className="cursor-pointer hover:bg-neutral-700 p-2 rounded-md"
              >
                <AiFillHome size={22} />
              </li>
              <li
                onClick={() => {
                  openModal();
                }}
                className="cursor-pointer hover:bg-neutral-700 p-2 rounded-md"
              >
                <IoLogOutOutline size={22} className="text-red-500 " />
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
