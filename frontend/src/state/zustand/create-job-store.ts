// src/store/jobFormStore.ts
import { create } from 'zustand';

type FormData = {
  stepOne: {
    title: string;
    specialization: string;
    role: string;
    job_type: string;
    location: string;
    work_type: string;
    description: string;
  };
  stepTwo: {
    responsibilities: string;
    requirements: string;
    offered_benefits: string
  }; // Add your step two fields later
  stepThree: {
    salary_mode?: string;
    salary_type: string;
    salary_min?: string | undefined;
    salary_max?: string | undefined;
    is_salary_negotiable: boolean;
    project_duration?: string;
    skills?: string[];
    experience_level?: string;
    experience_years?: string;
    salary_fixed?: string;
    number_of_positions:number;
    last_application_date:string
  }; // Add your step three fields later
};

type JobFormStore = {
  formData: FormData;
  setStepOneData: (data: FormData['stepOne']) => void;
  setStepTwoData: (data: FormData['stepTwo']) => void;
  setStepThreeData: (data: FormData['stepThree']) => void;
  resetForm: () => void;
};

export const useJobFormStore = create<JobFormStore>((set) => ({
  formData: {
    stepOne: {
      title: '',
      specialization: '',
      role: '',
      job_type: '',
      location: '',
      work_type: '',
      description: ''
    },
    stepTwo: {
      responsibilities: '',
      requirements: '',
      offered_benefits: ''
    },
    stepThree: {
      salary_mode: '',
      salary_type: '',
      salary_min: '',
      salary_max: '',
      is_salary_negotiable: false,
      project_duration: '',
      skills: [],
      experience_level: '',
      experience_years: '',
      salary_fixed: '',
      number_of_positions:1,
      last_application_date:''
    }
  },
  setStepOneData: (data) => set((state) => ({ formData: { ...state.formData, stepOne: data } })),
  setStepTwoData: (data) => set((state) => ({ formData: { ...state.formData, stepTwo: data } })),
  setStepThreeData: (data) => set((state) => ({ formData: { ...state.formData, stepThree: data } })),
  resetForm: () => set({
    formData: {
      stepOne: {
        title: '',
        specialization: '',
        role: '',
        job_type: '',
        location: '',
        work_type: '',
        description: ''
      },
      stepTwo: {
        responsibilities: '',
        requirements: '',
        offered_benefits: ''
      },
      stepThree: {
        salary_mode: '',
        salary_type: '',
        salary_min: '',
        salary_max: '',
        is_salary_negotiable: false,
        project_duration: '',
        skills: [],
        experience_level: '',
        experience_years: '',
        salary_fixed: '',
        number_of_positions:0,
        last_application_date:''
      }
    }
  })
}));