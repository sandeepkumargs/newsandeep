import { IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import { useQuery } from "../../../hooks/useQuery";

const experienceForm = [
  { label: "Company Name", type: "input", state: "company" },
  { label: "Designation", type: "input", state: "designation" },
  { label: "Domain", type: "input", state: "domain" },
  { label: "Start Date", type: "datepicker", state: "start" },
  { label: "End Date", type: "datepicker", state: "end" },
];

function UpdateExperience() {
  const navigate = useNavigate();

  const params = useQuery();

  const experienceIdx = params.get("experience");

  const { data, setData } = useData();

  const { type } = useParams();

  const [company_name, setCompany] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [start, setStartDate] = useState<{ startDate: string | null | Date; endDate: string | null | Date }>({
    startDate: null,
    endDate: null,
  });
  const [end, setEndDate] = useState<DateValueType>({ startDate: null, endDate: null });

  const [, setLoading] = useState(false);

  const updateInput = (state: string, value: string) => {
    if (state === "company") setCompany(value);
    if (state === "designation") setDesignation(value);
    if (state === "domain") setDomain(value);
  };

  const updateDate = (
    type: string,
    value: { startDate: string | null | Date; endDate: string | null | Date } | null,
  ) => {
    if (value) {
      if (type === "Start Date") setStartDate({ startDate: value?.startDate, endDate: value?.endDate });
      else setEndDate({ startDate: value?.startDate, endDate: value?.endDate });
    }
  };

  useEffect(() => {
    if (experienceIdx) {
      setCompany(data?.skills_master.experience?.[+experienceIdx].company_name ?? "");
      setDesignation(data?.skills_master.experience?.[+experienceIdx].designation ?? "");
      setDomain(data?.skills_master.experience?.[+experienceIdx].domain ?? "");
      setStartDate({
        startDate: data?.skills_master.experience?.[+experienceIdx].start_date ?? "",
        endDate: data?.skills_master.experience?.[+experienceIdx].start_date ?? "",
      });
      setEndDate({
        startDate: data?.skills_master.experience?.[+experienceIdx].end_date ?? "",
        endDate: data?.skills_master.experience?.[+experienceIdx].end_date ?? "",
      });
    }
  }, []);

  return (
    <section className="flex w-fit flex-col gap-4 rounded-md bg-white p-6">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-2xl capitalize">{type} Your Experience</h2>
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
                <div className="w-max">
                  <Datepicker
                    asSingle={true}
                    startFrom={field.label === "End Date" && start.startDate ? new Date(start.startDate) : null}
                    minDate={field.label === "End Date" && start.startDate ? new Date(start.startDate) : null}
                    maxDate={new Date()}
                    value={field.label === "Start Date" ? start : end}
                    displayFormat={"DD/MM/YYYY"}
                    onChange={(e) => updateDate(field.label, e)}
                    useRange={false}
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
            onClick={() => navigate("/my-experience")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={async () => {
              setLoading(true);

              const json = {
                skills_master: {
                  ...data?.skills_master,
                },
              };

              if (!experienceIdx)
                Object.assign(json, {
                  skills_master: {
                    ...data?.skills_master,
                    experience: [
                      ...(data?.skills_master.experience as []),
                      { company_name, designation, domain, start_date: start?.startDate, end_date: end?.startDate },
                    ],
                  },
                });
              else if (json.skills_master.experience && experienceIdx)
                json.skills_master.experience[+experienceIdx] = {
                  company_name,
                  designation,
                  domain,
                  start_date: start?.startDate,
                  end_date: end?.startDate,
                };

              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}${import.meta.env.VITE_USERS_EXPERIENCE}/1234ABC`,
                  { json },
                )
                .json();
              setLoading(false);

              if (response.Status === "OK") {
                localforage.setItem("userData", json);
                setData({ skills_master: { ...json.skills_master } });
                navigate("/my-experience");
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

export default UpdateExperience;
