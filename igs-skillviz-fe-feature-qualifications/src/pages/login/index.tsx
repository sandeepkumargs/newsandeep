import { useLayoutEffect, useState } from "react";
import abstract from "@/assets/abstract.png";
import logo from "@/assets/logo.png";
import { IconLock, IconMail } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import cx from "classix";
import localforage from "localforage";
import ky from "ky";

function Login() {
  useLayoutEffect(() => {
    document.title = "SkillViz | Login";
  }, []);

  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "test@igs.com", password: "testuser1234" });

  const [loading, setLoading] = useState(false);

  return (
    <main className="flex h-dvh dark:bg-gray-800">
      <section className="bg-primary-100 flex flex-1 flex-col items-center justify-center gap-20">
        <h1 className="w-80 text-center text-4xl font-bold text-primary">Where amazing things happen</h1>
        <img src={abstract} />
      </section>
      <section className="flex flex-1 flex-col items-center justify-center bg-white">
        <img src={logo} width={100} />
        <h1 className="text-3xl font-semibold">IGS SkillViz</h1>
        <div className="flex items-center gap-2">
          <hr className="my-8 h-0.5 w-24 border-t-0 bg-gray-300 dark:bg-white/10" />
          <span>IGS Microsoft Email</span>
          <hr className="my-8 h-0.5 w-24 border-t-0 bg-gray-300 dark:bg-white/10" />
        </div>
        <form className="flex w-80 flex-col gap-2">
          <div>
            <label htmlFor="hs-validation-name-error" className="text-md mb-2 block font-semibold dark:text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="hs-validation-name-error"
                name="hs-validation-name-error"
                className={cx(
                  "block w-full rounded-lg border-none bg-gray-100 px-4 py-3 pl-12 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
                  !form.password && "border-red-500 focus:border-red-500 focus:ring-red-500",
                )}
                required
                aria-describedby="hs-validation-name-error-helper"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
              <div className="pointer-events-none absolute inset-y-0 start-4 flex items-center pe-3">
                <IconMail />
              </div>
              {!form.email && (
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                  <svg
                    className="size-4 flex-shrink-0 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                </div>
              )}
            </div>
            {!form.email && (
              <p className="mt-2 text-sm text-red-600" id="hs-validation-name-error-helper">
                Please enter a valid email address.
              </p>
            )}
          </div>
          <div>
            <label className="text-md mb-2 block font-semibold dark:text-white">Password</label>
            <div className="relative">
              <input
                id="hs-toggle-password"
                type="password"
                className="block w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-3 pl-12 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
              <div className="pointer-events-none absolute inset-y-0 start-4 flex items-center pe-3">
                <IconLock />
              </div>
              <button
                type="button"
                data-hs-toggle-password='{
        "target": "#hs-toggle-password"
      }'
                className="absolute end-0 top-0 rounded-e-md p-3.5 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                <svg
                  className="size-3/4 flex-shrink-0 text-gray-400 dark:text-neutral-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path
                    className="hs-password-active:hidden"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  />
                  <path
                    className="hs-password-active:hidden"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  />
                  <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22" />
                  <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <a className="text-primary-500 mt-2 cursor-pointer text-sm">Forgot password?</a>
          </div>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              const response = await ky(
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}/1234ABC`,
              ).json();
              if (response) {
                await localforage.setItem("userData", response);
                setLoading(false);
                localforage.setItem("logged_in", true);
                navigate("/dashboard");
              }
            }}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-2 py-3 text-white hover:brightness-125"
          >
            <span
              className={cx(
                "inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white",
                !loading && "hidden",
              )}
              role="status"
              aria-label="loading"
            />
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
