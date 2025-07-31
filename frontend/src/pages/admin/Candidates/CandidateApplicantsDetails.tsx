import { useGetAllApplicantsQuery } from '@/services/slices/adminSlice';
import CandidateApplicantsInfo from './CandidateApplicantsInfo'
import { useParams } from 'react-router-dom';

 const CandidateApplicantsDetails = () => {
    const { id } = useParams();

    const {data,isLoading} = useGetAllApplicantsQuery(id);

    console.log("kdkdkdkdke23232323")
    console.log("kdkdkd")
    console.log(data)
    console.log("kdkdkd")


  return (
    <div>
        <CandidateApplicantsInfo/>
    </div>
  )
}

export default CandidateApplicantsDetails;