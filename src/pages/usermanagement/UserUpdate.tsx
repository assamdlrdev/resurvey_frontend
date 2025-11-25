import React, { useEffect, useState } from "react";
import { Check, X, Eye, EyeOff, MapPin, Grid, User } from "lucide-react";
import { motion } from "framer-motion";
import Constants from "../../config/Constants";
import StorageService from "@/services/StorageService";
import { FilterLocationStore } from "@/store/SurveyStore";
import { useParams } from "react-router-dom";

type Props = {
  userId?: string | number;
  onSaved?: () => void;
  onCancel?: () => void;
};

export default function UpdateUserForm({ userId: propUserId, onSaved, onCancel }: Props) {
  const { /* optional */ districts, circles } = FilterLocationStore();
  const params = useParams<{ id?: string }>();
  const id = propUserId ?? params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    district: "",
    circle: "",
    role: "",
    username: "",
    name: "",
    email: "",
    phone_no: "",
    password: "",
    confirm_password: "",
  });

  const PHONE_RE = /^\d{10}$/;

  useEffect(() => {
    if (!id) {
      setFetching(false);
      setSubmitError("No user id provided");
      return;
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function getAuthHeaders() {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = await StorageService.getJwtCookie();
    if (token && token !== "undefined") headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  function extractName(obj: any) {
    if (!obj) return null;
    const candidate =
        (typeof obj === "object"
        ? obj.locname_eng ?? obj.loc_name ?? obj.name ?? ""
        : obj?.toString?.() ?? "");
    const trimmed = (candidate ?? "").toString().trim();
    return trimmed.length ? trimmed : null;
  }

  function formatLocation(d: any, c: any) {
    const dName = extractName(d);
    const cName = extractName(c);

    // neither present
    if (!dName && !cName) return "N/A";

    // only circle present
    if (!dName && cName) return cName;

    // only district present
    if (dName && !cName) return dName;

    // both present
    return `${dName} - ${cName}`;
  }

  async function fetchUser() {
    if (!id) return;
    setFetching(true);
    setSubmitError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${Constants.API_BASE_URL}api/users/${id}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) throw new Error(res.statusText || "Failed to fetch user");
      const json = await res.json();

      // support { status, data } or direct object
      if (json?.status !== undefined && Number(json.status) !== 1) {
        throw new Error(json?.message || "Failed to fetch user (status !== 1)");
      }
      const payload = json?.data ?? json;

      setUser(payload);

      setForm((f) => ({
        ...f,
        district: payload.district ?? "",
        circle: payload.circle ?? "",
        role: payload.role ?? payload.role_name ?? payload.roleId ?? "",
        username: payload.username ?? payload.user_name ?? "",
        name: payload.name ?? payload.fullname ?? "",
        email: payload.email ?? "",
        phone_no: payload.phone_no ?? payload.mobile ?? "",
      }));
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setFetching(false);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Required";
    if (!form.email) e.email = "Required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone_no) e.phone_no = "Required";
    else if (!PHONE_RE.test(form.phone_no)) e.phone_no = "10 digits";

    if (form.password) {
      if (form.password.length < 8) e.password = "Min 8 characters";
      if (!form.confirm_password) e.confirm_password = "Confirm password";
      else if (form.confirm_password !== form.password) e.confirm_password = "Passwords do not match";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setSubmitError(null);
    if (!id) { setSubmitError("No user id found to update."); return; }
    if (!validate()) return;

    setLoading(true);
    try {
        const headers = await getAuthHeaders();
        const payload: any = {
        name: form.name,
        email: form.email,
        phone_no: form.phone_no,
        };
        if (form.password) payload.password = form.password;

        const res = await fetch(`${Constants.API_BASE_URL}api/users/${id}/update`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);

        // 🔥 Server-side validation failed
        if (json?.status === 0) {
        setErrors(json.errors || {});
        throw new Error(json.message || "Validation failed");
        }

        if (!res.ok) {
        setErrors(json?.errors || {});
        throw new Error(json?.message || "Failed to update user");
        }

        setSuccess("User updated successfully");
        setErrors({});
        if (onSaved) onSaved();

    } catch (err: any) {
        setSubmitError(err.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
  } 


  if (fetching) {
    return (
      <div className="p-6 rounded-2xl shadow-md text-center bg-gradient-to-r from-pink-50 to-indigo-50 text-gray-600">
        {submitError ? <div className="text-red-600">{submitError}</div> : <div className="animate-pulse">Loading user…</div>}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 flex items-center justify-center text-white text-xl font-bold">
          {(form.name || "?").slice(0, 1)}
        </div>

        <div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Update User</h3>
          <div className="text-sm text-gray-500">Edit profile details — district / circle / role / username are can not be updated</div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {success && <div className="inline-flex items-center gap-2 text-sm text-white bg-emerald-500 px-3 py-1 rounded-full"><Check size={14} /> {success}</div>}
          {submitError && <div className="inline-flex items-center gap-2 text-sm text-white bg-rose-500 px-3 py-1 rounded-full"><X size={14} /> {submitError}</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* display-only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-indigo-50 border">
            <div className="text-xs text-gray-600 flex items-center gap-2"><MapPin size={14} /> District</div>
            <div className="mt-2 text-sm font-medium text-gray-800">{formatLocation(form.district, null)}</div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-lime-50 to-cyan-50 border">
            <div className="text-xs text-gray-600 flex items-center gap-2"><Grid size={14} /> Circle</div>
            <div className="mt-2 text-sm font-medium text-gray-800">{formatLocation(null, form.circle)}</div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-rose-50 border">
            <div className="text-xs text-gray-600 flex items-center gap-2"><User size={14} /> Role</div>
            <div className="mt-2 text-sm font-medium text-gray-800">{form.role || "N/A"}</div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-r from-sky-50 to-indigo-50 border">
            <div className="text-xs text-gray-600">Username</div>
            <div className="mt-2 text-sm font-medium text-gray-800">{form.username || "N/A"}</div>
          </div>
        </div>

        {/* editable */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-xs text-gray-700">Full name</span>
            <input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-2 px-3 py-2 rounded-lg border ${errors.name ? "border-red-400" : "border-gray-200"}`} />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-700">Phone number</span>
            <input value={form.phone_no ?? ""} onChange={(e) => setForm({ ...form, phone_no: e.target.value.replace(/\D/g, "") })} maxLength={10} className={`mt-2 px-3 py-2 rounded-lg border ${errors.phone_no ? "border-red-400" : "border-gray-200"}`} />
            {errors.phone_no && <div className="text-red-500 text-xs mt-1">{errors.phone_no}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-700">Email</span>
            <input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 px-3 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-200"}`} />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </label>
        </div>

        {/* password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-xs text-gray-700">New password (optional)</span>
            <div className="relative mt-2">
              <input type={showPassword ? "text" : "password"} value={form.password ?? ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave empty to keep current" className={`w-full px-3 py-2 rounded-lg border ${errors.password ? "border-red-400" : "border-gray-200"}`} />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-700">Confirm password</span>
            <input type={showPassword ? "text" : "password"} value={form.confirm_password ?? ""} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} placeholder="Confirm new password" className={`mt-2 px-3 py-2 rounded-lg border ${errors.confirm_password ? "border-red-400" : "border-gray-200"}`} />
            {errors.confirm_password && <div className="text-red-500 text-xs mt-1">{errors.confirm_password}</div>}
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-rose-500 text-white rounded-lg">
            {loading ? "Updating..." : "Update changes"}
          </button>

          {/* <button type="button" onClick={() => onCancel?.()} className="px-4 py-2 bg-gray-100 rounded-lg">
            Cancel
          </button> */}

          {/* <button type="button" onClick={() => setShowRaw(s => !s)} className="ml-2 px-3 py-2 border rounded-lg text-sm">
            {showRaw ? "Hide" : "View"} raw
          </button> */}

          {/* <div className="ml-auto">
            {success && <div className="text-green-600 text-sm inline-flex items-center gap-2">{success}</div>}
            {submitError && <div className="text-red-600 text-sm inline-flex items-center gap-2">{submitError}</div>}
          </div> */}
        </div>

        {showRaw && <pre className="mt-4 p-4 rounded-lg bg-gray-900 text-white text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>}
      </form>
    </motion.div>
  );
}
