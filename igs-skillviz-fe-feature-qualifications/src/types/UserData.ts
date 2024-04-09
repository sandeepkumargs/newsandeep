import { Analytics } from "./Analytics";
import type { Categories } from "./Categories";
import { Certification } from "./Certificate";
import { Experience } from "./Experience";
import { User } from "./User";

export type UserData = {
  skills_master: {
    user?: User;
    analytics?: Analytics;
    categories?: Categories;
    experience?: Experience;
    certification?: Certification
  };
};
