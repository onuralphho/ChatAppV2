import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import Welcome from "../Components/Welcome";
import Notification from "../Components/UI/ChatUI/Notification";
import { useConnectionContext } from "../Context/ConnectionProvider";
import { sleep } from "../utils/sleep";
import { INotification } from "../@types/notificationInterface";
import { IHubMessageResponse } from "../@types/hubMessageResponse";
import { IFriendList } from "../@types/friendBoxType";
import { TabTitle } from "../utils/TabTitle";
import { useTranslation } from "react-i18next";
import AlertBox from "../Components/UI/GeneralUI/AlertBox";
import { useAlertContext } from "../Context/AlertProvider";
const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notification, setNotification] = useState<INotification | undefined>(
    undefined
  );

  const { t } = useTranslation();

  const notificationAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3"
  );
  notificationAudio.volume = 0.2;

  const messageAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
  );
  messageAudio.volume = 0.2;

  const conCtx = useConnectionContext();
  const ctx = useAuth();
  const alertCtx = useAlertContext();

  useEffect(() => {
    const friendRequestListener = async (friendBox: IFriendList) => {
      ctx?.setFriendList((prev) => [...(prev || []), friendBox]);
    };
    const approveFriendListener = async (friendBox: IFriendList) => {
      ctx?.setFriendList((prev) => {
        if (prev) {
          const updatedList = prev.map((friend) => {
            if (friend.id === friendBox.id) {
              return {
                ...friend,
                approved: friendBox.approved,
              };
            }
            return friend;
          });
          return updatedList;
        }
        return prev;
      });
    };

    const connection = conCtx?.connection;

    if (connection) {
      connection.on("RecieveFriend", friendRequestListener);
      connection.on("ApproveFriend", approveFriendListener);
      return () => {
        connection.off("RecieveFriend", friendRequestListener);
        connection.off("ApproveFriend", approveFriendListener);
      };
    }
  }, [conCtx?.connection]);

  useEffect(() => {
    const receiveMessage = async (hubMessageResponse: IHubMessageResponse) => {
      if (
        ctx?.talkingTo?.friendBoxId ===
        hubMessageResponse.hubMessageSent.friendBoxId
      ) {
        messageAudio.play();
        await Fetcher({
          method: "GET",
          url: "/api/messages/read/" + ctx?.talkingTo?.friendBoxId,
          token: ctx?.getCookie("jwt"),
        });

        ctx?.setFriendList((prev) => {
          const updatedFriendList = prev?.map((friendship) => {
            if (friendship.id === ctx.talkingTo?.friendBoxId) {
              return {
                ...friendship,
                updateTime: hubMessageResponse.friendship.updateTime,
                unreadMessageCount: 0,
                lastMessage:
                  hubMessageResponse.hubMessageSent.contentText.length > 0
                    ? hubMessageResponse.hubMessageSent.contentText
                    : t("image"),
                lastMessageFrom:
                  hubMessageResponse.hubMessageSent.fromUser.name,
              };
            }
            return friendship;
          });
          return updatedFriendList;
        });
      } else {
        notificationAudio.play();

        ctx?.setFriendList((prev) => {
          let friend = prev?.find(
            (f) => f.id === hubMessageResponse.friendship.id
          );
          if (friend) {
            friend.updateTime = hubMessageResponse.friendship.updateTime;
            friend.unreadMessageCount = hubMessageResponse.unreadMessageCount;
            friend.lastMessage =
              hubMessageResponse.hubMessageSent.contentText.length > 0
                ? hubMessageResponse.hubMessageSent.contentText
                : t("image").toString();
            friend.lastMessageFrom =
              hubMessageResponse.hubMessageSent.fromUser.name;
            return [...(prev || [])];
          }
          return prev || [];
        });
      }

      ctx?.setMessages((prev) => [
        ...(prev || []),
        hubMessageResponse.hubMessageSent,
      ]);

      if (
        (ctx?.talkingTo &&
          ctx.talkingTo.id !== hubMessageResponse.hubMessageSent.fromUserId) ||
        !ctx?.talkingTo
      ) {
        setNotification({
          shown: true,
          message: hubMessageResponse.hubMessageSent,
          talkingTo: {
            friendBoxId: hubMessageResponse.hubMessageSent.friendBoxId,
            id: hubMessageResponse.hubMessageSent.fromUserId,
            isApproved: true,
            name: hubMessageResponse.hubMessageSent.fromUser.name,
            picture: hubMessageResponse.hubMessageSent.fromUser.picture,
          },
        });

        await sleep(2000);
        setNotification({
          shown: false,
          message: hubMessageResponse.hubMessageSent,
          talkingTo: {
            friendBoxId: hubMessageResponse.hubMessageSent.friendBoxId,
            id: hubMessageResponse.hubMessageSent.fromUserId,
            isApproved: true,
            name: hubMessageResponse.hubMessageSent.fromUser.name,
            picture: hubMessageResponse.hubMessageSent.fromUser.picture,
          },
        });
      }
      TabTitle(
        "New Message: " + hubMessageResponse.hubMessageSent.fromUser.name
      );
      await sleep(3000);
      TabTitle("Soprah Chat");
    };

    const connection = conCtx?.connection;

    if (connection) {
      connection.on("RecieveMessage", receiveMessage);

      return () => {
        connection.off("RecieveMessage", receiveMessage);
      };
    }
  }, [ctx?.talkingTo, conCtx?.connection]);

  useEffect(() => {
    const loginHub = async () => {
      if (ctx?.user?.id) {
        await conCtx?.connection?.invoke("JoinRoom", {
          UserId: ctx.user?.id.toString(),
        });
      }
    };

    loginHub();
  }, [ctx?.user?.id, conCtx?.connection]);

  useEffect(() => {
    const getUser = async () => {
      const jwt = ctx?.getCookie("jwt");

      const res = await Fetcher({
        method: "GET",
        url: "/api/authentication/session",
        token: jwt,
      });

      const data = await res.json();

      if (data) {
        ctx?.setUser(data);
      }

      const friendsRes = await Fetcher({
        method: "GET",
        url: "/api/friendboxes/friends",
        token: jwt,
      });
      const friendsData = await friendsRes.json();

      ctx?.setFriendList(friendsData);
    };

    getUser();
  }, []);

  const closeProfile = () => {
    setShowProfile(false);
  };
  const openProfile = () => {
    setShowProfile(true);
    setShowWelcome(false);
  };

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  const openWelcome = () => {
    setShowWelcome(true);
    setShowProfile(false);
  };

  if (ctx?.user) {
    return (
      <div className="flex h-full text-white lg:p-5 lg:px-10 xl:px-20 2xl:px-40 ">
        <div className="flex w-full relative max-w-[1920px] mx-auto lg:rounded-xl overflow-hidden  shadow-lg shadow-[rgba(0,0,0,0.5)]">
          {/* Notification */}
          <AlertBox
            message={alertCtx?.alert.type}
            isShown={alertCtx?.alert.shown}
          />

          <Notification
            notification={notification}
            closeProfile={closeProfile}
            closeWelcome={closeWelcome}
          />

          {/* SideBar */}
          <SideBar
            openProfile={openProfile}
            closeProfile={closeProfile}
            openWelcome={openWelcome}
            closeWelcome={closeWelcome}
          />

          {/* ChatLog */}
          {showProfile ? (
            <ProfileSettings
              closeProfile={closeProfile}
              openWelcome={openWelcome}
            />
          ) : showWelcome ? (
            <Welcome closeWelcome={closeWelcome} />
          ) : ctx?.talkingTo && ctx.talkingTo.isApproved ? (
            <ChatLog talkingTo={ctx.talkingTo} messages={ctx.messages} />
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-full text-white lg:p-5 lg:px-10 xl:px-20 2xl:px-40 ">
        <div
          className={`flex  w-full max-w-[1920px] mx-auto lg:rounded-xl overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]`}
        >
          <div className="bg-[#252525] h-full w-full flex flex-col gap-2 justify-center items-center">
            <span className="text-xl font-semibold">
              {t("loading_chats")}...
            </span>
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatPage;
