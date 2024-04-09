export const radarOptions = (categories: Array<string>): ApexCharts.ApexOptions => ({
  dataLabels: {
    enabled: true,
    formatter(val) {
      if (val instanceof Array) return val[0];
      if (val) return val;
      return "Update your skills";
    },
  },
  plotOptions: {
    radar: {
      size: 140,
      polygons: {
        strokeColors: "#e9e9e9",
        fill: {
          colors: ["#f8f8f8", "#fff"],
        },
      },
    },
  },
  colors: ["#F16729"],
  markers: {
    size: 4,
    colors: ["#fff"],
    strokeColors: "#F16729",
    strokeWidth: 2,
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return val;
      },
    },
  },
  xaxis: { categories },
  yaxis: {
    tickAmount: 10,
    labels: {
      formatter: function (val: any, i: number) {
        if (i % 2 === 0) {
          return val;
        } else {
          return "";
        }
      },
    },
  },
});

export const radarSeries = (data: any) => [{ name: "Score", data }];
