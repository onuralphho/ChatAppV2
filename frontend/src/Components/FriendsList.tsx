import { useAuth } from "../Context/AuthProvider";
import { IFriendList } from "../@types/friendBoxType";
import { BsFillPersonCheckFill, BsFillPersonXFill } from "react-icons/bs";
import { Fetcher } from "../utils/Fetcher";
import { sleep } from "../utils/sleep";
import { useAlertContext } from "../Context/AlertProvider";
import { ITalkingTo } from "../@types/talkingTo";
import { useConnectionContext } from "../Context/ConnectionProvider";

interface Iprops {
  showMenu: boolean;
  openMenu: Function;
  closeProfile: Function;
}

const FriendList = (props: Iprops) => {
  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const conCtx = useConnectionContext();

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

    conCtx?.connection?.send("ApproveFriend", res);

    ctx?.setFriendList((prev) => {
      if (!prev) return prev;

      return prev.map((friendBox) => {
        if (friendBox.id === id) {
          return { ...friendBox, approved: true };
        }
        return friendBox;
      });
    });

    alertCtx?.setAlert({ shown: true, type: res.message });
    sleep(2000);
    alertCtx?.setAlert({ shown: false, type: res.message });
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

    ctx?.setFriendList((prev) => {
      if (!prev) return prev;

      return prev.filter((friendBox) => {
        return friendBox.id !== id;
      });
    });
  };

  const loadChatLogHandler = async (talkingTo: ITalkingTo) => {
    if (talkingTo.isApproved) {
      props.closeProfile();
      props.openMenu();

      ctx?.setTalkingTo(talkingTo);

      const res = await Fetcher({
        method: "GET",
        url: "/api/messages/" + talkingTo.friendBoxId,
        token: ctx?.getCookie("jwt"),
      });

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
      ctx?.setMessages(res);
    }
  };

  if (ctx?.friendList) {
    return (
      <ul className="flex flex-col overflow-y-auto max-h-[500px] overflow-x-hidden">
        {ctx?.friendList
          ?.sort((a: IFriendList, b: IFriendList) =>
            a.updateTime > b.updateTime ? -1 : 1
          )
          .map((friendBox: IFriendList) => (
            <li
              onClick={() => {
                if (!friendBox.approved) {
                  return;
                }
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
              className={`flex relative  items-center justify-between transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 ${
                friendBox.approved ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <img
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
                    <span className="truncate select-none ">
                      {ctx?.user?.id !== friendBox.fromUserId
                        ? friendBox.fromUser.name
                        : friendBox.toUser.name}
                    </span>
                    {friendBox.lastMessage && (
                      <span className="truncate select-none text-sm text-[#979797]">
                        {friendBox.lastMessageFrom}:{friendBox.lastMessage}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`bg-green-500 aspect-square scale-0 transition-all  text-xs font-semibold w-5 p-0.5 flex justify-center items-center rounded-full  
                ${props.showMenu ? "" : "absolute  top-0 right-0"}
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
            </li>
          ))}
      </ul>
    );
  } else {
    return (
      <ul className="flex flex-col">
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
      </ul>
    );
  }
};

export default FriendList;
