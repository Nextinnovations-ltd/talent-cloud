// import { toast, toastOptions } from "react-toastify";

import { toast,ToasterProps } from 'sonner';

type notificationTypes = "default" | "success" | "danger" | "warn" | "trial";

type NotificationProps = {
  message: React.ReactNode;
  type?: notificationTypes;
  option?: ToasterProps;
};

type CircleCheck = any;

const useToast = () => {
  const showNotification = (props: NotificationProps) => {
    const { message, option, type } = props;

    switch (type) {
      case "default":
        toast.info(message, {
          style: { background: "#227A2C", color: "#ffffff" },
          ...option,
        });
        break;
      case "success":
        toast.success(message, {
          // style: {
          //   color: "#FFFFFF",
          //   backgroundColor:"#227A2C",
          //   borderTopRightRadius:'15px',
          //   borderTopLeftRadius:'15px',
          //   borderRadius:'15px',
          //   overflow:'hidden',
          //   justifyContent:'start',
          //   alignItems:'center',
          //   paddingLeft:'10px',
          //   height:'80px',
          //   fontSize:'16px'
          // },
          ...option,
        });
        break;
      case "danger":
        toast.error(message, {
          style: { background: "#ff7979", color: "#ffffff" },
          className: "text-[12px]",
          ...option,
        });
        break;
      case "trial":
        toast.warning(message, {
          className: "w-[1000px]",
          position: "top-right",
          ...option,
        });
        break;
      case "warn":
        toast.warning(message, {
          ...option,
        });
      default:
        toast.info(message, {
          style: { background: "#227A2C" },
          ...option,
        });
        break;
    }
  };

  return { showNotification };
};

export default useToast;
