import InfoItem from "@/components/common/ApplyJob/InfoItem";
import SalaryInfoItem from "./SalaryInfoItem";
import LOCATION from '@/assets/location.svg';
import { useJobFormStore } from "@/state/zustand/create-job-store";
import LOCK from '@/assets/lock.svg';
import PEOPLE from '@/assets/people.svg';
import CONTACT from '@/assets/contact.svg';
import { JOB_TYPE_DATA, WORK_TYPE_DATA } from "@/constants/workTypeConstants";
import SkillsSection from "./SkillsSection";

const InfoGrid = () => {
    const { formData } = useJobFormStore();

   

    // Helper function to get label from value
    const getLabelFromValue = (value: string, options: {value: string, label: string}[]) => {
        const found = options.find(option => option.value === value);
        return found ? found.label : 'N/A';
    };

    return (
        <>
        <div className='grid gap-[27px] mt-[48px] mb-[10px] grid-cols-2'>
            <SalaryInfoItem/>
            <InfoItem 
                icon={LOCATION} 
                text={formData?.stepOne?.location || 'N/A'} 
                alt="Location" 
            />
            <InfoItem 
                icon={LOCK} 
                text={getLabelFromValue(formData?.stepOne?.work_type, WORK_TYPE_DATA)} 
                alt="Schedule" 
            />
            <InfoItem 
                icon={PEOPLE} 
                text={getLabelFromValue(formData?.stepOne?.job_type, JOB_TYPE_DATA)} 
                alt="Job Type" 
            />
            <InfoItem 
                icon={CONTACT} 
                text={`${formData?.stepThree?.experience_level || 0} Years of Experience`} 
                alt="Experience" 
            />
        </div>
        <SkillsSection skills={formData?.stepThree?.skills || []}/>
        </>
    );
}

export default InfoGrid;