import AuthForm from "../Components/AuthForm"   
import humanImage from "../Assets/human.svg"
const AuthPage = () => {
    
    return(
        <div className="flex flex-wrap  max-xl:flex-col h-[100svh]   max-md:gap-4 items-center ">
            <img src={humanImage} className=' md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl ' alt="" />
            <AuthForm/>
            
        </div>
        
    )

}


export default AuthPage