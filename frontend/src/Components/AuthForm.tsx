import { useState } from "react";
import FormInput from "./FormInput";

const AuthForm = (props: any) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const passwordChangeHandler = (e: any) => {
    setPasswordInput(e.target.value);
  };
  const emailChangeHandler = (e: any) => {
    setEmailInput(e.target.value);
  };

  const submitFormHandler = (e: any) => {
    e.preventDefault();
    
    if (emailInput !== "" && passwordInput !== "") {
        console.log(emailInput, passwordInput);
      setPasswordInput("");
      setEmailInput("");
    }
  };

  return (
    <form
      onSubmit={submitFormHandler}
      className=" rounded-3xl w-max h-max px-10 py-5 pb-7 flex flex-col gap-5 shadow-lg shadow-[rgba(0,0,0,0.4)]  bg-stone-800"
    >
      <h2 className="text-xl md:text-3xl font-bold text-green-300">
        Welcome to Chatapp
        <span className="text-4xl md:text-5xl animate-pulse text-purple-500 "> v.2</span>
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
      <button
        type="submit"
        className="border text-purple-500 text-2xl font-bold rounded-xl py-2 border-purple-500 hover:bg-purple-500 hover:text-white transition-all"
      >
        Continue
      </button>
    </form>
  );
};

export default AuthForm;
