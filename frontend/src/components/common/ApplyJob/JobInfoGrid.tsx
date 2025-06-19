import React from 'react';
import { Job } from '../../jobApply/ApplyJobCard';
import CLOCK from '@/assets/clock.svg';
import LOCATION from '@/assets/location.svg';
import LOCK from '@/assets/lock.svg';
import PEOPLE from '@/assets/people.svg';
import CONTACT from '@/assets/contact.svg';
import { SalaryInfo } from './SalaryInfo';
import InfoItem from './InfoItem';
import { formatDistanceToNow } from 'date-fns';

interface JobInfoGridProps {
  job: Job;
}

export const JobInfoGrid: React.FC<JobInfoGridProps> = ({ job }) => (
  <div className='grid gap-[14px] mb-[40px] grid-cols-2'>
    <SalaryInfo salary={job.display_salary} currency="" />
    <InfoItem icon={CLOCK} text={formatDistanceToNow(new Date(job.created_at), { addSuffix: true })} alt="Time" />
    <InfoItem icon={LOCATION} text={job.location || 'N/A'} alt="Location" />
    <InfoItem icon={LOCK} text={job.work_type || 'N/A'} alt="Schedule" />
    <InfoItem icon={PEOPLE} text={job.job_type || 'N/A'} alt="Job Type" />
    <InfoItem icon={CONTACT} text={`${job.experience_years || 0} Years of Experience`} alt="Experience" />
  </div>
); 