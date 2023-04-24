import { AiFillCaretRight, AiFillPlusCircle, AiFillHome } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState } from "react";
import FriendsList from "../Components/FriendsList";
import { useAuth } from "../Context/AuthProvider";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import AlertBox from "./AlertBox";
import { Fetcher } from "../utils/Fetcher";
import { useAlertContext } from "../Context/AlertProvider";
import { sleep } from "../utils/sleep";
import { useConnectionContext } from "../Context/ConnectionProvider";

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

  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const conCtx = useConnectionContext();

  const navigate = useNavigate();

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
    setSearchResult(res);
  };

  const addFriendHandler = async (friendId: number) => {
    const res = await Fetcher({
      body: { fromId: ctx?.user?.id, toId: friendId },
      method: "POST",
      url: "/api/FriendBoxes/addfriend",
      token: ctx?.getCookie("jwt"),
    });

    if (res.addedfriend) {
      conCtx?.connection?.send("FriendRequest", res.addedfriend);
    }

    setSearchResult([]);
    setSearchInput("");

    alertCtx?.setAlert({ shown: true, type: res.message });
    if (res.addedfriend) {
      ctx?.setFriendList((prev) => [...(prev ?? []), res.addedfriend]);
    }
    await sleep(2000);
    alertCtx?.setAlert({ shown: false, type: res.message });
  };

  return (
    <>
      {searchResult.length > 0 && (
        <div
          onClick={() => {
            setSearchResult([]);
            setSearchInput("");
          }}
          className="absolute w-[100vw] h-[100vh] max-lg:hidden bg-black z-30 opacity-30 cursor-pointer"
        ></div>
      )}
      <AlertBox
        message={alertCtx?.alert.type}
        isShown={alertCtx?.alert.shown}
        closeBox={alertCtx?.setAlert}
      />
      {/* Modal */}
      {isModalOpen && (
        <Modal confirm={logOut} cancel={closeModal} title={"Logout?"} />
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

      {showMenu && (
        <div
          onClick={() => {
            setShowMenu(false);
          }}
          className="z-[1] w-[100dvw]  h-[100dvh] h-[100vh] w-[100vw] absolute left-0 top-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <div
        className={` p-2  bg-[#252525] max-lg:z-20 transition-all relative overflow-hidden  w-64  ${
          !!showMenu ? "lg:w-80" : "lg:w-[4.5rem]"
        }  gap-6 flex flex-col  ${
          showMenu ? "max-lg:translate-0" : "max-lg:-translate-x-64"
        } max-lg:absolute max-lg:bottom-0 max-lg:top-0 `}
      >
        <div className="flex px-2  items-center gap-2 justify">
          <img
            onClick={() => {
              setShowMenu(true);
            }}
            src={ctx?.user?.picture}
            className="w-10 aspect-square shadow-md shadow-black rounded-full object-cover"
            alt=""
          />
          <div className={`flex gap-2 flex-wrap ${showMenu ? "" : "hidden"}`}>
            <span>
              {ctx?.user &&
                ctx?.user.name.charAt(0).toUpperCase() +
                  ctx?.user.name.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* //! Search Bar */}

        <label
          onClick={() => {
            setShowMenu(true);
          }}
          htmlFor="search"
          className={`relative border py-1 mx-1 h-10 ${
            showMenu ? "lg:pl-8 " : "lg:pl-6  aspect-square"
          }px-10 border-green-400 text-green-500 text-xl focus-within:border-purple-500 cursor-pointer  rounded-full`}
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
            value={searchInput}
            className="bg-transparent outline-none w-full"
            type="text"
          />
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
                      <span className="text-white">{item.name}</span>
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
        </label>
        {/* FRIEND LIST */}
        <FriendsList
          showMenu={showMenu}
          openMenu={openSideBar}
          closeWelcome={props.closeWelcome}
          closeProfile={props.closeProfile}
        />
        {/* Bottom menu */}
        <div className="h-12 flex absolute bottom-0 py-2 left-0 right-0">
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
