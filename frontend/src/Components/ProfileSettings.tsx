import { HiArrowUturnLeft } from "react-icons/hi2";
import { useAuth } from "../Context/AuthProvider";
import React, { useState } from "react";
import { Fetcher } from "../utils/Fetcher";
import { sleep } from "../utils/sleep";
import { useAlertContext } from "../Context/AlertProvider";
import AlertBox from "./UI/AlertBox";
import { AVATAR_DATA } from "../Constants/avatarData";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

interface IProfileProps {
  closeProfile: Function;
  openWelcome: Function;
}

const ProfileSettings = (props: IProfileProps) => {
  const { t } = useTranslation();

  const ctx = useAuth();
  const alertCtx = useAlertContext();

  const [nameInput, setNameInput] = useState<string | undefined>(
    ctx?.user?.name
  );
  const [emailInput, setEmailInput] = useState<string | undefined>(
    ctx?.user?.email
  );
  const [pictureInput, setPictureInput] = useState<string | undefined>(
    ctx?.user?.picture
  );
  const [dropdownShown, setDropdownShown] = useState<boolean>(false);

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };
  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const pictureChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPictureInput(e.target.value);
  };

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwt = ctx?.getCookie("jwt");

    const res = await Fetcher({
      body: {
        Id: ctx?.user && ctx.user.id,
        Name: nameInput?.toLowerCase(),
        Email: emailInput,
        Picture: pictureInput,
      },
      method: "PUT",
      url: "/api/users/update",
      token: jwt,
    });
    const data = await res.json();
    alertCtx?.setAlert({ shown: true, type: t(data.message) });

    ctx?.setUser((prev) => {
      if (prev) {
        return {
          ...prev,
          name: data.sessionUser.name,
          picture: data.sessionUser.picture,
          updateTime: data.sessionUser.updateTime,
        };
      }
      return prev;
    });

    await sleep(2000);
    alertCtx?.setAlert({ shown: false, type: t(data.message) });
  };

  return (
    <>
      <AlertBox
        message={alertCtx?.alert.type}
        isShown={alertCtx?.alert.shown}
        closeBox={alertCtx?.setAlert}
      />
      <div className="bg-[#363636] flex-1  h-full fade-in">
        <div className="mt-12 flex flex-col h-full relative">
          <div className="absolute bottom-14 right-2">
            <LanguageSelector />
          </div>
          <div className="flex py-2 px-2  items-center">
            <button
              className="bg-green-500 px-2 rounded-md absolute bottom-2 lg:hidden "
              onClick={() => {
                props.closeProfile();
                props.openWelcome();
              }}
            >
              <HiArrowUturnLeft size={35} className="" />
            </button>
          </div>

          <div className="mx-4 ">
            <h2 className="text-2xl font-semibold">{t("profile")}:</h2>{" "}
            <form
              onSubmit={submitFormHandler}
              className="    sm:w-max   shadow shadow-neutral-800 rounded-md  p-2 "
            >
              <div className="flex max-[440px]:flex-col  gap-4  h-full ">
                <div className="flex flex-col  gap-2 w-40 ">
                  <img
                    src={pictureInput}
                    className="rounded-lg   flex-1 object-cover "
                    alt=""
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownShown((prev) => !prev);
                    }}
                    className="relative z-10 cursor-pointer select-none  bg-[#252525] text-white text-sm font-medium rounded-lg p-2.5"
                  >
                    <span>{t("select_avatar")}</span>
                    <div
                      className={`${
                        !dropdownShown ? "h-0 border-0 p-0 " : "h-56 p-1"
                      } bg-[#252525]  transition-all flex flex-col gap-1 overflow-hidden absolute left-0 top-11 w-full rounded-md `}
                    >
                      {AVATAR_DATA.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setPictureInput(item.url);
                          }}
                          className=" hover:bg-[#363636] rounded-md p-1 flex items-center gap-2 bg-[#252525]"
                        >
                          <img src={item.url} alt="" className="h-8" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                </div>
                <div className="flex flex-col gap-1 justify-between">
                  <div className="flex flex-col">
                    <input
                      className="bg-transparent text-3xl max-w-[200px]"
                      value={nameInput}
                      onChange={nameChangeHandler}
                    />
                    <span className=" italic opacity-60">
                      {"( "}
                      {ctx?.user && ctx.user.email}
                      {" )"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="submit"
                      className="bg-green-500 w-max px-2 text-lg rounded-md"
                    >
                      {t("save")}
                    </button>
                    <span className="italic opacity-60 text-xs ">
                      {t("last_update") + ": ( "}
                      {
                        ctx?.user?.updateTime
                          .toString()
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[0]
                      }
                      {":"}
                      {
                        ctx?.user?.updateTime
                          .toString()
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[1]
                      }
                      {"  "}
                      {ctx?.user?.updateTime.toString().split("T")[0]}
                      {" )"}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
