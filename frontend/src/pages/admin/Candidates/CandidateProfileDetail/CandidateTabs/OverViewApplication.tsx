import clsx from "clsx";

type OverViewApplicationProps = {
  positionApplied: string;
  company: string;
  offeredSalary: string;
  totalApplicant: string;
  appliedDate: string;
  endDate: string;
};

type SummaryCardProps = {
  value: string | number;
  label: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const SummaryCard: React.FC<SummaryCardProps> = ({ value, label }) => (
  <div className="px-[15px] flex flex-col items-start justify-start border-l-[#0481EF] border-l-[4px] rounded-[2px]">
    <h3
      className={clsx(
        "text-[16px] font-[500]",
        label === "End Date" && "text-red-500"
      )}
    >
      {value}
    </h3>
    <p className="mt-[6px] text-[#6B6B6B] text-[14px]">{label}</p>
  </div>
);

const OverViewApplication: React.FC<OverViewApplicationProps> = ({
  positionApplied,
  company,
  offeredSalary,
  totalApplicant,
  appliedDate,
  endDate,
}) => {
  const summaryData: SummaryCardProps[] = [
    { value: positionApplied, label: "Position Applied" },
    { value: company, label: "Company" },
    { value: offeredSalary, label: "Offered Salary" },
    { value: totalApplicant, label: "Total Applicant" },
    { value: formatDate(appliedDate), label: "Applied Date" },
    { value: formatDate(endDate), label: "End Date" },
  ];

  return (
    <>
      {summaryData.map((item, index) => (
        <SummaryCard key={index} value={item.value} label={item.label} />
      ))}
    </>
  );
};

export default OverViewApplication;
