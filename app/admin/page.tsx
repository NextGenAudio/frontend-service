"use client";

import { useState, useMemo, useEffect, use } from "react";
import {
  Search,
  Download,
  MoreVertical,
  Users,
  Music,
  Mic2,
  TrendingUp,
  TrendingDown,
  Mail,
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Inbox,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;
const MUSIC_LIBRARY_SERVICE_URL = 
  process.env.NEXT_PUBLIC_MUSIC_LIBRARY_SERVICE_URL;


interface User {
  profileId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profileImageURL: string;
  role: { roleId: number; roleName: string };
}

type SortField =
  | "profileId"
  | "firstName"
  | "lastName"
  | "email"
  | "createdAt"
  | "roleName";
type SortOrder = "asc" | "desc";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  // Remove statusFilter since it's not used in filtering
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [users, setUsers] = useState<User[]>([]);
  const [requestCount, setRequestCount] = useState(0);
    const [songCount, setSongCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${USER_MANAGEMENT_SERVICE_URL}/sonex/v1/auth/all-profiles`
        );
        console.log("Users", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    const fetchRequestCount = async () => {
      try {
        const res = await axios.get(
          `${USER_MANAGEMENT_SERVICE_URL}/requests/count`
        );
        console.log("Request Count", res.data);
        setRequestCount(res.data);
      } catch (err) {
        console.error("Failed to fetch request count:", err);
      }
    };

    const fetchSongCount = async () => {
      try {
        const res = await axios.get(
          `${MUSIC_LIBRARY_SERVICE_URL}/files/count`
        );
        console.log("Song Count", res.data);
        setSongCount(res.data);
      } catch (err) {
        console.error("Failed to fetch song count:", err);
      }
    };

    fetchUsers();
    fetchRequestCount();
    fetchSongCount();
  }, []);
  // Stats calculations
  const totalUsers = users.length;
  const totalSongs = 1247;
  const totalArtists = users.filter(
    (u) => u.role?.roleName === "artist"
  ).length;

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((user) => {
        const matchesSearch =
          user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role?.roleName === roleFilter);
    }
    filtered.sort((a, b) => {
      if (sortField === "createdAt") {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }
      if (sortField === "roleName") {
        const aVal = a.role?.roleName || "";
        const bVal = b.role?.roleName || "";
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      const aVal = a[sortField as keyof User] as string;
      const bVal = b[sortField as keyof User] as string;
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return filtered;
  }, [users, searchQuery, roleFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 pt-36 relative">
      {/* Header and Inbox aligned */}
      <div className="mb-8 flex items-center justify-between pr-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70">
            Manage users, monitor activity, and view insights
          </p>
        </div>
        <Button
          className="relative flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-yellow-400/40 rounded-full shadow-lg hover:bg-yellow-100/20 transition-all duration-200"
          onClick={() => router.push("/admin/review")}
          title="Inbox / Requests"
        >
          <Inbox className="w-7 h-7 text-yellow-500" />
          <span className="text-lg font-bold text-white">Inbox</span>
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow border border-white/30">
            {requestCount}
          </span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/70 text-sm mb-1">Total Users</h3>
          <p className="text-3xl font-bold text-white">{totalUsers}</p>
        </div>

        {/* Total Songs */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/70 text-sm mb-1">Total Songs</h3>
          <p className="text-3xl font-bold text-white">{songCount}</p>
        </div>

        {/* Total Artists */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-white/70 text-sm mb-1">Total Artists</h3>
          <p className="text-3xl font-bold text-white">{totalArtists}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Management Table */}
        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-orange-500"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Artist">Artist</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("profileId")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        User ID
                        <SortIcon field="profileId" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("firstName")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        First Name
                        <SortIcon field="firstName" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("lastName")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        Last Name
                        <SortIcon field="lastName" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        Email
                        <SortIcon field="email" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        Created At
                        <SortIcon field="createdAt" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      <Button
                        onClick={() => handleSort("roleName")}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        Role
                        <SortIcon field="roleName" />
                      </Button>
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.profileId}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">{user.profileId}</td>
                      <td className="py-3 px-4 text-white">{user.firstName}</td>
                      <td className="py-3 px-4 text-white">{user.lastName}</td>
                      <td className="py-3 px-4 text-white/80">{user.email}</td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(user.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role?.roleName === "admin"
                              ? "bg-orange-500/20 text-orange-400"
                              : user.role?.roleName === "artist"
                              ? "bg-purple-500/20 text-purple-400"
                              : user.role?.roleName === "moderator"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/10 text-white/70"
                          }`}
                        >
                          {user.role?.roleName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white/70 hover:text-white hover:bg-white/10 bg-slate-700"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
                          >
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-white/70 text-sm">
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Activity
            </h2>
            {/* <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    {activity.type === "upload" && (
                      <Music className="w-4 h-4 text-white" />
                    )}
                    {activity.type === "playlist" && (
                      <Users className="w-4 h-4 text-white" />
                    )}
                    {activity.type === "profile" && (
                      <Shield className="w-4 h-4 text-white" />
                    )}
                    {activity.type === "like" && (
                      <TrendingUp className="w-4 h-4 text-white" />
                    )}
                    {activity.type === "share" && (
                      <Mail className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {activity.user}
                    </p>
                    <p className="text-white/60 text-xs">{activity.action}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">New Users Today</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Songs Uploaded</span>
                <span className="text-white font-bold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Playlists Created</span>
                <span className="text-white font-bold">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Plays</span>
                <span className="text-white font-bold">8,432</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
