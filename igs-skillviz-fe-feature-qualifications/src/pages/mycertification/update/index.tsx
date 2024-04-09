import { IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useQuery } from "../../../hooks/useQuery";
import { Certification } from "../../../types/Certificate";

const certificateForm = [
  { label: "Certification", type: "select" },
  { label: "Date of Completion", type: "datepicker" },
];

function UpdateCertification() {
  const navigate = useNavigate();

  const params = useQuery();

  const certificateIdx = params.get("certificate");

  const { data, setData } = useData();

  const { type } = useParams();

  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [certification, setCertification] = useState<Certification>(data?.skills_master.certification);

  const [doc, setDOC] = useState<DateValueType>({ startDate: null, endDate: null });

  const [, setLoading] = useState(false);

  const updateDate = (value: { startDate: string | null | Date; endDate: string | null | Date } | null) => {
    if (value) {
      setDOC({ startDate: value?.startDate, endDate: value?.endDate });
    }
  };

  useEffect(() => {
    if (certificateIdx && data?.skills_master.certification?.[+certificateIdx])
      setSelectedCertificate(data?.skills_master.certification[+certificateIdx].c_name);

    const updatedCertificate = certification?.find((_, idx) => idx === Number(certificateIdx));
    if (updatedCertificate?.acquired) setDOC({ startDate: updatedCertificate.doc, endDate: updatedCertificate.doc });
  }, []);

  useEffect(() => {
    if (doc?.startDate)
      setCertification((prev) =>
        prev?.map((certificate) => {
          if (certificate.c_name === selectedCertificate) {
            certificate.doc = doc.startDate as string;
            certificate.acquired = true;
          }
          return certificate;
        }),
      );
  }, [doc?.startDate]);

  console.debug("cll", selectedCertificate, certification);

  return (
    <section className="flex w-fit flex-col gap-4 rounded-md bg-white p-6">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-2xl capitalize">{type} Your Certificate</h2>
      </div>
      <div className="flex flex-col gap-8 px-16 py-8">
        <div className="flex flex-col gap-4">
          {certificateForm.map((field) => (
            <div key={field.label}>
              <label htmlFor={field.label} className="block text-lg font-semibold dark:text-white">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.label}
                  className="block w-full rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                  value={selectedCertificate}
                  onChange={(e) => {
                    const updatedCertificate = certification?.find(
                      (certificate) => certificate.c_name === e.target.value,
                    );
                    if (updatedCertificate?.acquired)
                      setDOC({ startDate: updatedCertificate.doc, endDate: updatedCertificate.doc });
                    else setDOC({ startDate: null, endDate: null });
                    setSelectedCertificate(e.target.value);
                    setCertification((prev) =>
                      prev?.map((certificate) => {
                        if (certificate.c_name === e.target.value) {
                          certificate.acquired = true;
                        }
                        return certificate;
                      }),
                    );
                  }}
                >
                  {data?.skills_master.certification?.map((certificate) => (
                    <option key={certificate.c_name}>{certificate.c_name}</option>
                  ))}
                </select>
              ) : (
                <div className="w-max">
                  <Datepicker
                    asSingle={true}
                    startFrom={doc?.startDate ? new Date(doc.startDate) : null}
                    maxDate={new Date()}
                    value={doc}
                    displayFormat={"MMM DD, YYYY"}
                    onChange={updateDate}
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
            onClick={() => navigate("/my-certification")}
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

              json.skills_master.certification = certification;

              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}${import.meta.env.VITE_USERS_CERTIFICATES}/1234ABC`,
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

export default UpdateCertification;
