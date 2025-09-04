

const Educations = () => {
  return (
    <div className="grid grid-cols-2 mt-[72px] gap-[100px]">
            <EducationsCard />
            <EducationsCard />
            <EducationsCard />
            <EducationsCard />

        </div>
  )
}


const EducationsCard = () => {

  return (
      <div>
          <img className="rounded-full w-[96px] object-cover h-[96px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GY4c-F31rNDs5mpa2NMEPMVSsk4aZedd1g&s" />

          <h3 className="mt-[32px] font-semibold text-[20px] mb-[20px]">Bachelor of Engineering in 
          Information Technology</h3>

          <h3 className="mb-[16px] text-[18px] font-[500px]">West Yangon Technological University</h3>

          <p className="text-[#6B6B6B] mb-[30px]">Mar 2025 - Present</p>

          <p className="text-[#6B6B6B] text-[18px] leading-[28px]">During my time at university, I was involved in various hands-on  projects, which gave me practical experience in conducting user  research, developing </p>
      </div>
  )
}


export default Educations;
