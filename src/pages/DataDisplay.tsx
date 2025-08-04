import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DataItem {
  id: number;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Inactive" | "Pending";
  date: string;
  description: string;
}

const mockData: DataItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  category: ["Type A", "Type B", "Type C"][i % 3],
  priority: (["High", "Medium", "Low"] as const)[i % 3],
  status: (["Active", "Inactive", "Pending"] as const)[i % 3],
  date: new Date(2024, Math.floor(i / 10), (i % 28) + 1).toLocaleDateString(),
  description: `Description for item ${i + 1}. This is sample data for demonstration purposes.`,
}));

const ITEMS_PER_PAGE = 8;

export default function DataDisplay() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter data based on selected filters
  const filteredData = mockData.filter((item) => {
    return (
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (priorityFilter === "all" || item.priority === priorityFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case "category":
        setCategoryFilter(value);
        break;
      case "priority":
        setPriorityFilter(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Inactive":
        return "bg-gray-500/10 text-gray-700 border-gray-200";
      case "Pending":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-medical-900 mb-2">Data Display</h1>
          <p className="text-medical-600">Browse and filter your data with pagination</p>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger className="bg-white border-gray-200 z-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Type A">Type A</SelectItem>
                    <SelectItem value="Type B">Type B</SelectItem>
                    <SelectItem value="Type C">Type C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priorityFilter} onValueChange={(value) => handleFilterChange("priority", value)}>
                  <SelectTrigger className="bg-white border-gray-200 z-50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="bg-white border-gray-200 z-50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}