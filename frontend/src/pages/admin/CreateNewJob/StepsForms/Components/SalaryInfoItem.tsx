import SvgCoin from "@/assets/svgs/SvgCoin";
import { useJobFormStore } from "@/state/zustand/create-job-store";

const formatSalary = (amount: string | undefined) => {
  return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const SalaryInfoItem = () => {
  const { formData } = useJobFormStore();


  // If salary is negotiable, only show "Negotiable"
  if (formData?.stepThree?.is_salary_negotiable) {
    return (
      <div className="flex items-center gap-2">
        <SvgCoin />
        <h3 className="">Negotiable</h3>
      </div>
    );
  }

  // Otherwise show the salary range or fixed amount
  return (
    <div className="flex items-center gap-2">
      <SvgCoin />
      <h3>
        {formData?.stepThree?.salary_fixed ? (
          <>
            <span className="font-bold">{formatSalary(formData?.stepThree.salary_fixed)}</span>MMK/ <span >{formData?.stepThree?.salary_type === 'hourly' ? "hour" : 'month'}</span>
          </>
        ) : (
          <>
            <span className="font-bold">
              {formatSalary(formData?.stepThree?.salary_min)}-{formatSalary(formData?.stepThree?.salary_max)}
            </span> MMK/ <span >{formData?.stepThree?.salary_type === 'hourly' ? "hour" : 'month'}</span>
          </>
        )}
      </h3>
    </div>
  );
};

export default SalaryInfoItem;