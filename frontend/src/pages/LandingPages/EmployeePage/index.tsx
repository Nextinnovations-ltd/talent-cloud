import './index.css'
import FAQ from '@/components/landingPages/FAQ'
import Whatugot from '@/components/landingPages/Employee/Whatugot'
import UpdatedFooter from '@/components/landingPages/UpdatedFooter'
import HeroSection from '@/components/landingPages/Employee/HeroSection'
import WhyJoinTC from '@/components/landingPages/Employee/WhyJoinTC'
import WhoCanApply from '@/components/landingPages/Employee/WhoCanApply'
import JoinBanner from '@/components/landingPages/Employee/JoinBanner'
import HowWork from '@/components/landingPages/Employee/HowWork'
import JobMatch from '@/components/landingPages/Employee/JobMatch'
import WorkingEnviroment from '@/components/landingPages/Employee/WorkingEnviroment'
import TalentCloudSay from '@/components/landingPages/Employee/TalentCloudSay'


const EmployeePage = () => {
  return (
    <div>
      <HeroSection/>
      <JoinBanner/>
      <WhyJoinTC/>
     <WhoCanApply />
      <JoinBanner/>
      <Whatugot />
      <TalentCloudSay />
{/*       <TalentCloudDone /> */}
      <JoinBanner/>
      <WorkingEnviroment /> 
      <JobMatch />
      <HowWork />
      <JoinBanner />
      <FAQ />
     <UpdatedFooter />
    </div>
  )
}

export default EmployeePage