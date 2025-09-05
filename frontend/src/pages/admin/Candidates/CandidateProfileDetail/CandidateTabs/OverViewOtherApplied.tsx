import AppliedJobsCard from './AppliedJobsCard';


type OverViewOtherAppliedProps = {
    otherAppliedData: {
        job_id: number;
        position: string;
        applicant_count: string;
        applied_date: string; // ISO timestamp
        company: string;
        skills: string[];
        salary: string ;
      }[];
}

 const OverViewOtherApplied:React.FC<OverViewOtherAppliedProps> = ({otherAppliedData}) => {

  return (
    <div className="grid grid-cols-3  gap-[32px]">
       {
        otherAppliedData?.map((e)=>  <AppliedJobsCard 
        position={e.position} 
        company={e.company} 
        salary={e.salary} 
        job_id={e.job_id}
        skills={e.skills} 
        applied_date={e.applied_date} />)
       }
    </div>
  )
}

export default OverViewOtherApplied;
