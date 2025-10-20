"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  Clock,
  Eye,
  Music,
  Mail,
  User,
  Globe,
  Instagram,
  Youtube,
  ExternalLink,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Textarea } from "@/app/components/ui/textarea";
import axios from "axios";
import Image from "next/image";
type RequestStatus = "pending" | "approved" | "rejected";

const requestStatus = {
  pending: 1,
  approved: 2,
  rejected: 3,
  reviewing: 4,
};

const USER_MANAGEMENT_SERVICE_URL =
  process.env.NEXT_PUBLIC_USER_MANAGEMENT_SERVICE_URL;

interface ArtistRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  artistName: string;
  genre: string;
  bio: string;
  website?: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
  soundcloud?: string;
  portfolio?: string;
  submittedDate: string;
  status: { id: number; name: string };
}

export default function ArtistRequestsAdmin() {
  const [requests, setRequests] = useState<ArtistRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ArtistRequest | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/requests`);
        console.log("Requests", res.data);
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await axios.get(
          `${USER_MANAGEMENT_SERVICE_URL}/requests/${selectedRequest?.id}`
        );
        console.log("Selected Request", res.data);
        setSelectedRequest(res.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    getRequest();
  }, [selectedRequest?.id]);

  // Filter and search logic
  const filteredRequests: ArtistRequest[] = requests.filter((request) => {
    const matchesSearch =
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${request.firstName} ${request.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status.name === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status counts
  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status.name === "pending").length,
    approved: requests.filter((r) => r.status.name === "approved").length,
    rejected: requests.filter((r) => r.status.name === "rejected").length,
  };

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    const res = axios.put(
      `${USER_MANAGEMENT_SERVICE_URL}/requests/${requestId}/status?statusId=${requestStatus[newStatus]}`
    );
    console.log("Status Update Response", res.data);
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: { ...req.status, name: newStatus } }
          : req
      )
    );
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({
        ...selectedRequest,
        status: { ...selectedRequest.status, name: newStatus },
      });
    }
  };

  const handleViewDetails = (request: ArtistRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
    setAdminNotes("");
  };

  const getStatusColor = (status: { id: number; name: string }) => {
    switch (status.name) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    }
  };

  const getStatusIcon = (status: { id: number; name: string }) => {
    switch (status.name) {
      case "approved":
        return <Check className="w-3 h-3" />;
      case "rejected":
        return <X className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-950 via-slate-900 to-slate-950 p-6 pt-36">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Artist Requests
          </h1>
          <p className="text-white/70">Review and manage artist applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Requests",
              value: statusCounts.all,
              icon: Music,
              color: "from-orange-500 to-red-500",
            },
            {
              label: "Pending",
              value: statusCounts.pending,
              icon: Clock,
              color: "from-orange-400 to-orange-600",
            },
            {
              label: "Approved",
              value: statusCounts.approved,
              icon: Check,
              color: "from-green-400 to-green-600",
            },
            {
              label: "Rejected",
              value: statusCounts.rejected,
              icon: X,
              color: "from-red-400 to-red-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search by name, email, or artist name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Request ID
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Artist Name
                  </th>

                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Full Name
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Email
                  </th>
                  {/* <th className="text-left p-4 text-sm font-semibold text-white/70">Genre</th> */}
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Submitted
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-white/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleViewDetails(request)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="p-4 text-white/80">{request.id}</td>
                    <td className="p-4 text-white/80">Artist Request</td>
                    <td className="p-4 text-white/80">{request.artistName}</td>
                    <td className="p-4 text-white/80">
                      {request.firstName} {request.lastName}
                    </td>
                    <td className="p-4 text-white/80">{request.email}</td>
                    <td className="p-4 text-white/80">
                      {new Date(request.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`${getStatusColor(
                          request.status
                        )} flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.name.charAt(0).toUpperCase() +
                          request.status.name.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(request)}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.status.name === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request.id, "approved")
                              }
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(request.id, "rejected")
                              }
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Artist Request Details
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Review the complete application
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  className={`${getStatusColor(
                    selectedRequest.status
                  )} flex items-center gap-2 text-base px-4 py-2`}
                >
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status.name.charAt(0).toUpperCase() +
                    selectedRequest.status.name.slice(1)}
                </Badge>
                <div className="text-sm text-white/60">
                  Submitted:{" "}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Profile Details */}
              {selectedRequest.profile && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" />
                    Profile Details
                  </h3>
                  <div className="flex items-center gap-6 mb-4">
                    {selectedRequest.profile.profileImageURL && (
                      <Image
                        src={
                          selectedRequest?.profile?.profileImageURL ||
                          "/default-profile.png"
                        }
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow"
                      />
                    )}
                    <div>
                      <div className="text-xl font-bold text-white">
                        {selectedRequest.profile.firstName}{" "}
                        {selectedRequest.profile.lastName}
                      </div>
                      <div className="text-white/70">
                        {selectedRequest.profile.email}
                      </div>
                      {typeof selectedRequest.profile.isActive !==
                        "undefined" && (
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              selectedRequest.profile.isActive
                                ? "bg-green-600/30 text-green-400"
                                : "bg-red-600/30 text-red-400"
                            }`}
                          >
                            {selectedRequest.profile.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      )}
                      {selectedRequest.profile.role && (
                        <div className="mt-1 text-white/60 text-sm">
                          Role:{" "}
                          {selectedRequest.profile.role?.roleName
                            ?.charAt(0)
                            .toUpperCase() +
                            selectedRequest.profile.role?.roleName?.slice(1)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        Profile ID
                      </div>
                      <div className="text-white">
                        {selectedRequest.profile.profileId}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">
                        Updated At
                      </div>
                      <div className="text-white">
                        {selectedRequest.profile.updatedAt
                          ? new Date(
                              selectedRequest.profile.updatedAt
                            ).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-white/60 mb-1">First Name</div>
                    <div className="text-white">
                      {selectedRequest.firstName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Last Name</div>
                    <div className="text-white">{selectedRequest.lastName}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-white/60 mb-1">Email</div>
                    <div className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" />
                      {selectedRequest.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Artist Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-orange-500" />
                  Artist Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-white/60 mb-1">
                      Artist Name
                    </div>
                    <div className="text-xl font-bold text-white">
                      {selectedRequest.stageName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Genre</div>
                    <div className="text-white">
                      {selectedRequest.primaryGenre}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Bio</div>
                    <div className="text-white/80 leading-relaxed">
                      {selectedRequest.artistBio}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-500" />
                  Social Media & Portfolio
                </h3>
                <div className="space-y-3">
                  {selectedRequest.website && (
                    <a
                      href={selectedRequest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-orange-500 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{selectedRequest.website}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {selectedRequest.instagram && (
                    <a
                      href={`https://instagram.com/${selectedRequest.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-orange-500 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>@{selectedRequest.instagram}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {selectedRequest.spotify && (
                    <a
                      href={`https://open.spotify.com/artist/${selectedRequest.spotify}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-orange-500 transition-colors"
                    >
                      <Music className="w-4 h-4" />
                      <span>Spotify: {selectedRequest.spotify}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {selectedRequest.youtube && (
                    <a
                      href={`https://youtube.com/@${selectedRequest.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-orange-500 transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>@{selectedRequest.youtube}</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {selectedRequest.sampleWork && (
                    <a
                      href={selectedRequest.sampleWork}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-orange-500 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Admin Notes</h3>
                <Textarea
                  placeholder="Add notes about this request..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-24"
                />
              </div>

              {/* Action Buttons */}
              {selectedRequest.status.name === "pending" && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "approved");
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "rejected");
                      setIsDetailOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
