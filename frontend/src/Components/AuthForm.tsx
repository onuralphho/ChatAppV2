import { useState } from "react";
import FormInput from "./FormInput";

const AuthForm = (props: any) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [Loading, setLoading] = useState(false);
  const [Loading2, setLoading2] = useState(false);

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
      const res = await fetch("http://localhost:5159/api/Users", {
        method: "POST",
        body: JSON.stringify({
          createdTime: new Date(),
          updateTime: new Date(),
          email: emailInput,
          password: passwordInput,
          name: name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.message) {
        setErrorMessage(data.message);
      } else {
        props.ctx.login(emailInput, passwordInput);
        setPasswordInput("");
        setEmailInput("");
      }
      setLoading(false);
    } else {
      setErrorMessage("Provide credentials");
    }
  };

  const submitFormLogin = (e: any) => {
    e.preventDefault();
    if (emailInput !== "" && passwordInput !== "") {
      setLoading2(true);
      props.ctx.login(emailInput, passwordInput);
      setLoading2(false);
      setPasswordInput("");
      setEmailInput("");
    } else {
      setErrorMessage("Provide credentials");
    }
  };

  return (
    <form className=" rounded-3xl w-max h-max px-10 py-5 pb-7 flex flex-col gap-5 shadow-lg shadow-[rgba(0,0,0,0.4)]  bg-stone-800">
      <h2 className="text-xl md:text-3xl font-bold text-green-300">
        Welcome to Chatapp
        <span className="text-4xl md:text-5xl animate-pulse text-purple-500 ">
          {" "}
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
          className="min-h-[50px]  flex-1 text-2xl font-bold text-purple-500 px-4 py-2 rounded-xl border border-purple-500 hover:bg-purple-500 hover:text-white transition-all"
        >
          {Loading2 ? (
            <span className="dots" id="dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            "Login"
          )}
        </button>
        <button
          onClick={submitFormRegister}
          type="button"
          className="min-h-[50px] min-w-[124px]  bg-purple-500 text-white hover:bg-purple-400 transition-all  text-2xl font-bold rounded-xl py-2 px-4 "
        >
          {Loading ? (
            <span className="dots">
              <span></span>
              <span></span>
              <span></span>
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
