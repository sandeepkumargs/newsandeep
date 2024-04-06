import { IconCalendarDue, IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const experienceForm = [
  { label: "University Name", type: "input", state: "company" },
  { label: "Degree", type: "input", state: "designation" },
  { label: "Specialization", type: "input", state: "domain" },
  { label: "Year of Passing", type: "datepicker", state: "yop" },
];

function UpdateEducation() {
  const navigate = useNavigate();

  const { data, setData } = useData();

  const { type } = useParams();

  const [company_name, setCompany] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [domain, setDomain] = useState<string>("");

  const [yop, setYOP] = useState<Date | null>(new Date());

  const [, setLoading] = useState(false);

  const updateInput = (state: string, value: string) => {
    if (state === "company") setCompany(value);
    if (state === "designation") setDesignation(value);
    if (state === "domain") setDomain(value);
  };

  return (
    <section className="flex w-fit flex-col gap-4 rounded-md bg-white p-6">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-2xl capitalize">{type} Your Educational Qualification</h2>
      </div>
      <div className="flex flex-col gap-8 px-16 py-8">
        <div className="flex flex-col gap-4">
          {experienceForm.map((field) => (
            <div key={field.label}>
              <label htmlFor={field.label} className="block text-lg font-semibold dark:text-white">
                {field.label}
              </label>
              {field.type === "input" ? (
                <input
                  type="text"
                  id={field.label}
                  value={
                    field.state === "company" ? company_name : field.state === "designation" ? designation : domain
                  }
                  onChange={(e) => updateInput(field.state, e.target.value)}
                  required
                  className="block w-full min-w-[40rem] rounded-lg border-gray-400 px-4 py-3 text-sm focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                />
              ) : (
                <div className="relative">
                  <IconCalendarDue className="absolute top-2.5 left-2 z-10" />
                  <DatePicker
                    selected={yop}
                    onChange={(e) => setYOP(e)}
                    customInput={<input className="rounded-lg pl-10 focus:border-primary" />}
                    startDate={yop}
                    popperPlacement="top"
                    showYearPicker
                    dateFormat="yyyy"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={() => navigate("/my-education")}
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
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}${import.meta.env.VITE_USERS_EXPERIENCE}/1234ABC`,
                  { json: { skills_master: { ...data?.skills_master } } },
                )
                .json();
              setLoading(false);

              if (response.Status === "OK") {
                localforage.setItem("userData", { skills_master: { ...data?.skills_master } });
                setData({
                  skills_master: {
                    user: data?.skills_master.user,
                    categories: data?.skills_master.categories,
                    experience: data?.skills_master.experience,
                  },
                });
                navigate("/my-education");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default UpdateEducation;
