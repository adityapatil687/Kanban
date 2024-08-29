import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginForm() {
  return (
    <div className="centered-container">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card p-4 shadow-sm">
          <form>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                aria-label="Email address"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                aria-label="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="mb-3">
              <Link to="/forgot-password" className="text-decoration-none link-success">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
              Login
            </button>
            <div className="text-center">
              <span>Don’t have an account? </span>
              <Link to="/register" className="text-decoration-none link-success">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
