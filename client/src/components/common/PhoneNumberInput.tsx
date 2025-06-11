import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "./phoneNumberInput.css";

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
    <div className={isError && "border-2 border-red-500  rounded-md"}>
      <PhoneInput
        className="border-red-500 border-2"
        defaultCountry="mm"
        value={`${value}`}
        onChange={(phone) => setValue(phone)}
      />
    </div>
  );
};
