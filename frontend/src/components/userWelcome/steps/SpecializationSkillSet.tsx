import { PrimaryButton } from "@/components/common/PrimaryButton";
import { StepperTitle } from "@/components/common/StepperTitle";
import { SubSepcializationCard } from "@/components/common/SubSepcializationCard";
import { SearchBar } from "@/components/nav/SearchBar";
import useToast from "@/hooks/use-toast";
import { useApiCaller } from "@/hooks/useApicaller";
import { useOnBoardingMutation } from "@/services/slices/authSlice";
import { useGetSpecializationsByIndustryIdQuery } from "@/services/slices/onBoardingSlice";
import { useState, useEffect } from "react";



type SpecializationSkillSetProps = {
  goToNextStep: () => void;
  id: number | null;
};

export const SpecializationSkillSet = ({
  goToNextStep,
  id,
}: SpecializationSkillSetProps) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(null);
  const { executeApiCall, isLoading } = useApiCaller(useOnBoardingMutation);
  const [isButtonDisabled,setIsButtonDisabled] = useState(true);
  const { showNotification } = useToast();

  const {
    data,
    isLoading: IndustriesLoading,
    error,
    refetch,
  } = useGetSpecializationsByIndustryIdQuery(id, { skip: id === null });

  useEffect(() => {
    if (id !== null) {
      refetch();
    }
  }, [id, refetch]);

  useEffect(()=>{
    if(value !== null){
      setIsButtonDisabled(false);
    }
  },[value]);

  const handleClick = async () => {
    if (value !== null) {
      const formData = new FormData();
      formData.append("specialization_id", value);
      formData.append("step", "3");
      const res = await executeApiCall(formData);

      if (res.success) {
        goToNextStep();
      }
    }else {
      showNotification({
        message: "Please select one skill set!",
        type: "danger",
      });
    }
  };

  if (id === null) {
    return (
      <div className="text-center text-gray-600 py-10">
        No industry selected. Please go back and select an industry.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error loading specializations. Please try again later.
      </div>
    );
  }

  // Filter specializations based on search input
  const filteredSpecializations = data?.data.filter(({ name }: { name: any }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Render the list of specializations
  const renderSpecializations = () => {
    if (IndustriesLoading) {
      return (
        <div className="text-center py-10">Loading specializations...</div>
      );
    }

    return (
      <div className="relative mt-[10px]">
        <div className="grid grid-cols-1 md:grid-cols-4 py-[30px] h-[380px] overflow-scroll scroll gap-[25px] no-scrollbar">
          {filteredSpecializations?.length > 0 ? (
            filteredSpecializations.map(({ id, name }) => (
              <SubSepcializationCard
                active={id === value}
                handleClick={() => setValue(id)}
                key={id}
                name={name}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No results found
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col pb-12 items-center justify-center">
      <StepperTitle title="What is your specialization in Design & Creative?" />

      <div className="container mx-auto mt-[40px] flex-col flex items-center justify-center">

        <SearchBar setValue={setSearch} value={search} width="lg" />


        {renderSpecializations()}


        <PrimaryButton
          handleClick={handleClick}
          width="w-[200px] mt-[50px]"
          title="Save"
          loading={isLoading}
          isButtonDisabled={isButtonDisabled}
        />
      </div>
    </div>
  );
};
