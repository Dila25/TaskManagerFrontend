"use client";
import { useState, useRef } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    picture: null,
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("name", formData.name);
    if (formData.picture) {
      formDataToSend.append("picture", formData.picture);
    }

    try {
      const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage("Registration successful!");
        setFormData({
          email: "",
          password: "",
          name: "",
          picture: null,
        });
        setTimeout(() => {
          window.location.href = '/Pages/login';
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          TaskMaster
        </h2>
        <h1 className="mt-2 text-center text-xl font-semibold text-gray-600">
          Create your account
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
                    width: '100%',
                    animation: 'progressBar 3s linear forwards',
                  }}
                />
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              <div className="flex flex-col items-center gap-4">
                <div className="relative group ">
                  <div className="w-25 h-25 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="picture"
                    className="w-full text-center cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formData.picture ? "Change" : "Upload"}
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    const re = /^[A-Za-z\s]*$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                Register
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/Pages/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}