const Experience = () => {
    return (
        <div className="grid grid-cols-2 mt-[72px] gap-[100px]">
            <ExperienceCard />
            <ExperienceCard />
            <ExperienceCard />
            <ExperienceCard />

        </div>
    )
}

const ExperienceCard = () => {

    return (
        <div>
            <img className="rounded-full object-cover w-[96px] h-[96px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVCJpAHzn91VMfwirwAbAmV-ONO02UjmCj2w&s" />

            <h3 className="mt-[32px] font-semibold text-[26px] mb-[20px]">Mid Level UI/UX Designer</h3>

            <h3 className="mb-[16px] text-[18px] font-[500px]">Next Innovations</h3>

            <p className="text-[#6B6B6B] mb-[30px]">Mar 2025 - Present</p>

            <p className="text-[#6B6B6B] leading-[28px]">Collaborated with the development team to implement a responsive design  approach, improving the mobile user experience and increasing mobile app engagement.</p>
        </div>
    )
}

export default Experience;