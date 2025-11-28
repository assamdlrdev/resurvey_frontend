import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2 } from "lucide-react";
import StorageService from "@/services/StorageService";
import Constants from "../../config/Constants";
import { useNavigate } from "react-router-dom";

const user = StorageService.getJwtCookie();
const userData: any = StorageService.getJwtCookieData(user);

type User = {
  id: string | number;
  username: string;
  name: string;
  email?: string;
  phone_no?: string;
  role?: string;
  designation?: string;
  district?: any;
  circle?: any;
};

export default function UserListView(): JSX.Element {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const totalRef = useRef<number | null>(null); // optional: store total from server
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  // fetch users from server with optional search, page, limit
  async function fetchUsers(params: { search?: string; page?: number; limit?: number }) {
    // cancel previous request if any
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const headers: Record<string, string> = {};
    try {
      const token = await StorageService.getJwtCookie();
      if (token && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore token read errors; continue without auth header
    }
    headers["Content-Type"] = "application/json";

    const q = params.search ?? "";
    const p = params.page ?? 1;
    const l = params.limit ?? pageSize;

    const url = `${Constants.API_BASE_URL.replace(/\/$/, "")}/api/users/list?search=${encodeURIComponent(q)}&page=${p}&limit=${l}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        // try to read json error body
        const body = await res.json().catch(() => null);
        const message = (body && (body.message || JSON.stringify(body))) || res.statusText || "Failed to load users";
        throw new Error(message);
      }

      const data = await res.json();

      // adapt to server shape. Common shapes:
      // { data: User[], total: number }  OR an array directly
      if (Array.isArray(data)) {
        setUsers(data);
        totalRef.current = data.length;
      } else if (Array.isArray(data.data)) {
        setUsers(data.data);
        totalRef.current = typeof data.total === "number" ? data.total : data.data.length;
      } else {
        // fallback: try to coerce into array
        setUsers([]);
        totalRef.current = 0;
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        // request was aborted — ignore
        return;
      }
      setError(err.message || "Something went wrong");
      setUsers([]);
      totalRef.current = 0;
    } finally {
      setLoading(false);
    }
  }

  // --- debounce + conditional fetch: only call API for empty search or when search.length >= 3
  useEffect(() => {
    // cancel previous debounce timer
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    // If search is non-empty but less than 3 chars, do NOT call server (we'll show a message)
    const trimmed = search.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < 3;

    debounceRef.current = window.setTimeout(() => {
      if (tooShort) {
        // clear users result to avoid showing stale data (optional)
        setUsers([]);
        totalRef.current = 0;
        setLoading(false);
        setError(null);
        return;
      }
      // call server when search is empty (fetch all) or length >= 3
      fetchUsers({ search: trimmed, page, limit: pageSize });
    }, 400);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      // abort any inflight fetch when effect re-runs
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);


  // local UI still allows client-side filtering if you want instant filtering
  // but we've replaced it with server-side search — remove local filtering:
  const displayUsers = users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="max-w-7xl mt-5 mx-auto p-6 rounded-md shadow-md bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-[90vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600">
          User Management
        </h3>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => {
                setPage(1); // reset to first page when search changes
                setSearch(e.target.value);
              }}
              placeholder="Search username, name, email, phone no"
              className="pl-10 pr-3 py-2 rounded-xl border w-[430px] shadow-sm focus:outline-none focus:ring-4 focus:ring-pink-100 bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
          </div>

          {/* New User Button */}
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-[1.02] transition transform"
            onClick={() => navigate(`/user-create`)}
          >
            <Plus size={16} /> New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow-md bg-white">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-700 bg-gradient-to-r from-purple-100 to-pink-100">
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">District - Circle</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-purple-500 animate-pulse">
                  Loading users…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : search.trim().length > 0 && search.trim().length < 3 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Type at least <strong>3</strong> characters to search.
                </td>
              </tr>
            ) : displayUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              displayUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{u.username}</td>
                  <td className="py-3 px-4">{u.name || "—"}</td>
                  <td className="py-3 px-4">{u.email || "—"}</td>
                  <td className="py-3 px-4">{u.phone_no || "—"}</td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 font-medium">
                      {u.role || "N/A"}
                    </span>
                  </td>


                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 font-medium">
                      {u.designation || "N/A"}
                    </span>
                  </td>


                  <td className="py-3 px-4 text-sm text-gray-700">
                    {u?.district
                      ? `${u.district.locname_eng?.trim() || u.district.loc_name?.trim() || "N/A"}${
                          u?.circle ? ` - ${u.circle.locname_eng?.trim() || u.circle.loc_name?.trim() || ""}` : ""
                        }`
                      : "N/A"}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        title="Edit"
                        onClick={() => navigate(`/user-update/${u.id}`)}
                        className="p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {Math.min(users.length, pageSize)} of {totalRef.current ?? users.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md border bg-white hover:bg-purple-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Prev
          </button>

          <div className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 font-medium shadow">
            {page}
          </div>

          <button
            className="px-3 py-1 rounded-md border bg-white hover:bg-pink-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}
