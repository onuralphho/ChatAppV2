
const FormInput = (props: any) => {
  return (
    <div className="relative  group  text-green-300 ">
      <input
        onChange={props.changeState}
        type={props.type}
        name={props.name}
        value={props.state}
        className="text-xl peer w-full  invalid:border-red-600 p-3 bg-transparent   border-2 border-green-300 rounded-md outline-none"
        placeholder=" "
      />
      <label className=" absolute transition-all duration-300 bg-stone-800 pointer-events-none text-lg  px-1 h-min left-5 peer-placeholder-shown:text-2xl -top-14  peer-focus:-top-14 peer-focus:text-lg peer-placeholder-shown:-top-1 font-bold my-auto  bottom-0 ">
        {props.label}
      </label>
      <p className="invisible peer-invalid:visible text-red-600 ">
        {props?.invalid}
      </p>
    </div>
  );
};

export default FormInput;
