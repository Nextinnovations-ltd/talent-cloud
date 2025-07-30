import TotalCard from './TotalCard';
import RecentJobCard from './RecentJobCard';
import RecentApplicant from './RecentApplicant';
import TableRow from './TableRow';
import JobCard from './JobCard';
import SearchBox from './SearchBox';

const Index = () => {
    return (
        <div className='max-w-[1300px] mx-auto space-y-7 my-5'>
            <TotalCard/>
            <RecentJobCard/>
            <RecentApplicant/>
            <TableRow/>
            <JobCard/>
            <SearchBox/>
        </div>
    );
}

export default Index;
