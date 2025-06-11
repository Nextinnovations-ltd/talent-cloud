

interface SelectedProjectsProps {
    img: string;
}

export const SelectedProjects = ({ img }: SelectedProjectsProps) => {
    return (
        <div className='w-[500px] bg-white text-[#FFFFFF] rounded-[20px]'>
            <img className='h-[330px]' src={img} alt="Project" />
            <h1 className='text-[26px] text-[#05060F] font-[600] mt-[30px]'>Release Clinic</h1>
            <p className='text-[14px] text-[#6B6B6B] mt-[14px]'>Japanese No.1 Release Clinic Product</p>
        </div>
    );
}; 