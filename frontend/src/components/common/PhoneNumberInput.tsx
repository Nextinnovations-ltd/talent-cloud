import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./phoneNumberInput.css";
import clsx from "clsx";

export const PhoneNumberInput = ({
  value,
  setValue,
  isError,
}: {
  value: any;
  setValue: any;
  isError: any;
}) => {
  

  return (
    <div className={clsx(isError && "border-2  border-red-500  rounded-md" ,"mt-3")}>
      <PhoneInput
        className="border-red-500 border-2"
        value={`${value}`}
        onChange={(phone) => setValue(phone)}
      />
    </div>
  );
};
