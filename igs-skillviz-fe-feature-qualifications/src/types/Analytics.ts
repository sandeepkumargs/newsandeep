export type Analytics =
  | Array<{
    top5categories: Array<{
      Rank: number;
      [key: string]: number;
      "Total Score": number;
    }>;
  }>
  | undefined;
