import React, { useEffect, useState } from "react";
import { FilterLocationStore } from "@/store/SurveyStore";
import { Eye, EyeOff, Check, X, User, Lock, Phone, Mail, MapPin, Grid } from "lucide-react";
import { motion } from "framer-motion";
import StorageService from "@/services/StorageService";
import Constants from "../../config/Constants";


console.log("Rendering UserCreateForm");
const user = StorageService.getJwtCookie();
const userData: any = StorageService.getJwtCookieData(user);

type Role = { id: string; name: string };

const ALPHANUMERIC_RE = /^[a-zA-Z0-9]*$/;
const PHONE_RE = /^\d{10}$/;

const STATIC_ROLES: Role[] =
userData.usertype === "1" || userData.usertype === "2"
? [
{ id: "00", name: "DEO" },
{ id: "9",  name: "GUEST" },
{ id: "10", name: "SUPERVISOR" },
{ id: "11", name: "SURVEYOR" },
{ id: "14", name: "SURVEY_GIS_ASSISTANT" },
]
: userData.usertype === "10"
? [
{ id: "11", name: "SURVEYOR" },
{ id: "14", name: "SURVEY_GIS_ASSISTANT" },
]
: [];


function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function UserCreateForm(): JSX.Element {
  console.log("userData in create", userData.usertype);
  const { districts, circles, getDistricts, getCircles, setCircles } = FilterLocationStore();

  const [roles, setRoles] = useState<Role[]>([]);

  const [form, setForm] = useState({
    district: "",
    circle: "",
    role: "",
    username: "",
    password: "",
    confirm_password: "",
    name: "",
    phone_no: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getDistricts();
    setRoles(STATIC_ROLES);
  }, []);

  useEffect(() => {
    if (!form.district) {
      setCircles([]);
      setForm((s) => ({ ...s, circle: "" }));
      return;
    }
    getCircles(form.district);
    setForm((s) => ({ ...s, circle: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.district]);

  function validate() {
    const e: Record<string, string> = {};

    if (!form.district) e.district = "Select district";
    if (!form.circle) e.circle = "Select circle";
    if (!form.role) e.role = "Select role";

    if (!form.username) e.username = "Required";
    else if (form.username.length > 5) e.username = "Max 5 characters";
    else if (!ALPHANUMERIC_RE.test(form.username)) e.username = "Only letters & numbers";

    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min 8 characters";

    if (!form.confirm_password) e.confirm_password = "Confirm password";
    else if (form.confirm_password !== form.password) e.confirm_password = "Passwords do not match";

    if (!form.name) e.name = "Required";

    if (!form.phone_no) e.phone_no = "Required";
    else if (!PHONE_RE.test(form.phone_no)) e.phone_no = "10 digits";

    if (!form.email) e.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Invalid email";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSuccess(null);
  setSubmitError(null);

  if (!validate()) return;

  setLoading(true);
  const headers: Record<string, string> = {};
  const token = await StorageService.getJwtCookie();
  if (token && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  headers["Content-Type"] = "application/json";

  try {
    const payload = {
      dist_code: form.district,
      cir_code: form.circle,
      user_role: form.role,
      username: form.username,
      password: form.password,
      name: form.name,
      phone_no: form.phone_no,
      email: form.email,
    };

    const res = await fetch(`${Constants.API_BASE_URL}/api/users/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // try to parse JSON error body
      const body = await res.json().catch(() => null);

      // If server returned { message, errors: { field: "msg" } }
      if (body && body.errors && typeof body.errors === "object") {
        // show per-field errors in the form
        setErrors(body.errors);
      } else {
        // clear previous field errors if none returned
        setErrors({});
      }

      // set a top-level submit error message (either message or first field error)
      const topMsg =
        (body && (body.message || Object.values(body.errors || {})[0])) ||
        res.statusText ||
        "Failed to create user";
      throw new Error(topMsg);
    }

    setSuccess("User created successfully");
    setForm({
      district: "",
      circle: "",
      role: "",
      username: "",
      password: "",
      confirm_password: "",
      name: "",
      phone_no: "",
      email: "",
    });
    setCircles([]);
    setErrors({});
  } catch (err: any) {
    // if we already set per-field errors above, keep them; add a submitError too
    setSubmitError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}

  const passwordMatch = form.confirm_password ? form.password === form.confirm_password : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 4 }}
      className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 shadow-2xl rounded-2xl border border-transparent mt-8"
    >
      <header className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-rose-500">Create User</h2>
          {/* <p className="text-sm text-gray-600 mt-1">Create and manage system users — colorful UI with stronger feedback and confirm password.</p> */}
        </div>
        {/* <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">Status</div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full shadow-sm">
            <Check size={14} /> <span className="text-xs">Ready</span>
          </div>
        </div> */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* District */}
          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={14} /> District
            </span>
            <select
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-pink-100 transition",
                errors.district ? "border-red-400" : "border-pink-200"
              )}
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            >
              <option value="">Select district</option>
              {districts && districts.map((d: any) => (
                <option key={d.key ?? d.id ?? d.code} value={d.key ?? d.id ?? d.code}>
                  {d.value ?? d.name}
                </option>
              ))}
            </select>
            {errors.district && <span className="text-red-500 text-xs mt-1">{errors.district}</span>}
          </label>

          {/* Circle */}
          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <Grid size={14} /> Circle
            </span>
            <select
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-purple-100 transition",
                errors.circle ? "border-red-400" : "border-purple-200"
              )}
              value={form.circle}
              onChange={(e) => setForm({ ...form, circle: e.target.value })}
              disabled={!form.district}
            >
              <option value="">{form.district ? "Select circle" : "Select district first"}</option>
              {circles && circles.map((c: any) => (
                <option
                  key={c.cir_code ?? c.id ?? c.key}
                  value={c.cir_code ? `${c.dist_code}-${c.subdiv_code}-${c.cir_code}` : c.id ?? c.key}
                >
                  {c.loc_name ?? c.name}{c.locname_eng ? ` (${c.locname_eng})` : ""}
                </option>
              ))}
            </select>
            {errors.circle && <span className="text-red-500 text-xs mt-1">{errors.circle}</span>}
          </label>

          {/* Role */}
          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <User size={14} /> Role
            </span>
            <select
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-indigo-100 transition",
                errors.role ? "border-red-400" : "border-indigo-200"
              )}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.role && <span className="text-red-500 text-xs mt-1">{errors.role}</span>}
          </label>
        </div>

        {/* Move fullname/phone/email above username/password */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Full name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-cyan-100 transition",
                errors.name ? "border-red-400" : "border-cyan-200"
              )}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Phone number</span>
            <div className="mt-2 relative">
              <input
                value={form.phone_no}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone_no: v });
                }}
                placeholder="10 digits"
                maxLength={10}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-lime-100 transition pr-10",
                  errors.phone_no ? "border-red-400" : "border-lime-200"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">10</div>
            </div>
            {errors.phone_no && <span className="text-red-500 text-xs mt-1">{errors.phone_no}</span>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-sky-100 transition",
                errors.email ? "border-red-400" : "border-sky-200"
              )}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
          </label>
        </div>

        {/* Username / Passwords in one line */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Username</span>
            <div className="mt-2 relative">
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. user1"
                maxLength={5}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-rose-100 transition pr-10",
                  errors.username ? "border-red-400" : "border-rose-200"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">{form.username.length}/5</div>
            </div>
            {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username}</span>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Password</span>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-amber-100 transition pr-10",
                  errors.password ? "border-red-400" : "border-amber-200"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs font-medium text-gray-700">Confirm password</span>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="Re-type password"
                className={cn(
                  "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-emerald-100 transition pr-10",
                  errors.confirm_password ? "border-red-400" : passwordMatch === null ? "border-emerald-200" : passwordMatch ? "border-emerald-400" : "border-red-300"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs">
                {passwordMatch === null ? null : passwordMatch ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700"><Check size={14} /></span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-600"><X size={14} /></span>
                )}
              </div>
            </div>
            {errors.confirm_password && <span className="text-red-500 text-xs mt-1">{errors.confirm_password}</span>}
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500 text-white rounded-xl shadow-lg hover:scale-[1.01] transform transition disabled:opacity-60 flex items-center gap-3"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20"></circle>
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <span className="text-sm font-semibold">Create user</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({ district: "", circle: "", role: "", username: "", password: "", confirm_password: "", name: "", phone_no: "", email: "" });
              setErrors({});
              setSubmitError(null);
              setSuccess(null);
              setCircles([]);
            }}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            Reset
          </button>

          <div className="flex-1 text-right">
            {success && (
              <div className="inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1 rounded-full">
                <Check size={14} /> {success}
              </div>
            )}
            {submitError && (
              <div className="inline-flex items-center gap-2 text-sm text-white bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1 rounded-full">
                <X size={14} /> {submitError}
              </div>
            )}
          </div>
        </div>

        {/* <div className="mt-2 text-xs text-gray-600">* Passwords are stored securely on the server. Replace endpoints to match your API.</div> */}
      </form>
    </motion.div>
  );
}
