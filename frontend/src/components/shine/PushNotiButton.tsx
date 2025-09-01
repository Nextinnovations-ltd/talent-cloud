import Plus from "@/assets/svgs/plus.svg"

const PushNotiButton = () => {
    return (
        <button className="flex gap-3 justify-center bg-bg-primary w-[213px] text-white py-[13.5px] rounded-[10px]">
            <img src={Plus} alt="" />
            <span>Push Notification</span>
        </button>
    );
}

export default PushNotiButton;
