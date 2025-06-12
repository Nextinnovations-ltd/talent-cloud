import React, { useEffect, useState } from "react";
import ApplyJobCard, { Job } from "@/components/jobApply/ApplyJobCard";
import { ApplyJobSideBar } from "@/components/jobApply/ApplyJobSideBar";
import ApplyJobCardSkeleton from "@/components/jobApply/ApplyJobSkeleton";
import { PostUploadedCombo } from "@/components/jobApply/PostUploadedCombo";

const mockJobs: Job[] = [
  { 
    id: 1, 
    title: "Frontend Developer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'50,000-1,000,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Figma','Photoshop','Illustrator','Docker'],
    companyName:'Molax Co, Ltd.',
    created_at:'an hour ago',
    applicants:'20' 
  },
  { 
    id: 2, 
    title: "Backend Developer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'50,000-1,000,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Node.js','Express.js','MongoDB','AWS'],
    companyName:'Tech Solutions Inc.',
    created_at:'3 hours ago',
    applicants:'15' 
  },
  { 
    id: 3, 
    title: "DevOps Engineer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'70,000-1,200,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Kubernetes','Jenkins','Ansible','Terraform'],
    companyName:'Cloud Innovations',
    created_at:'yesterday',
    applicants:'10' 
  },
  { 
    id: 4, 
    title: "UI/UX Designer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'45,000-900,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Figma','Sketch','Adobe XD','User Research'],
    companyName:'Creative Minds Studio',
    created_at:'2 days ago',
    applicants:'25' 
  },
  { 
    id: 5, 
    title: "Data Scientist", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'80,000-1,500,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Python','R','Machine Learning','SQL'],
    companyName:'Analytics Hub',
    created_at:'4 days ago',
    applicants:'18' 
  },
  { 
    id: 6, 
    title: "Mobile App Developer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'60,000-1,100,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['React Native','Swift','Kotlin','Firebase'],
    companyName:'Innovate Apps',
    created_at:'1 week ago',
    applicants:'30' 
  },
  { 
    id: 7, 
    title: "Marketing Specialist", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'40,000-800,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['SEO','SEM','Content Marketing','Social Media'],
    companyName:'Growth Strategies',
    created_at:'5 days ago',
    applicants:'22' 
  },
  { 
    id: 8, 
    title: "Customer Support Representative", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'30,000-600,000',
    salaryCurrency:'MMK/month',
    jobType:'Part Time',
    skills:['Communication','Problem Solving','CRM Software','Empathy'],
    companyName:'Client Care Solutions',
    created_at:'6 days ago',
    applicants:'40' 
  },
  { 
    id: 9, 
    title: "Graphic Designer", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'35,000-750,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Adobe Photoshop','Illustrator','InDesign','Typography'],
    companyName:'Visual Arts Agency',
    created_at:'1 week ago',
    applicants:'12' 
  },
  { 
    id: 10, 
    title: "Project Manager", 
    description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati ut porro, optio placeat magnam voluptatum blanditiis minima delectus voluptates aspernatur neque quas eaque expedita, molestiae impedit! Distinctio vel illo numquam.",
    img:'https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo-2006.png',
    salary:'65,000-1,300,000',
    salaryCurrency:'MMK/month',
    jobType:'Full Time',
    skills:['Agile','Scrum','Jira','Leadership'],
    companyName:'Synergy Projects',
    created_at:'8 days ago',
    applicants:'10' 
  },
];

export const Home: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(false);
      clearInterval(interval); // simulate fetch delay
      // Simulate fetched data
      setJobs(mockJobs); // replace mockJobs with actual data
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, []);

 

 

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  return (
   <div>
    <div className="container mx-auto mb-[50px] items-center  p-4 flex justify-between">
      <h3>128 job opportunities waiting.</h3>
      <PostUploadedCombo/>
    </div>
     <div className="flex  gap-[40px] pb-[200px] container  mx-auto flex-col lg:flex-row  p-4">
      
      <div
     className={`grid  mx-auto justify-center items-center transition-all  gap-[36px] duration-300 ${
       selectedJob
         ? "grid-cols-1 " // center in 1-column view
         : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
     }`}
   >
   
   {loading
           ? Array.from({ length: 6 }).map((_, index) => (
               <ApplyJobCardSkeleton key={index} />
             ))
           : jobs.map((job) => (
             <ApplyJobCard 
             key={job.id} 
             job={job} 
             onClick={handleJobClick} 
             isSelected={selectedJob?.id === job.id}
           />
             ))}
     
   </div>
     {selectedJob && (
     <ApplyJobSideBar selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
   )} 
   
       </div>
   </div>
  );
};
