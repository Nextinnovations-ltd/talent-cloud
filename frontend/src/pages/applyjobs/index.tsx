import { JobInfoGrid } from "@/components/common/ApplyJob/JobInfoGrid"
import { SkillsSection } from "@/components/common/ApplyJob/SkillsSection"
import ApplyCoverLetter from "@/components/jobApply/ApplyCoverletter"
import ApplyJobResume from "@/components/jobApply/ApplyJobResume"
import { Link } from "react-router-dom"


 const jobDetails = {
    "id": 19,
    "title": "Project Manager",
    "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    "responsibilities": null,
    "requirements": null,
    "offered_benefits": null,
    "location": "Yangon, Myanmar",
    "specialization": "Illustrator - None",
    "role": null,
    "skills": [
        "MySQL",
        "JQuery",
        "Wordpress",
        "React Native"
    ],
    "experience_level": "Mid Level",
    "experience_years": null,
    "job_type": "Full Time",
    "work_type": "Onsite",
    "number_of_positions": 2,
    "salary_mode": "Fixed",
    "salary_type": "month",
    "salary_min": "2000000.00",
    "salary_max": null,
    "salary_fixed": null,
    "is_salary_negotiable": true,
    "project_duration": null,
    "last_application_date": null,
    "is_accepting_applications": true,
    "view_count": 1,
    "applicant_count": 0,
    "bookmark_count": 1,
    "company": {
        "id": 5,
        "name": "Next Innovations",
        "description": "We are Next Innovations Japanese Company located in Myanmar specialized in IT field which provide high quality and innovative web designs, web marketing and video production services with our professional teams and satisfied customers. Our Company have been funded by Mr.Yuta Mukai from 2020 and our business have made more than 2,000 brands in both local and japan. We are aiming to be No.1 in IT field and to satisfy every single customer.",
        "image_url": "https://next-innovations.ltd/wp-content/uploads/2023/05/logo-fb.jpg",
        "industry": 1,
        "size": "1-10",
        "founded_date": "2020-01-01",
        "is_verified": true
    },
    "job_poster_name": null,
    "is_bookmarked": true,
    "created_at" : "2025-06-17T02:14:27.296680Z",
    'display_salary': "Not specified"
}
 
 const ApplyJob = () => {
  return (
    <div className="container mx-auto">
        <div className="max-w-[600px]  pt-[50px]  ml-[25%]">
        <h3 className="text-[24px] mb-[24px] font-semibold">{jobDetails?.title }</h3>
        
        {/* <CompanyHeader companyLogo={null} companyName={jobDetails?.company?.name || ''} /> */}
        <JobInfoGrid job={jobDetails} />
        <SkillsSection skills={jobDetails?.skills || []} />
        <Link to={''}>
        <h3 className=" underline text-[#0481EF] text-[18px]">View Full Job Description </h3>
        </Link>

        <ApplyJobResume/>
        <ApplyCoverLetter/>

        </div>
    </div>
  )
}

export default ApplyJob