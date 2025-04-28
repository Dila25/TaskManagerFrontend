"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!formData.email) {
      alert("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Email is invalid");
      isValid = false;
    }

    if (!isValid) {
      return;
    }
    try {
      const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful!");
        localStorage.setItem("Token", data.token);
        localStorage.setItem("userID", data.userId);
        // Set token in cookie for middleware
        document.cookie = `Token=${data.token}; path=/; SameSite=Strict;`;
        setTimeout(() => {
          window.location.href = "/Pages/allTask";
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  useEffect(() => {
    // Load the Google Identity Services library
    const initializeGoogleSignIn = () => {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      const idToken = response.credential;

      const res = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/users/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("Login successful!");
        localStorage.setItem("Token", data.token);
        localStorage.setItem("userID", data.userId);
        // Set token in cookie for middleware
        document.cookie = `Token=${data.token}; path=/; SameSite=Strict;`;
        setTimeout(() => {
          window.location.href = "/Pages/allTask";
        }, 2000);
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          TaskMaster
        </h2>
        <h1 className="mt-2 text-center text-xl font-semibold text-gray-600">
          Sign in to your account
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="fixed top-4 right-4 w-130 z-50">
              <div
                className={`relative overflow-hidden p-4 rounded-lg shadow-lg ${message.includes("Error")
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "bg-green-50 text-green-700 border-l-4 border-green-500"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{message}</p>
                  </div>
                  <button
                    onClick={() => setMessage("")}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    &times;
                  </button>
                </div>
                <div
                  className={`absolute bottom-0 left-0 h-1 ${message.includes("Error") ? "bg-red-300" : "bg-green-300"
                    }`}
                  style={{
                    width: "100%",
                    animation: "progressBar 3s linear forwards",
                  }}
                />
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/Pages/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register
              </a>
            </p>
          </div>
          <div className="mt-6">
            <div id="google-signin-button"></div>
          </div>
        </div>
      </div>
    </div>
  );
}