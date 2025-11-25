import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
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
  district?: string;
  circle?: string;
};

export default function UserListView(): JSX.Element {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  async function fetchUsers() {
    setLoading(true);
    const headers: Record<string, string> = {};
    const token = await StorageService.getJwtCookie();
    if (token && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
    }
    headers["Content-Type"] = "application/json";
    setError(null);
    try {
      const res = await fetch(
      `${Constants.API_BASE_URL}api/users/list?page=${page}&limit=${pageSize}`,
        {
            method: "GET",
            headers
        }
    );
      if (!res.ok) throw new Error(res.statusText || "Failed to load users");
      const data = await res.json();
      // assume server returns { data: User[], total: number }
      setUsers(Array.isArray(data.data) ? data.data : data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.username || "").toLowerCase().includes(q) ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  return (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.24 }}
    className="max-w-6xl mx-auto p-6 rounded-2xl shadow-xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username, name, email, phone no, role"
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
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-xs text-gray-700 bg-gradient-to-r from-purple-100 to-pink-100">
            <th className="py-3 px-4">Username</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Role</th>
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
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-400">
                No users found.
              </td>
            </tr>
          ) : (
            filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition"
              >
                <td className="py-3 px-4 font-medium text-gray-800">{u.username}</td>
                <td className="py-3 px-4">{u.name || "—"}</td>
                <td className="py-3 px-4">{u.email || "—"}</td>
                <td className="py-3 px-4">{u.phone_no || "—"}</td>

                {/* Role badge */}
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 font-medium">
                    {u.role || "N/A"}
                  </span>
                </td>

                {/* District - Circle */}
                <td className="py-3 px-4 text-sm text-gray-700">
                  {u?.district?.locname_eng
                    ? `${u.district.locname_eng}${u?.circle?.locname_eng ? ` - ${u.circle.locname_eng}` : ""}`
                    : "N/A"}
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      title="Edit"
                      onClick={() => navigate(`/user-update/${u.id}`)}
                      className="p-2 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Uncomment if delete needed */}
                    {/* <button
                      title="Delete"
                      onClick={() => confirm(`Delete ${u.username}?`) && alert('Deleted')}
                      className="p-2 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    >
                      <Trash2 size={16} />
                    </button> */}
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
        Showing {Math.min(users.length, pageSize)} of {users.length}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 rounded-md border bg-white hover:bg-purple-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <div className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 font-medium shadow">
          {page}
        </div>

        <button
          className="px-3 py-1 rounded-md border bg-white hover:bg-pink-50"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  </motion.div>
);

}
