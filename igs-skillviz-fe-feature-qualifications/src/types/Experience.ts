import { DateType } from "react-tailwindcss-datepicker";

export type ExperienceType = {
  company_name: string;
  designation: string;
  domain: string;
  start_date: DateType | undefined;
  end_date: DateType | undefined;
};

export type Experience = Array<ExperienceType> | undefined;
