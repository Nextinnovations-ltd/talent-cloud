type OverViewSummaryProps = {
    experienceLevel: string;
    experienceYears: number;
    specializationName: string;
    expectedSalary: string;
    age: number;
    role: string;
  };
  
  type SummaryCardProps = {
    value: string | number;
    label: string;
  };
  
  const SummaryCard: React.FC<SummaryCardProps> = ({ value, label }) => (
    <div className="px-[24px] flex flex-col items-center justify-center rounded-3xl border-[#CBD5E1] py-[40px] border-[1px]">
      <h3 className="text-[20px]">{value}</h3>
      <p className="mt-[6px] text-[#6B6B6B] text-[14px]">{label}</p>
    </div>
  );
  
  const OverViewSummary: React.FC<OverViewSummaryProps> = ({
    experienceLevel,
    experienceYears,
    specializationName,
    expectedSalary,
    age,
    role,
  }) => {
    const summaryData: SummaryCardProps[] = [
      { value: experienceLevel, label: "Experience Level" },
      { value: experienceYears, label: "Years of Experience" },
      { value: specializationName, label: "Specialization" },
      { value: expectedSalary, label: "Expected Salary" },
      { value: age, label: "Age" },
      { value: role, label: "Role" },
    ];
  
    return (
      <>
        {summaryData.map((item, index) => (
          <SummaryCard key={index} value={item.value} label={item.label} />
        ))}
      </>
    );
  };
  
  export default OverViewSummary;
  