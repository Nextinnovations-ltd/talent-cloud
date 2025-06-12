import React from 'react';
import { Job } from '../../jobApply/ApplyJobCard';
import CLOCK from '@/assets/clock.svg';
import LOCATION from '@/assets/location.svg';
import LOCK from '@/assets/lock.svg';
import PEOPLE from '@/assets/people.svg';
import CONTACT from '@/assets/contact.svg';
import { SalaryInfo } from './SalaryInfo';
import InfoItem from './InfoItem';

interface JobInfoGridProps {
  job: Job;
}

export const JobInfoGrid: React.FC<JobInfoGridProps> = ({ job }) => (
  <div className='grid gap-[14px] mb-[40px] grid-cols-2'>
    <SalaryInfo salary={job.salary} currency={job.salaryCurrency} />
    <InfoItem icon={CLOCK} text={job.created_at} alt="Time" />
    <InfoItem icon={LOCATION} text="Any Country" alt="Location" />
    <InfoItem icon={LOCK} text="Flexible Schedule" alt="Schedule" />
    <InfoItem icon={PEOPLE} text={job.jobType} alt="Job Type" />
    <InfoItem icon={CONTACT} text="3-6 Years of Experience" alt="Experience" />
  </div>
); 