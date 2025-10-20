"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function FormSubmit({
  data,
  dispatch,
  text,
}: {
  data: any;
  dispatch: any;
  text: string;
}) {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter()


  async function handleSubmit() {
    const res = await fetch("/api/network", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          data: {
            ...data,
            referrer: typeof window !== "undefined" && window.document.referrer,
          }
        }
      }),
    });

    if (!res.ok) {
      setErrorMessage("Failed to submit.");
      return;
    }
    const { url } = await res.json()
    setErrorMessage("");
    dispatch({ type: "submit_success", url });
  }

  return (
    <div className="flex flex-row items-center self-center justify-center flex-shrink-0 shadow-md lg:justify-end">
      <div className="flex flex-col">
        <div className="flex flex-row">
          {successMessage ? (
            <p className="text-green-700 bg-green-300 px-4 py-2 rounded-lg">
              {successMessage}
            </p>
          ) : (
            <>
              <button
                type="button"
                className="w-2/5 p-3 font-semibold rounded-r-lg sm:w-1/3 dark:bg-violet-400 dark:text-gray-900"
                onClick={handleSubmit}
              >
                Submit network
              </button>
            </>
          )}
          <button
            type="button"
            className="w-2/5 p-3 font-semibold rounded-r-lg sm:w-1/3 dark:bg-violet-400 dark:text-gray-900"
            onClick={handleSubmit}
          >
            Submit network
          </button>

        </div>

        {errorMessage && (
          <p className="text-red-500 bg-red-200 px-4 py-2 rounded-lg my-2">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
