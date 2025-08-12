import TotalCard from './TotalCard';
import RecentJobCard from './RecentJobCard';
import SearchBox from './SearchBox';

const Index = () => {
    return (
        <div className='max-w-[1300px] mx-auto space-y-7 my-5'>
            <TotalCard/>
            <RecentJobCard/>
            
            <SearchBox/>
        </div>
    );
}

export default Index;
