import { IconEdit } from "@tabler/icons-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../hooks/useData";

const tableHeads = ["Certification Name", "Date of Completion", "Edit"];

function MyCertification() {
  const navigate = useNavigate();

  const { data } = useData();

  const certification = data?.skills_master.certification;

  useLayoutEffect(() => {
    document.title = "SkillViz | My Experience";
  }, []);

  return (
    <>
      <section className="flex h-[90%] w-fit flex-col gap-4 rounded-md bg-white p-4">
        <div className="flex justify-between gap-14">
          <div className="flex items-center gap-2">
            <IconEdit />
            <h2 className="text-2xl">Update Your Certifications</h2>
          </div>
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
                {certification?.map((certificate, idx) => (
                  <tr key={certificate.c_name}>
                    <td className="px-6 py-3 text-start text-sm capitalize text-gray-600 dark:text-gray-500">
                      {certificate.c_name}
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      {certificate.doc ?? "-"}
                    </td>
                    <td className="px-6 py-3 text-center text-sm capitalize text-gray-600 dark:text-gray-500">
                      <button
                        type="button"
                        className="rounded-full hover:bg-gray-100"
                        onClick={() => navigate(`/my-certification/update/edit?certificate=${idx}`)}
                      >
                        <IconEdit />
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

export default MyCertification;
