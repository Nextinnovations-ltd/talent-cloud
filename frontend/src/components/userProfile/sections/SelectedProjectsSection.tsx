import { motion, Variants } from "framer-motion"
import { Title } from "../Title"
import SampleImage from '../../../assets/Login/Frame 35677.png';
import SampleImage2 from '../../../assets/Login/Frame 35681.png';
import SampleImage3 from '../../../assets/Login/Bluelife 1.png';
import SampleImage4 from '../../../assets/Login/IIDA.png';
import { PinContainer } from "@/components/common/3d-pin";
import { SelectedProjects } from "../components/SelectedProjects";
import { useNavigate } from "react-router-dom";


interface SelectedProjectsSectionPropps {
  isSelectedProjectsEdit: boolean;
  setIsSelectedProjectsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  containerVariants: Variants;
  itemVariants: Variants;
}

const SelectedProjectsSection:React.FC<SelectedProjectsSectionPropps> = ({
  containerVariants,
  isSelectedProjectsEdit,
  itemVariants,
  setIsSelectedProjectsEdit


}) => {

  const navigate = useNavigate();

  return (
    <>
      <Title
        title={" Selected Projects"}
        isEdit={isSelectedProjectsEdit}
        onpressAdd={() => navigate('/user/edit/SelectedProjects')}
        onEditToggle={() => setIsSelectedProjectsEdit((prev) => !prev)}
      />

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-[72px] mb-20 md:mb-32 lg:mb-[140px]'
        variants={containerVariants}
      >
        {[SampleImage, SampleImage2, SampleImage4, SampleImage3].map((img, index) => (
          <motion.div
            key={index}
            className="h-[25rem] w-full flex items-center justify-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <PinContainer
              title="/youtube.com"
              href="https://twitter.com/mannupaaji"
            >
              <SelectedProjects img={img} isEdit={isSelectedProjectsEdit} />
            </PinContainer>
          </motion.div>
        ))}
      </motion.div>

    </>
  )
}

export default SelectedProjectsSection