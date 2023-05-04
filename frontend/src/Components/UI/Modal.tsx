import { useTranslation } from "react-i18next";
const Modal = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        onClick={props.cancel}
        className="w-[100svw] z-40  h-[100svh] absolute left-0 top-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm "
      ></div>
      <div className="bg-white text-black  font-semibold rounded-md p-2 absolute z-50 w-[clamp(20rem,20vw,30rem)] flex flex-col gap-5 m-auto inset-0 h-max">
        <h2 className="text-3xl">{props.title}?</h2>

        <div className="flex gap-2">
          <button
            onClick={props.confirm}
            className="flex-1 text-xl text-white bg-green-500 rounded"
          >
            {t("confirm")}
          </button>
          <button
            onClick={props.cancel}
            className="flex-1 bg-[rgb(255,0,0)] rounded text-xl text-white"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
