import { IconEdit } from "@tabler/icons-react";
import { useQuery } from "../../../hooks/useQuery";
import cx from "classix";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../../../hooks/useData";
import { useImmer } from "use-immer";
import ky from "ky";
import localforage from "localforage";

const tableHeads = ["Skillset", "No", "Beginner", "Intermediate", "Advanced", "Expert"];

function UpdateSkills() {
  const navigate = useNavigate();

  const params = useQuery();

  const [selectedSkill, setSelectedSkill] = useState<string | null | undefined>(params.get("skill"));

  const { data, setData } = useData();

  const categoriesData = data?.skills_master.categories?.filter((category) => category.name !== "Certification");

  const [categories, setCategories] = useImmer(categoriesData);

  const selectedCategory = useMemo(
    () => categories?.filter((category) => category.name === selectedSkill)[0] ?? categories?.[0],
    [selectedSkill, categories],
  );

  const categoryRef = useRef<HTMLButtonElement | null>(null);

  const [loading, setLoading] = useState(false);

  const updatedSkills = (subCatIdx: number, concernIdx: number, score: number) => {
    setCategories((draft) => {
      draft?.forEach((category) => {
        if (category.name === selectedCategory?.name) {
          category["sub-category"][subCatIdx].concern[concernIdx].score = score;
          category.my_score = category["sub-category"]
            .flatMap((subCat) => subCat.concern)
            .reduce((acc, current) => acc + current.score, 0);
          return;
        }
        category;
      });
    });
  };

  useEffect(() => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="flex h-[90%] w-fit flex-col gap-4 rounded-md bg-white p-4">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-2xl">Update Your Skills</h2>
      </div>
      <div className="flex h-[92%] flex-col gap-4">
        <div className="flex h-inherit gap-4">
          <div className="relative overflow-auto">
            <h3 className="sticky top-0 bg-white p-2 text-center text-xl">Categories</h3>
            <div className="flex min-w-[250px] flex-col overflow-auto rounded-md border">
              {categoriesData?.map((category) => (
                <button
                  key={category.name}
                  ref={category.name === selectedSkill ? categoryRef : null}
                  type="button"
                  className={cx(
                    "inline-flex items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium capitalize text-primary hover:bg-orange-100 hover:text-secondary disabled:pointer-events-none disabled:opacity-50",
                    category.name === selectedSkill && "bg-orange-100 text-secondary",
                  )}
                  onClick={() => setSelectedSkill(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="p-2 text-xl">Sub-Categories</h3>
            <div className="h-[92.5%] flex-grow overflow-auto">
              <table className="w-full border">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr className="relative z-10">
                    {tableHeads.map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="sticky top-0 bg-gray-50 px-6 py-3 text-start text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="relative divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedCategory?.["sub-category"].map((subcategory, subCatIdx) => (
                    <Fragment key={subCatIdx}>
                      <tr className="sticky top-[45px] z-10 bg-gray-200">
                        <td
                          colSpan={6}
                          className="px-4 py-2 text-start text-sm capitalize text-gray-600 dark:text-gray-500"
                        >
                          {subcategory.name}
                        </td>
                      </tr>
                      {subcategory.concern.map((concern, concernIdx) => (
                        <tr key={concernIdx}>
                          <td className="max-w-52 whitespace-break-spaces px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {concern.name}
                          </td>
                          {tableHeads
                            .filter((head) => head !== "Skillset")
                            .map((th, score) => (
                              <td key={th} className="whitespace-nowrap px-6 py-4 text-center">
                                <input
                                  type="radio"
                                  name={`hs-radio-group-${concern.name}`}
                                  checked={concern.score === score}
                                  className="mt-0.5 shrink-0 cursor-pointer rounded-full border-gray-400 text-primary focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                                  value={score}
                                  id={`${concern.name}-${score}`}
                                  onChange={() => updatedSkills(subCatIdx, concernIdx, score)}
                                />
                              </td>
                            ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={() => navigate("/my-skills")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={async () => {
              setLoading(true);
              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}/1234ABC`,
                  { json: { skills_master: { ...data?.skills_master, categories } } },
                )
                .json();
              setLoading(false);

              if (response.Status === "OK") {
                localforage.setItem("userData", { skills_master: { ...data?.skills_master, categories } });
                setData({
                  skills_master: {
                    user: data?.skills_master.user,
                    experience: data?.skills_master.experience,
                    categories,
                  },
                });
                navigate("/my-skills");
              }
            }}
          >
            <span
              className={cx(
                "inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white",
                !loading && "hidden",
              )}
              role="status"
              aria-label="loading"
            />
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default UpdateSkills;
