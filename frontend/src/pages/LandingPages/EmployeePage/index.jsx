import React from 'react'
import './index.css'
import Whatugot from '@/components/landingPages/Employee/Whatugot'
import TalentCloudSay from '@/components/landingPages/Employee/TalentCloudSay'
import TalentCloudDone from '@/components/landingPages/Employee/TalentCloudDone'
import WorkingEnviroment from '@/components/landingPages/Employee/WorkingEnviroment'
import JobMatch from '@/components/landingPages/Employee/JobMatch'
import HowWork from '@/components/landingPages/Employee/HowWork'
import FAQ from '@/components/landingPages/FAQ'
import JoinBanner from '../../../components/landingPages/Employee/JoinBanner'
import WhoCanApply from '../../../components/landingPages/Employee/WhoCanApply'
import WhyJoinTC from '../../../components/landingPages/Employee/WhyJoinTC'
import HeroSection from '../../../components/landingPages/Employee/HeroSection'
import Footer from '../../../components/landingPages/Footer'
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
      <TalentCloudDone />
      <JoinBanner/>
      <WorkingEnviroment /> 
      <JobMatch />
      <HowWork />
      <JoinBanner/>
   <FAQ/>
   <Footer/>
    </div>
  )
}

export default EmployeePage