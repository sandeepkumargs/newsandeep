import { IconCirclePlus, IconEdit } from "@tabler/icons-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

const tableHeads = ["University", "Degree", "Specialization", "Year of Passing", "Edit"];

function MyEducation() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.title = "SkillViz | My Experience";
  }, []);

  return (
    <>
      <section className="flex w-fit flex-col gap-4 rounded-md bg-white p-4">
        <div className="flex justify-between gap-14">
          <div className="flex items-center gap-2">
            <IconEdit />
            <h2 className="text-2xl">Update Your Educational Qualifications</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-x-1 rounded-lg border border-gray-200 p-2 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
            onClick={() => navigate("/my-education/update/add")}
          >
            Add More <IconCirclePlus style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div className="flex flex-col overflow-auto">
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
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700"></tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default MyEducation;
