export type OptionsItems = {
    id: number;
    name: string;
  };
  
  export type CountryListResponse = {
    status: boolean;
    message: string;
    data: OptionsItems[];
  };

  
  
export type CityListResponse = {
  status:boolean;
  message:string;
  data:OptionsItems[]
}