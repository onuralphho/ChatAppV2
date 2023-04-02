import AuthForm from "../Components/AuthForm";
import humanImage from "../Assets/human.svg";
import { useAuth } from "../Context/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const ctx = useAuth();
  const navigate = useNavigate()
  useEffect(() => {
   
   
   }, []);


  return (
    <div className="flex flex-wrap  max-xl:flex-col h-[100svh]  max-md:gap-4 items-center md:justify-center max-md:pt-10">
      <img
        src={humanImage}
        className=" md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl "
        alt=""
      />

      <AuthForm ctx={ctx} />
    </div>
  );
};

export default AuthPage;
