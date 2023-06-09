import { useAuth } from "../Context/AuthProvider";
import { IFriendList } from "../@types/friendBoxType";
import { BsFillPersonCheckFill, BsFillPersonXFill } from "react-icons/bs";
import { Fetcher } from "../utils/Fetcher";
import { useAlertContext } from "../Context/AlertProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { useConnectionContext } from "../Context/ConnectionProvider";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Iprofile } from "../@types/Iprofile";
import FriendProfile from "./FriendProfile";
import ModalBackground from "./UI/GeneralUI/ModalBackground";
import FriendSettingsDropdown from "./FriendSettingsDropdown";

interface Iprops {
  showMenu: boolean;
  openMenu: Function;
  closeMenu: Function;
  closeProfile: Function;
  closeWelcome: Function;
}

const FriendList = (props: Iprops) => {
  const [showFriendSettings, setShowFriendSettings] = useState<boolean>(false);
  const [friendProfileData, setFriendProfileData] = useState<
    Iprofile | undefined
  >(undefined);

  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const conCtx = useConnectionContext();

  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const approveFriendRequestHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.stopPropagation();

    const res = await Fetcher({
      method: "PUT",
      url: "/api/friendboxes/approve/" + id,
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();

    conCtx?.connection?.send("ApproveFriend", data);

    ctx?.setFriendList((prev) => {
      if (!prev) return prev;

      return prev.map((friendBox) => {
        if (friendBox.id === id) {
          return { ...friendBox, approved: true };
        }
        return friendBox;
      });
    });
  };

  const RejectFriendRequestHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.stopPropagation();
    const res = await Fetcher({
      method: "DELETE",
      url: "/api/friendboxes/delete/" + id,
      token: ctx?.getCookie("jwt"),
    });
    const data = await res.json();

    ctx?.setFriendList((prev) => {
      if (!prev) return prev;

      return prev.filter((friendBox) => {
        return friendBox.id !== data.friendBoxId;
      });
    });
  };

  const loadChatLogHandler = async (talkingTo: ITalkingTo) => {
    //TODO: açık olan chate tekrar açma isteği gönderilmesi engellenecek

    if (talkingTo.id !== ctx?.talkingTo?.id) {
      ctx?.setMessages(undefined);
    }

    if (talkingTo.isApproved) {
      props.closeProfile();
      ctx?.setTalkingTo(talkingTo);

      const res = await Fetcher({
        method: "GET",
        url: "/api/messages/" + talkingTo.friendBoxId,
        token: ctx?.getCookie("jwt"),
      });
      const data = await res.json();

      ctx?.setMessages(data);

      // * Unread Mesaj sıfırlama

      await Fetcher({
        method: "GET",
        url: "/api/messages/read/" + talkingTo.friendBoxId,
        token: ctx?.getCookie("jwt"),
      });

      ctx?.setFriendList((prev) => {
        const updatedFriendList = prev?.map((friendship) => {
          if (friendship.id === talkingTo?.friendBoxId) {
            return {
              ...friendship,
              unreadMessageCount: 0,
            };
          }
          return friendship;
        });
        return updatedFriendList;
      });
    }
  };

  if (ctx?.friendList) {
    return (
      <motion.ul
        variants={container}
        initial="hidden"
        animate="visible"
        className="hide_scroll flex flex-col  flex-1 overflow-y-auto  overflow-x-hidden"
      >
        {friendProfileData && props.showMenu && (
          <div>
            <ModalBackground
              darkness={0.3}
              onClose={() => {
                setFriendProfileData(undefined);
              }}
            />
            <FriendProfile
              close={() => {
                setFriendProfileData(undefined);
              }}
              data={friendProfileData}
            />
          </div>
        )}
        {ctx?.friendList
          ?.sort((a: IFriendList, b: IFriendList) =>
            a.updateTime > b.updateTime ? -1 : 1
          )
          .map((friendBox: IFriendList) => (
            <motion.li
              variants={item}
              onClick={() => {
                if (!friendBox.approved) {
                  return;
                }
                props.closeMenu();
                props.closeWelcome();
                loadChatLogHandler({
                  id:
                    ctx?.user?.id !== friendBox.fromUserId
                      ? friendBox.fromUserId
                      : friendBox.toUserId,
                  name:
                    ctx?.user?.id !== friendBox.fromUserId
                      ? friendBox.fromUser.name
                      : friendBox.toUser.name,
                  picture:
                    ctx?.user?.id !== friendBox.fromUserId
                      ? friendBox.fromUser.picture
                      : friendBox.toUser.picture,
                  isApproved: friendBox.approved,
                  friendBoxId: friendBox.id,
                });
              }}
              key={friendBox.id}
              className={`flex  relative h-14 transition-colors group items-center justify-between  hover:bg-neutral-700 rounded-lg p-1 px-2 ${
                friendBox.approved ? "cursor-pointer" : ""
              }`}
            >
              {props.showMenu && friendBox.approved && (
                <FriendSettingsDropdown
                  closeTriger={() => {
                    setShowFriendSettings(false);
                  }}
                  openCloseTriger={() => {
                    setShowFriendSettings((prev) => !prev);
                  }}
                  showFriendSettings={showFriendSettings}
                  setData={() => {
                    setFriendProfileData({
                      feelings:
                        ctx?.user?.id !== friendBox.fromUserId
                          ? friendBox.fromUser.feeling
                          : friendBox.toUser.feeling,
                      name:
                        ctx?.user?.id !== friendBox.fromUserId
                          ? friendBox.fromUser.name
                          : friendBox.toUser.name,
                      picture:
                        ctx?.user?.id !== friendBox.fromUserId
                          ? friendBox.fromUser.picture
                          : friendBox.toUser.picture,
                    });
                  }}
                />
              )}

              <div className="flex items-center gap-4">
                <img
                  onClick={(e) => {
                    if (props.showMenu) {
                      e.stopPropagation();
                      if (friendBox.approved) {
                        setFriendProfileData({
                          feelings:
                            ctx?.user?.id !== friendBox.fromUserId
                              ? friendBox.fromUser.feeling
                              : friendBox.toUser.feeling,
                          name:
                            ctx?.user?.id !== friendBox.fromUserId
                              ? friendBox.fromUser.name
                              : friendBox.toUser.name,
                          picture:
                            ctx?.user?.id !== friendBox.fromUserId
                              ? friendBox.fromUser.picture
                              : friendBox.toUser.picture,
                        });
                      }
                    } else {
                    }
                  }}
                  className="w-10 h-10 object-cover rounded-full"
                  src={
                    ctx?.user?.id !== friendBox.fromUserId
                      ? friendBox.fromUser.picture
                      : friendBox.toUser.picture
                  }
                  alt=""
                />

                {props.showMenu && (
                  <div className="flex flex-col">
                    <span className="truncate max-lg:w-32 select-none ">
                      {ctx?.user?.id !== friendBox.fromUserId
                        ? friendBox.fromUser.name
                        : friendBox.toUser.name}
                    </span>
                    {friendBox.lastMessage && (
                      <span className="truncate w-40 lg:w-56 select-none text-sm text-[#979797]">
                        {friendBox.lastMessageFrom}:{friendBox.lastMessage}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`bg-green-500 absolute  aspect-square scale-0 transition-all  text-xs font-semibold w-5 p-0.5 flex justify-center items-center rounded-full  
                ${props.showMenu ? "top-2 right-10" : "  top-0 right-0"}
                ${friendBox.unreadMessageCount > 0 ? "scale-100" : ""}`}
              >
                <span className="truncate">{friendBox.unreadMessageCount}</span>
              </div>

              {props.showMenu && !friendBox.approved ? (
                ctx?.user?.id !== friendBox.fromUser.id ? (
                  <div className="flex gap-2">
                    <button
                      className="peer"
                      onClick={(e) => {
                        approveFriendRequestHandler(e, friendBox.id);
                      }}
                    >
                      <BsFillPersonCheckFill
                        size={20}
                        className="text-green-500 transition-all hover:text-green-400 "
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        RejectFriendRequestHandler(e, friendBox.id);
                      }}
                    >
                      <BsFillPersonXFill
                        size={20}
                        className="text-red-500 transition-all hover:text-red-400"
                      />
                    </button>
                  </div>
                ) : (
                  <div className="border-4 border-gray-400 border-t-green-500 w-5 aspect-square rounded-full animate-spin  "></div>
                )
              ) : (
                ""
              )}
            </motion.li>
          ))}
      </motion.ul>
    );
  } else {
    return (
      <ul className="flex flex-col gap-2 flex-1">
        {new Array(7).fill(null).map((e, i) => (
          <li
            key={i}
            className="chat_loader border-[#ffffff57] border-l-[1px] border-t-[1px]  overflow-hidden flex gap-4 items-center transition-all  hover:bg-neutral-700 rounded-lg p-2 px-2 cursor-pointer"
          >
            <span className="w-10 h-10 object-cover rounded-full bg-black opacity-30"></span>
            {props.showMenu && (
              <div className="relative overflow-hidden flex w-32 lg:w-52 gap-2 flex-col h-full justify-center rounded-lg ">
                <div className="relative overflow-hidden bg-black opacity-30 w-full rounded-md h-2 "></div>
                <div className="relative overflow-hidden bg-black opacity-30 w-20 lg:w-40 rounded-md h-2 "></div>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }
};

export default FriendList;
