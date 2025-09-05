import Building from '@/assets/svgs/carbon_building.svg'
import SvgCalender from '@/assets/svgs/SvgCalender';
import SvgDoller from '@/assets/svgs/SvgDoller';
import SKILLS from '@/assets/Skills.svg'
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';


type AppliedJobsCardProps = {
    position: string;
    company: string;
    salary: string;
    skills: string[],
    applied_date: string,
    job_id: number;

}

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



const AppliedJobsCard: React.FC<AppliedJobsCardProps> = ({ position, company, salary, skills, applied_date,job_id }) => {

    const navigate=useNavigate();

    return (
        <div className=" min-h-[264px] min-w-[291px] border border-[#CBD5E1] p-3 rounded-xl">
            <p className="text-[#575757] text-[14px]">Position</p>
            <h3 className="text-[16px] mt-2">{position}</h3>

            <div className='my-[12px] space-y-4'>
                <div className='flex text-[12px]   items-center  gap-[12px]'>
                    <img width={16} height={16} src={Building} />
                    <p className='text-[#575757]'>{company}</p>
                </div>
                <div className='flex text-[12px]   items-center  gap-[12px]'>
                    <SvgCalender />
                    <p className='text-[#575757]'>Applied : <span className='text-[#0481EF]'>{formatDate(applied_date)}</span></p>
                </div>
                <div className='flex text-[12px]   items-center  gap-[12px]'>
                    <SvgDoller />
                    <p className='text-[#575757]'>{salary}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 mb-[24px]">
                <img width={18} height={18} src={SKILLS} />
                <div className="text-[#6B6B6B] flex flex-wrap gap-2 items-center">
                    {skills.slice(0, 2).map((item, index) => (
                        <Badge
                            key={index}
                            className={`border px-[10px] capitalize bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black max-w-[110px] `}
                        >
                            <p className="truncate">{item}</p>
                        </Badge>
                    ))}
                    {skills.length > 2 && (
                        <Badge className={`border px-[10px] bg-[#F2F2F2] rounded-[8px] py-[4px] text-[14px] font-normal text-black truncate max-w-[120px] `}>
                            ...
                        </Badge>
                    )}
                </div>
            </div>

            <button onClick={()=> navigate(`/admin/dashboard/allJobs/${job_id}`)} className='border rounded-[25px] text-[12px] w-full text-[#0481EF]  p-[10px]'>View Details Job</button>

            <div>
            </div>
        </div>
    )
}

export default AppliedJobsCard;
