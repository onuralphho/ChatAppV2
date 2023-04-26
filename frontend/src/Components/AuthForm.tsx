import { useState } from "react";
import FormInput from "./FormInput";
import { Fetcher } from "../utils/Fetcher";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
const AuthForm = (props: any) => {

  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [Loading, setLoading] = useState(false);
  const [Loading2, setLoading2] = useState(false);

  const navigate = useNavigate();

  const passwordChangeHandler = (e: any) => {
    setPasswordInput(e.target.value);
    setErrorMessage("");
  };
  const emailChangeHandler = (e: any) => {
    setEmailInput(e.target.value);
    setErrorMessage("");
  };

  const submitFormRegister = async (e: any) => {
    e.preventDefault();

    if (emailInput !== "" && passwordInput !== "") {
      setLoading(true);

      var name = emailInput.split("@")[0];

      const res = await Fetcher({
        body: {
          email: emailInput,
          password: passwordInput,
          name: name,
          picture:
            "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
        },
        method: "POST",
        url: "/api/users/register",
      });
      const data = await res.json();

      setLoading(false);

      if (data.message) {
        setErrorMessage(data.message);
        return;
      }
      setPasswordInput("");
      setEmailInput("");
      await props.ctx.login(emailInput, passwordInput);
      navigate("/chats");
    } else {
      setErrorMessage("Provide credentials");
    }
  };

  const submitFormLogin = async (e: any) => {
    e.preventDefault();
    if (emailInput !== "" && passwordInput !== "") {
      setLoading2(true);
      const res = await props.ctx.login(emailInput, passwordInput);
      setLoading2(false);

      if (res.message) {
        setErrorMessage(res.message);
        return;
      }
      setPasswordInput("");
      setEmailInput("");
      
      navigate("/chats");
    } else {
      setErrorMessage("Provide credentials");
    }
  };

  return (
    <form
      id="pre"
      className="demo_wrapper rounded-xl w-max h-max px-10 py-5 pb-7 flex flex-col gap-5 bg-stone-800"
    >
      <h2 className="text-xl md:text-3xl font-bold text-green-300">
        Welcome to SoChat
        <span className="text-4xl md:text-5xl animate-pulse text-purple-500 ">
          v.2
        </span>
      </h2>
      <FormInput
        label={"E-mail"}
        type={"email"}
        name={"email"}
        state={emailInput}
        changeState={emailChangeHandler}
      />
      <FormInput
        label={"Password"}
        type={"password"}
        name={"password"}
        state={passwordInput}
        changeState={passwordChangeHandler}
      />
      {errorMessage && (
        <span className="text-red-600 font-semibold text-lg">
          {errorMessage}
        </span>
      )}
      <div className="flex gap-2">
        <button
          onClick={submitFormLogin}
          className="min-h-[50px]  flex-1 text-2xl font-bold text-purple-500 px-4 py-2 rounded-md border border-purple-500 hover:bg-purple-500 hover:text-white transition-all"
        >
          {Loading2 ? (
            <span className="dots gap-1">
            <span className="w-3 bg-white"></span>
            <span className="w-3 bg-white"></span>
            <span className="w-3 bg-white"></span>
          </span>
          ) : (
            "Login"
          )}
        </button>
        <button
          onClick={submitFormRegister}
          type="button"
          className="min-h-[50px] min-w-[124px]  bg-purple-500 text-white hover:bg-purple-400 transition-all  text-2xl font-bold rounded-md py-2 px-4 "
        >
          {Loading ? (
            <span className="dots gap-1">
              <span className="w-3 bg-white"></span>
              <span className="w-3 bg-white"></span>
              <span className="w-3 bg-white"></span>
            </span>
          ) : (
            "Register"
          )}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
