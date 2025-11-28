import React, { useEffect, useMemo, useState } from "react";
import { FilterLocationStore } from "@/store/SurveyStore";
import { Eye, EyeOff, Check, X, User, MapPin, Grid } from "lucide-react";
import { motion } from "framer-motion";
import StorageService from "@/services/StorageService";
import Constants from "../../config/Constants";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Role = { id: string; name: string };
type Designation = { id: string | number; title: string };

export default function UserCreateForm(): JSX.Element {
  // --- user & role handling moved inside component ---
  const [userData, setUserData] = useState<any | null>(null);

  // derive roles from userData (memoized)
  const derivedRoles = useMemo<Role[]>(() => {
    const ud = userData;
    if (!ud || !ud.usertype) return [];
    if (ud.usertype === "1" || ud.usertype === "2") {
      return [
        { id: "10", name: "SUPERVISOR" },
        { id: "15", name: "STATE_GIS" },
        { id: "14", name: "CIRCLE_GIS" },
        { id: "11", name: "SURVEYOR" },
      ];
    }
    if (ud.usertype === "10") {
      return [
        { id: "15", name: "STATE_GIS" },
        { id: "14", name: "CIRCLE_GIS" },
        { id: "11", name: "SURVEYOR" },
      ];
    }
    return [];
  }, [userData]);

  // roles state so UI updates when derivedRoles changes
  const [roles, setRoles] = useState<Role[]>([]);

  // location store
  const { districts, circles, getDistricts, getCircles, setCircles } = FilterLocationStore();

  const [form, setForm] = useState({
    district: "",
    circle: "",
    role: "",
    designation: "", // <-- new field
    username: "",
    password: "",
    confirm_password: "",
    name: "",
    mobile_no: "",
    email: "",
  });

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [designationsError, setDesignationsError] = useState<string | null>(null);
  const designationsAbortRef = React.useRef<AbortController | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // regexes
  const ALPHANUMERIC_RE = /^[a-zA-Z0-9]*$/;
  const PHONE_RE = /^\d{10}$/;

  // read JWT cookie once on mount (safe for client-side)
  useEffect(() => {
    try {
      const token = StorageService.getJwtCookie();
      const data = StorageService.getJwtCookieData(token);
      setUserData(data ?? null);
    } catch (err) {
      console.warn("UserCreateForm: failed to read userData", err);
      setUserData(null);
    }
  }, []);

  // apply derived roles into state when they change
  useEffect(() => {
    setRoles(derivedRoles);
  }, [derivedRoles]);

  // load districts once
  useEffect(() => {
    getDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when district changes, load circles
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

  // --- NEW: fetch designations when role changes ---
  useEffect(() => {
    // clear previous controller
    if (designationsAbortRef.current) {
      designationsAbortRef.current.abort();
      designationsAbortRef.current = null;
    }

    // clear state if role empty
    if (!form.role) {
      setDesignations([]);
      setDesignationsError(null);
      setDesignationsLoading(false);
      // clear selected designation in form
      setForm((s) => ({ ...s, designation: "" }));
      return;
    }

    const controller = new AbortController();
    designationsAbortRef.current = controller;

    async function load() {
      setDesignationsLoading(true);
      setDesignationsError(null);

      const headers: Record<string, string> = {};
      try {
        const token = await StorageService.getJwtCookie();
        if (token && token !== "undefined") {
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore
      }
      headers["Content-Type"] = "application/json";

      const url = `${Constants.API_BASE_URL.replace(/\/$/, "")}/api/designations?role=${encodeURIComponent(
        form.role
      )}`;

      try {
        const res = await fetch(url, { method: "GET", headers, signal: controller.signal });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const msg = (body && (body.message || JSON.stringify(body))) || res.statusText || "Failed to load designations";
          throw new Error(msg);
        }
        const data = await res.json();
        // Expecting either array or { data: [...] }
        const list: any[] = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];

        // map API shape -> { id, title }
        const normalized = list.map((it: any) => ({
          id: it.designation_code ?? it.id ?? it.desig_id ?? String(it.designation_code ?? it.id ?? ""),
          title: it.designation_name ?? it.title ?? it.desig_name ?? String(it.designation_name ?? it.title ?? ""),
          role_code: it.role_code ?? undefined, // optional if you later need it
        }));

        setDesignations(normalized);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setDesignations([]);
        setDesignationsError(err.message || "Unable to load designations");
      } finally {
        setDesignationsLoading(false);
      }
    }

    load();

    return () => {
      if (designationsAbortRef.current) {
        designationsAbortRef.current.abort();
        designationsAbortRef.current = null;
      }
    };
  }, [form.role]);

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

    if (!form.mobile_no) e.mobile_no = "Required";
    else if (!PHONE_RE.test(form.mobile_no)) e.mobile_no = "10 digits";

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
        designation: form.designation, // include designation if backend expects it
        username: form.username,
        password: form.password,
        name: form.name,
        mobile_no: form.mobile_no,
        email: form.email,
      };

      const res = await fetch(`${Constants.API_BASE_URL}/api/users/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);

        if (body && body.errors && typeof body.errors === "object") {
          setErrors(body.errors);
        } else {
          setErrors({});
        }

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
        designation: "",
        username: "",
        password: "",
        confirm_password: "",
        name: "",
        mobile_no: "",
        email: "",
      });
      setCircles([]);
      setErrors({});
      setDesignations([]);
    } catch (err: any) {
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
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 shadow-md rounded-2xl border border-transparent mt-8"
    >
      <header className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-rose-500">Create User</h2>
        </div>
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
              {roles.length === 0 ? (
                <option value="">{userData ? "No roles available" : "Loading roles..."}</option>
              ) : (
                <>
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </>
              )}
            </select>
            {errors.role && <span className="text-red-500 text-xs mt-1">{errors.role}</span>}
          </label>
        </div>

        {/* Full name + Designation + Phone + Email in a single row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
              type="text"
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-cyan-100 transition",
                errors.name ? "border-red-400" : "border-cyan-200"
              )}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
          </div>

          {/* Designation */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Designation</label>
            <select
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border w-full focus:outline-none focus:ring-4 focus:ring-slate-100 transition",
                designationsError ? "border-red-400" : "border-slate-200"
              )}
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              disabled={!form.role || designationsLoading || designations.length === 0}
            >
              {!form.role ? (
                <option value="">Select role first</option>
              ) : designationsLoading ? (
                <option value="">Loading...</option>
              ) : designations.length === 0 ? (
                <option value="">{designationsError ? "Failed to load" : "No designations"}</option>
              ) : (
                <>
                  <option value="">Select designation</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </>
              )}
            </select>
            {designationsError && <span className="text-red-500 text-xs mt-1">{designationsError}</span>}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Phone number</label>
            <div className="mt-2 relative">
              <input
                value={form.mobile_no}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, mobile_no: v });
                }}
                type="tel"
                placeholder="10 digits"
                maxLength={10}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-lime-100 transition pr-10",
                  errors.mobile_no ? "border-red-400" : "border-lime-200"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">10</div>
            </div>
            {errors.mobile_no && <span className="text-red-500 text-xs mt-1">{errors.mobile_no}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              type="email"
              className={cn(
                "mt-2 px-3 py-2 rounded-lg border focus:outline-none focus:ring-4 focus:ring-sky-100 transition",
                errors.email ? "border-red-400" : "border-sky-200"
              )}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
          </div>

        </div>


        {/* Username / Passwords */}
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
              {/* Hidden dummy fields to reduce browser autofill/autocomplete */}
              <input
                name="fake-username"
                autoComplete="username"
                tabIndex={-1}
                style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
              />
              <input
                name="fake-password"
                type="password"
                autoComplete="current-password"
                tabIndex={-1}
                style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
              />

              <input
                name="new-password"
                autoComplete="new-password"
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
              setForm({ district: "", circle: "", role: "", designation: "", username: "", password: "", confirm_password: "", name: "", mobile_no: "", email: "" });
              setErrors({});
              setSubmitError(null);
              setSuccess(null);
              setCircles([]);
              setDesignations([]);
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
      </form>
    </motion.div>
  );
}
