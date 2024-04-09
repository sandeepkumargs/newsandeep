export type Categories = Array<{
  name: string;
  total_score: number;
  my_score: number;
  "sub-category": Array<{
    name: string;
    concern: Array<{
      name: string;
      score: number;
    }>;
  }>;
}> | undefined;
