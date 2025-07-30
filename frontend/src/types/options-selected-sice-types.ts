export type OptionsItems = {
    id: number;
    name: string;
  };

  export type SkillsItems = {
    id: number;
    title: string;
  };

  export type ExperienceItems = {
      id: number;
      level: string;
  }
  
  export type CountryListOptionsResponse = {
    status: boolean;
    message: string;
    data: OptionsItems[];
  };

  
  
export type CityListsOptionsResponse = {
  status:boolean;
  message:string;
  data:OptionsItems[]
}

export type SpecializationsListsOptionsResponse = {
  status:boolean;
  message:string;
  data:OptionsItems[]
}

export type RolesListsOptionsResopnse = {
  status:boolean;
  message:string;
  data:OptionsItems[]
}

export type SkillListsOptionsResponse = {
  status:boolean;
  message:string;
  data:SkillsItems[]
}


export type ExperiencesOptionsResponse = {
  status:boolean;
  message:string;
  data:ExperienceItems
}