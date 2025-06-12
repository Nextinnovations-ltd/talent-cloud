import { Button } from "../ui/button";
import formColors from "@/constants/formStyles";
import { LoadingSpinner } from "./LoadingSpinner";
import clsx from "clsx";

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  isButtonDisabled,
  loading,
  handleClick,
  width,
}) => {
  const { formStyles } = formColors;

  return (
    <Button
      onClick={handleClick}
      type="submit"
      variant={"buttonDefaultCss"}
      size={"lg"}
      className={clsx(
        isButtonDisabled
          ? formStyles.buttonDisabledCss
          : formStyles.buttonActiveCss,
        width
      )}
    >
      {loading ? <LoadingSpinner /> : title}
    </Button>
  );
};
