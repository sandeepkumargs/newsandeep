import { useEffect, useLayoutEffect, useState } from "react";
import { IconAugmentedReality, IconBulb, IconHierarchy3 } from "@tabler/icons-react";
import HorizontalFlow from "../../components/Hierarchy";
import ReactApexChart from "react-apexcharts";
import { radarOptions, radarSeries } from "../../components/Charts/Radar/config";
import { useData } from "../../hooks/useData";
import { pieOptions } from "../../components/Charts/Pie/config";

function Dashboard() {
  const { data } = useData();

  const user = data?.skills_master.user;

  const score = data?.skills_master.categories?.map((category) =>
    Math.round((category.my_score / category.total_score) * 100),
  );

  const [categories, setCategories] = useState(data?.skills_master.categories?.map((category) => category.name));

  useEffect(() => {
    setCategories(data?.skills_master.categories?.map((category) => category.name));
  }, [data]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Dashboard";
  }, []);

  return (
    <>
      <section className="flex flex-col gap-4 rounded-md bg-white p-6">
        <div className="flex items-center gap-2">
          <IconAugmentedReality />
          <h2 className="text-2xl">Overview</h2>
        </div>
        <div className="flex items-center gap-10 rounded-md bg-gray-100 px-10 py-5">
          <span className="inline-flex size-32 items-center justify-center rounded-full bg-gray-500 text-2xl font-medium leading-none text-white">
            AT
          </span>
          <div className="flex flex-col">
            <span className="text-xl">{user?.name}</span>
            <span className="text-xl">{user?.details.designation.name}</span>
            <span className="text-xl">{user?.details.experience} year(s) of experience</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-4 rounded-md bg-white p-6">
        <div className="flex items-center gap-2">
          <IconHierarchy3 />
          <h2 className="text-2xl">Career Path</h2>
        </div>
        <div className="h-96">
          <HorizontalFlow />
        </div>
      </section>
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-6 place-items-center gap-2 rounded-md bg-white p-8">
          <div className="flex items-center gap-2 pb-4">
            <IconBulb />
            <h2 className="text-2xl">Top 5 Skills</h2>
          </div>
          <div className="flex max-h-[340px] flex-col gap-2 overflow-auto">
            {data?.skills_master.analytics
              ?.find((analytic) => "top5categories" in analytic)
              ?.top5categories.map((skill) => {
                const keys = Object.keys(skill);
                return (
                  <div key={keys[1]} className="rounded-lg bg-gray-100 p-4 text-lg">
                    {keys[1]}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-span-6 place-items-center gap-2 rounded-md bg-white p-8">
          <div className="flex items-center gap-2 pb-4">
            <IconBulb />
            <h2 className="text-2xl">Certification</h2>
          </div>
          <div className="flex max-h-[340px] flex-col gap-2 overflow-auto">
            <div className="rounded-lg bg-gray-100 p-4 text-lg">ISTQB Foundation</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">Scrum Master Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">Katalon Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">Selenium Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">TOSCA Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">TOSCA Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">TOSCA Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">TOSCA Certification</div>
            <div className="rounded-lg bg-gray-100 p-4 text-lg">TOSCA Certification</div>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap justify-between rounded-md bg-white p-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 pb-10">
            <IconBulb />
            <h2 className="text-2xl">Skills Spider</h2>
          </div>
          <ReactApexChart
            options={radarOptions(categories || [])}
            series={radarSeries(score?.length ? score : [null])}
            type="radar"
            width={600}
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 pb-10">
            <IconBulb />
            <h2 className="text-2xl">Skills Distribution</h2>
          </div>
          <ReactApexChart
            options={pieOptions(score?.length ? categories : [])}
            series={score?.length ? score : []}
            type="pie"
            width={500}
          />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
