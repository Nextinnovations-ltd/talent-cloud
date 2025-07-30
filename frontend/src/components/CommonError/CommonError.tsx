import { motion } from "framer-motion"
import EMPTY from '@/assets/EmptyState.png'
import { PrimaryButton } from "../common/PrimaryButton";

interface CommonErrorProps {
  image?: string;
  title?: string;
  description?: string;
  action?: boolean;
  handleAction?: () => void;
  actionText?: string;
}

const CommonError = ({
  image = EMPTY,
  title = "No Jobs",
  description = "Try adjusting your search to find what you are looking for",
  action =false,
  handleAction = ()=>{},
  actionText = ''
  
}: CommonErrorProps) => {
  return (
    <motion.div
      className="col-span-full  flex flex-col items-center justify-center text-center text-gray-500 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img src={image} width={240} />
      <h3 className="text-[28px] text-black font-semibold mt-[10px] mb-[15px]">{title}</h3>
      <p>{description}</p>
      {
        action && (
        <PrimaryButton
          width={'w-[120px] mt-4 rounded-full'}
          title={actionText}
          handleClick={handleAction}
          isButtonDisabled={false}
        />
      )}
     
    </motion.div>
  )
}

export default CommonError
