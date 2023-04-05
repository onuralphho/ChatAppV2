import AuthForm from "../Components/AuthForm";
import humanImage from "../Assets/human.svg";
import { useAuth } from "../Context/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const ctx = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const jwt = ctx?.getCookie('jwt')
    if(jwt){
      navigate('/chats')
    }

    const pre = document.getElementById("pre");
    function rotateElement(event: any, element: any) {
      const rect = pre?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const x = event.clientX;
      const y = event.clientY;

      const middleX = rect.x + rect.width / 2;
      const middleY = rect.y + rect.height / 2;

      const offsetX = ((x - middleX) / middleX) * 25;
      const offsetY = ((y - middleY) / middleY) * 15;

      if (window.innerWidth < 720) {
        element.style.setProperty("--x-angel", 0 + "deg");
        element.style.setProperty("--y-angel", 0 + "deg");
        return;
      }

      element.style.setProperty("--x-angel", -1 * offsetY + "deg");
      element.style.setProperty("--y-angel", offsetX + "deg");
    }

    document.addEventListener("mousemove", (e) => {
      rotateElement(e, pre);
    });
  }, []);
  
  return (
    
    <div className="flex   max-xl:flex-col h-[100svh]  max-md:gap-4 max-xl:gap-4 items-center md:justify-center max-md:pt-10">
      <img
        src={humanImage}
        className="   max-w-xs  lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl "
        alt=""
      />

      <AuthForm ctx={ctx} />
    </div>
  );
};

export default AuthPage;
