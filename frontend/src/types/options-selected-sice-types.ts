export type OptionsItems = {
    id: number;
    name: string;
  };
  
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

