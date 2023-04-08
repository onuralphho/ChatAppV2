import { BiArrowBack } from "react-icons/bi";
import { useAuth } from "../Context/AuthProvider";
import React, { useState } from "react";
import { Fetcher } from "../utils/Fetcher";
import { sleep } from "../utils/sleep";
import { useAlertContext } from "../Context/AlertProvider";
import AlertBox from "./AlertBox";

interface IProfileProps {
  closeProfile: Function;
}

const DROPDOWN_DATA = [
  {
    url: "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Dog-512.png",
    title: "Dog",
  },
  {
    url: "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Cat-512.png",
    title: "Cat",
  },
  {
    url: "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Panda-512.png",
    title: "Panda",
  },
  {
    url: "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Penguin-512.png",
    title: "Penguin",
  },
  {
    url: "https://static.vecteezy.com/system/resources/thumbnails/020/647/520/small_2x/pig-face-icon-cute-animal-icon-in-circle-png.png",
    title: "Pig",
  },
];

const ProfileSettings = (props: IProfileProps) => {
  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const [nameInput, setNameInput] = useState(ctx?.user.name);
  const [emailInput, setEmailInput] = useState(ctx?.user.email);
  const [pictureInput, setPictureInput] = useState(ctx?.user.picture);
  const [dropdownShown, setDropdownShown] = useState(false);

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
        Id: ctx?.user.id,
        Name: nameInput.toLowerCase(),
        Email: emailInput,
        Picture: pictureInput,
      },
      method: "PUT",
      url: "/api/users/update",
      token: jwt,
    });
    alertCtx?.setAlert({ shown: true, type: res.success });

    ctx?.setUser(res.session);
    await sleep(2000);
    alertCtx?.setAlert({ shown: false, type: res.success });
  };

  return (
    <>
      <AlertBox
        message={alertCtx?.alert.type}
        isShown={alertCtx?.alert.shown}
        closeBox={alertCtx?.setAlert}
      />
      <div className="bg-[#363636] flex-1   h-full fade-in">
        <div className="flex flex-col h-full">
          <div className="flex py-2 px-10  items-center">
            <button
              className=" "
              onClick={() => {
                props.closeProfile();
              }}
            >
              <BiArrowBack size={40} className="text-red-500" />
            </button>
          </div>
          <div className="mx-4">
            <h2 className="text-2xl font-semibold">Profile:</h2>{" "}
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
                    <span>Choose an avatar</span>
                    <div
                      className={`${
                        !dropdownShown ? "h-0 border-0 p-0 " : "h-56 p-1"
                      } bg-[#252525]  transition-all flex flex-col gap-1 overflow-hidden absolute left-0 top-11 w-full rounded-md `}
                    >
                      {DROPDOWN_DATA.map((item, index) => (
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
                      {ctx?.user.email}
                      {" )"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="submit"
                      className="bg-green-500 w-max px-2 text-lg rounded-md"
                    >
                      Save
                    </button>
                    <span className="italic opacity-60 text-xs ">
                      {"Last Update: ( "}
                      {
                        ctx?.user.updateTime
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[0]
                      }
                      {":"}
                      {
                        ctx?.user.updateTime
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[1]
                      }
                      {"  "}
                      {ctx?.user.updateTime.split("T")[0]}
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
