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

const ProfileSettings = (props: IProfileProps) => {
  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const [nameInput, setNameInput] = useState(ctx?.user.name);
  const [emailInput, setEmailInput] = useState(ctx?.user.email);
  const [pictureInput, setPictureInput] = useState(ctx?.user.picture);

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };
  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const pictureChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictureInput(e.target.value);
  };

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jwt = ctx?.getCookie("jwt");
    const res = await Fetcher({
      body: {
        Id: ctx?.user.id,
        Name: nameInput,
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
      <div className="bg-[#363636] flex-1  h-full fade-in">
        <div className="flex flex-col  h-full">
          <div className="flex p-2">
            <button
              className=" px-4 rounded-md "
              onClick={() => {
                props.closeProfile();
              }}
            >
              <BiArrowBack size={40} className="text-red-500" />
            </button>
          </div>
          <form
            onSubmit={submitFormHandler}
            className="flex-1 flex-col flex px-5 "
          >
            <div className="flex  gap-4  min-h-[200px]  w-min">
              <div className="flex flex-col  gap-1 w-40 ">
                <img
                  src={pictureInput}
                  className="rounded-lg   flex-1 object-cover border border-green-500"
                  alt=""
                />
                <input
                  type="text"
                  onChange={pictureChangeHandler}
                  className="bg-transparent border  border-green-500 p-1 rounded-lg"
                  value={pictureInput}
                />
              </div>
              <div className="flex flex-col justify-start gap-16 py-2">
                <div className="flex flex-col">
                  <input
                    className="bg-transparent text-3xl max-w-[200px]"
                    value={nameInput}
                    onChange={nameChangeHandler}
                  />
                  <span className="tx-lg italic opacity-60">
                    {"( "}
                    {ctx?.user.email}
                    {" )"}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 w-max px-2 text-lg rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
