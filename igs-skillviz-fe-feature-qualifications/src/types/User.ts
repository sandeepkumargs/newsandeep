export type User = {
  u_id: string;
  name: string;
  details: {
    designation: {
      d_id: string;
      name: string;
    };
    experience: number;
  };
} | undefined;
