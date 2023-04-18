import { FC } from "react";
import { INotification } from "../@types/notificationInterface";

import { RxCaretRight } from "react-icons/rx";
import { useAuth } from "../Context/AuthProvider";
import { Fetcher } from "../utils/Fetcher";
interface Props {
  notification?: INotification;
  closeProfile: () => void;
}

const Notification: FC<Props> = ({ notification, closeProfile }) => {
  const ctx = useAuth();
  if (!notification) {
    return null;
  }

  const { shown, talkingTo, message } = notification;

  return (
    <div
      className={`${
        shown ? "translate-y-0" : "-translate-y-20"
      } flex ease-out duration-500 items-center gap-3 absolute px-4 py-1 w-max   top-2 bg-[#efefef] border-green-500 border-[2px] shadow-md rounded-lg text-black z-40 m-auto left-0 right-0 `}
    >
      <img
        src={message?.fromUser.picture}
        alt=""
        className="w-10 aspect-square object-cover rounded-full"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{message?.fromUser.name}</span>
        <span className="truncate w-32">{message?.contentText}</span>
      </div>
      <button
        onClick={async () => {
          closeProfile();
          ctx?.setTalkingTo(talkingTo);
          const res = await Fetcher({
            method: "GET",
            url: "/api/messages/" + talkingTo?.friendBoxId,
            token: ctx?.getCookie("jwt"),
          });
          
          ctx?.setMessages(res);

          await Fetcher({
            method: "GET",
            url: "/api/messages/read/" + talkingTo?.friendBoxId,
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
        }}
        className="text-3xl text-white bg-green-500 px-2 rounded-md hover:scale-105 transition-all py-1"
      >
        <RxCaretRight />
      </button>
    </div>
  );
};

export default Notification;
