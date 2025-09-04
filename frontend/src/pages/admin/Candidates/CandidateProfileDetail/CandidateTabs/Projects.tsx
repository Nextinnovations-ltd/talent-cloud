const Projects = () => {
    return (
        <div className="grid grid-cols-2 gap-[35px] mt-[72px]">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />

        </div>
    )
}


const ProjectCard = () => {
    return <div className="w-[490px] ">
        <img height={293} className="w-full rounded-[17px]" src="https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?cs=srgb&dl=pexels-francesco-ungaro-1525041.jpg&fm=jpg" />

        <div>
            <h3 className="text-[24px] font-semibold mt-[26px] mb-[12px]">
                Release Clinic
            </h3>
            <p className="text-[#6B6B6B]">
                Japanese No.1 Release Clinic Product
            </p>
        </div>
    </div>
}

export default Projects;
