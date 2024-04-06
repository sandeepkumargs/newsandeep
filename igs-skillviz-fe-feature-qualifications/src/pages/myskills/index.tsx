import { IconEdit, IconPencil } from "@tabler/icons-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";

const tableHeads = ["Skillset", "Score", "Edit"];

function MySkills() {
  const navigate = useNavigate();

  const { data } = useData();

  const categories = data?.skills_master.categories?.filter((category) => category.name !== "Certification");

  useLayoutEffect(() => {
    document.title = "SkillViz | My Skills";
  }, []);

  return (
    <>
      <section className="flex h-[90%] w-fit flex-col gap-4 rounded-md bg-white p-4">
        <div className="flex items-center gap-2">
          <IconEdit />
          <h2 className="text-2xl">Update Your Skills</h2>
        </div>
        <div className="flex h-full flex-col overflow-auto">
          <div className="flex-grow rounded-md">
            <table className="relative w-full border">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {tableHeads.map((head) => (
                    <th
                      key={head}
                      scope="col"
                      className="sticky top-0 bg-gray-50 px-6 py-3 text-start text-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories?.map((category) => (
                  <tr key={category.name}>
                    <td className="min-w-80 whitespace-nowrap px-6 py-4 text-sm font-medium capitalize text-gray-800 dark:text-gray-200">
                      {category.name}
                    </td>
                    <td className="min-w-40 whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                      {category.my_score}/{category.total_score}
                    </td>
                    <td className="min-w-20 whitespace-nowrap px-6 py-4 text-end text-sm font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        onClick={() => navigate(`/my-skills/update?skill=${category.name}`)}
                      >
                        <IconPencil style={{ color: "grey" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default MySkills;
