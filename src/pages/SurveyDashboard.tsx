import React, { useState } from "react";

// Example data structure for resurvey
const resurveyData = [
    {
        id: 1,
        district: "Kamrup",
        village: "Bihdia",
        dag: "12",
        total: 15,
        completed: 10,
        status: "Active",
        date: "2024-06-01",
    },
    {
        id: 2,
        district: "Kamrup",
        village: "Bihdia",
        dag: "13",
        total: 20,
        completed: 18,
        status: "Active",
        date: "2024-06-02",
    },
    {
        id: 3,
        district: "Nalbari",
        village: "Barkura",
        dag: "7",
        total: 10,
        completed: 10,
        status: "Closed",
        date: "2024-06-03",
    },
    {
        id: 4,
        district: "Nalbari",
        village: "Barkura",
        dag: "8",
        total: 12,
        completed: 8,
        status: "Active",
        date: "2024-06-04",
    },
];

// Get unique districts
const districts = Array.from(new Set(resurveyData.map((d) => d.district)));

const SurveyDashboard: React.FC = () => {
    const [districtFilter, setDistrictFilter] = useState<string>("all");

    // Filter data by district
    const filteredData =
        districtFilter === "all"
            ? resurveyData
            : resurveyData.filter((d) => d.district === districtFilter);

    // Calculate counters
    const totalCount = filteredData.reduce((acc, curr) => acc + curr.total, 0);
    const completedCount = filteredData.reduce((acc, curr) => acc + curr.completed, 0);

    // District wise counters
    const districtCounters = districts.map((district) => {
        const items = resurveyData.filter((d) => d.district === district);
        return {
            district,
            total: items.reduce((acc, curr) => acc + curr.total, 0),
            completed: items.reduce((acc, curr) => acc + curr.completed, 0),
        };
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Resurvey Dashboard Demo</h1>
                    <p className="text-medical-600">Track resurvey progress for each dag across districts</p>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-medical-700 text-lg font-semibold">Total Dags</div>
                        <div className="text-3xl font-bold text-medical-900">{totalCount}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-medical-700 text-lg font-semibold">Completed</div>
                        <div className="text-3xl font-bold text-medical-900">{completedCount}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-medical-700 text-lg font-semibold">Districts</div>
                        <div className="text-3xl font-bold text-medical-900">{districts.length}</div>
                    </div>
                </div>

                {/* District wise counters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {districtCounters.map((dc) => (
                        <div key={dc.district} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-medical-800 font-semibold">{dc.district}</span>
                                <span className="text-medical-600 text-sm">
                                    {dc.completed} / {dc.total} completed
                                </span>
                            </div>
                            <div className="w-full bg-medical-50 h-2 rounded mt-2">
                                <div
                                    className="bg-medical-400 h-2 rounded"
                                    style={{
                                        width: `${dc.total ? (dc.completed / dc.total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Controls */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <label className="text-medical-700 font-medium">Filter by District:</label>
                        <select
                            className="bg-medical-50 border border-medical-200 rounded px-3 py-2"
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                        >
                            <option value="all">All Districts</option>
                            {districts.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-medical-900">{item.village}</span>
                                <span className="text-medical-600 text-xs">{item.district}</span>
                            </div>
                            <div className="mb-1 text-medical-700">
                                Dag: <span className="font-bold">{item.dag}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-medical-600 text-sm">Total: {item.total}</span>
                                <span className="text-medical-600 text-sm">Completed: {item.completed}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "Active"
                                            ? "bg-medical-100 text-medical-700"
                                            : "bg-medical-200 text-medical-600"
                                        }`}
                                >
                                    {item.status}
                                </span>
                                <span className="text-xs text-medical-400">{item.date}</span>
                            </div>
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="col-span-full text-center text-medical-400 py-8">
                            No dags found for selected district.
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default SurveyDashboard;