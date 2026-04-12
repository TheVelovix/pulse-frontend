"use client";
import { useSession } from "@/context/SessionContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.loading && session.user) {
      router.replace("/dashboard");
    }
  }, [session.loading, router, session.user]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={e => {
        try {
          session.login(e, credentials);
        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.message === "invalid-credentials")
              setError("Invalid credentials");
          }
        }
      }}
      className="bg-card w-[90%] mx-auto border border-white my-auto p-4 rounded-lg sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/4"
    >
      <h2 className="font-semibold text-center text-lg mb-4">
        Enter your credentials
      </h2>
      <div className="my-5 flex flex-col gap-2">
        <label htmlFor="email-input" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="user@example.com"
          value={credentials.email}
          onChange={e => {
            setError("");
            setCredentials({ ...credentials, email: e.target.value });
          }}
          className="w-full border border-white rounded-lg p-2 text-sm transition-colors duration-200 focus:outline-none focus:border-accent"
          required
        />
      </div>
      <div className="my-5 flex flex-col gap-2">
        <label htmlFor="password-input" className="text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          value={credentials.password}
          onChange={e => {
            setError("");
            setCredentials({ ...credentials, password: e.target.value });
          }}
          className="w-full border border-white rounded-lg p-2 text-sm transition-colors duration-200 focus:outline-none focus:border-accent"
          required
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
      <button
        type="submit"
        className="bg-accent w-full py-2 mt-4 rounded-md transition-colors duration-200 hover:bg-accent-hover cursor-pointer"
      >
        Login
      </button>

      <hr className="mt-8" />
      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <a href="/signup" className="text-accent">
          Sign up
        </a>
      </p>
    </form>
  );
}
