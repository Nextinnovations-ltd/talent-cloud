import { SpecializationCard } from "@/components/common/SpecializationCard";
import SpecializationCardSkeleton from "@/components/common/SpecializationCardSkeleton";
import { StepperTitle } from "@/components/common/StepperTitle";
import {
  AI,
  Backend,
  Digital,
  Frontend,
  FullStack,
  GraphicD,
  Mobile,
  SVGHuman,
  VIDEO,
} from "@/constants/svgs";
import { useGetUserTalentsQuery } from "@/services/slices/onBoardingSlice";

type Specialization = {
  id: number;
  name: string;
  description: string;
};

type Image = {
  SVGImg: JSX.Element;
  id: number;
};

type StepThreeProps = {
  goToNextStep: () => void;
  specializationId: number | null;
  setSpecializationId: (id: number) => void;
};

type CombinedData = Specialization & {
  SVGImg: JSX.Element | null;
};

const images: Image[] = [
  { SVGImg: <SVGHuman />, id: 35 },
  { SVGImg: <GraphicD />, id: 36 },
  { SVGImg: <Frontend />, id: 37 },
  { SVGImg: <Backend />, id: 38 },
  { SVGImg: <FullStack />, id: 39 },
  { SVGImg: <Mobile />, id: 40 },
  { SVGImg: <AI />, id: 41 },
  { SVGImg: <Digital />, id: 42 },
  { SVGImg: <VIDEO />, id: 43 },
];

export const StepThree = ({
  goToNextStep,
  specializationId,
  setSpecializationId,
}: StepThreeProps) => {
  const {
    data,
    isLoading: SpecializationLoading,
    isError,
  } = useGetUserTalentsQuery();

  // Combine specialization data with corresponding SVG image
  const combinedData: CombinedData[] | undefined = data?.data.map(
    (item: Specialization) => {
      const image = images.find((img) => img.id === item.id);
      return { ...item, SVGImg: image ? image.SVGImg : null };
    }
  );

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <SpecializationCardSkeleton key={index} />
      ))}
    </div>
  );

  const renderSpecializations = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-4">
      {combinedData?.map(({ id, description, SVGImg }) => (
        <SpecializationCard
          handleClick={() => {
            setSpecializationId(id);
            goToNextStep();
          }}
          key={id}
          title={description}
          SVGImg={SVGImg}
          active={id === specializationId}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col pb-12 items-center justify-center">
      <StepperTitle title="What is your Talent?" />

      {SpecializationLoading ? (
        renderSkeletons()
      ) : isError ? (
        <div className="text-red-500 mt-6">
          Failed to load specializations. Please try again.
        </div>
      ) : (
        renderSpecializations()
      )}
    </div>
  );
};
