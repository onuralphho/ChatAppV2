import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Fetcher } from "../../../utils/Fetcher";
import { useAuth } from "../../../Context/AuthProvider";
import { useAlertContext } from "../../../Context/AlertProvider";

type Props = {
  closePasswordChange: () => void;
};

const PasswordChangeForm = (props: Props) => {
  const { t } = useTranslation();
  const [oldPasswordInput, setOldPasswordInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [newPasswordAgainInput, setNewPasswordAginInput] = useState<string>("");
  const ctx = useAuth();
  const alertCtx = useAlertContext();
  const checkValid = (): boolean => {
    if (
      newPasswordInput === newPasswordAgainInput &&
      newPasswordInput.length > 0 &&
      newPasswordAgainInput.length > 0 &&
      oldPasswordInput.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const oldPasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPasswordInput(e.target.value);
  };
  const newPasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordInput(e.target.value);
  };
  const newPasswordAgainChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPasswordAginInput(e.target.value);
  };

  const submitFormHandler = async () => {

    const res = await Fetcher({
      method: "PUT",
      url: "/api/users/changepassword",
      body: {
        oldPassword: oldPasswordInput,
        newPassword: newPasswordInput,
      },
      token: ctx?.getCookie("jwt"),
    });
    setOldPasswordInput("");
    setNewPasswordInput("");
    setNewPasswordAginInput("");

    const data = await res.json();
    alertCtx?.alertStarter(data.detail);
  };
  
  checkValid();
  return (
    <div className="flex flex-col gap-2 justify-around">
      <input
        type="password"
        onChange={oldPasswordChangeHandler}
        value={oldPasswordInput}
        placeholder={t("old_password").toString()}
        className="bg-transparent border-green-500 border rounded-md px-2 py-1"
      />
      <input
        type="password"
        onChange={newPasswordChangeHandler}
        value={newPasswordInput}
        placeholder={t("new_password").toString()}
        className={`${
          newPasswordInput !== newPasswordAgainInput ? "border-red-600" : ""
        } bg-transparent border-green-500 border rounded-md px-2 py-1`}
      />
      <input
        type="password"
        onChange={newPasswordAgainChangeHandler}
        value={newPasswordAgainInput}
        placeholder={t("new_password_again").toString()}
        className={`${
          newPasswordInput !== newPasswordAgainInput ? "border-red-600" : ""
        } bg-transparent border-green-500 border rounded-md px-2 py-1`}
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={submitFormHandler}
          disabled={!checkValid()}
          className="flex-1 bg-green-500 rounded-md disabled:bg-neutral-500"
        >
          {t("submit")}
        </button>
        <button
          type="button"
          onClick={props.closePasswordChange}
          className=" bg-red-600 px-2 rounded-md"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
