

const adminRoutesMap = {
    login:{
        path:'login',
        name:"Login"
    },
    candiates:{
        path:'candidates',
        name:'Candidates'
    },
    candidatesJobDetails:{
       path:'candidates/applicants/:id',
       name:'applicants'
    },
    allJobs:{
        path:'allJobs',
        name:'AllJobs'
    },
    allJobsDetails:{
        path:'allJobs/:id',
        name:"AllJobsDetails"
    },
    allJobsDetailApplicants:{
        path:'allJobs/details/applicants/:id',
        name:"AllJobsApplicants"
    },
    allJobsEditJob:{
        path:'allJobs/editJobs/:id',
        name:"AllJobsEdit"
    },
    activeJobs:{
        path:'activeJobs',
        name:'ActiveJobs'
    },
    expiredJobs:{
        path:'expiredJobs',
        name:'ExpiredJobs'
    },
    createNewJob:{
        path:'createNewJob',
        name:'CreateNewJob'
    },
    pushNotification:{
        path:'pushNotification',
        name:'PushNotification'
    }
}

export default adminRoutesMap;