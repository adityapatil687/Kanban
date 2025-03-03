import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              {
                label: "Full Name",
                type: "text",
                name: "name",
                icon: <User className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "Email address",
                type: "email",
                name: "email",
                icon: <Mail className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "Password",
                type: "password",
                name: "password",
                icon: <Lock className="h-5 w-5 text-gray-400" />,
              },
              {
                label: "Confirm Password",
                type: "password",
                name: "confirmPassword",
                icon: <Lock className="h-5 w-5 text-gray-400" />,
              },
            ].map(({ label, type, name, icon }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {label}
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {icon}
                  </div>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    autoComplete={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`block w-full border py-2 pr-3 pl-10 ${
                      errors[name] ? "border-red-300" : "border-gray-300"
                    } rounded-md placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm`}
                  />
                </div>
                {errors[name] && (
                  <p className="mt-2 text-sm text-red-600">{errors[name]}</p>
                )}
              </div>
            ))}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in to your existing account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
