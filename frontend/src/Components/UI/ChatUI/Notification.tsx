import { FC } from "react";
import { INotification } from "../../../@types/notificationInterface";
import { RxCaretRight } from "react-icons/rx";
import { useAuth } from "../../../Context/AuthProvider";
import { Fetcher } from "../../../utils/Fetcher";
interface Props {
  notification?: INotification;
  closeProfile: () => void;
  closeWelcome: () => void;
}

const Notification: FC<Props> = ({
  notification,
  closeProfile,
  closeWelcome,
}) => {
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
        className="object-cover w-10 rounded-full aspect-square"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{message?.fromUser.name}</span>
        <span className="w-32 truncate">{message?.contentText}</span>
      </div>
      <button
        onClick={async () => {
          closeProfile();
          closeWelcome();
          ctx?.setTalkingTo(talkingTo);
          const res = await Fetcher({
            method: "GET",
            url: "/api/messages/" + talkingTo?.friendBoxId,
            token: ctx?.getCookie("jwt"),
          });
          const data = await res.json()
          ctx?.setMessages(data);

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
        className="px-2 py-1 text-3xl text-white transition-all bg-green-500 rounded-md hover:scale-105"
      >
        <RxCaretRight />
      </button>
    </div>
  );
};

export default Notification;
