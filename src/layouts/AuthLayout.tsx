// src/layouts/AuthLayout.tsx

import { Outlet } from "react-router-dom";
import { Brain, Shield, ActivitySquare, SplitIcon, Link } from "lucide-react";

export default function AuthLayout() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-medical-50">
            <div className="w-full min-h-screen flex flex-col lg:flex-row">
                <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-medical-50 to-medical-100 p-8 lg:p-16 flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/auth.jpg"
                            alt="Medical Technology"
                            className="w-full h-full object-cover opacity-10"
                        />
                    </div>
                    <div className="max-w-xl mx-auto relative z-10">
                        <h1 className="text-4xl font-bold text-medical-700 mb-4">Resurvey Portal</h1>
                        <p className="text-medical-600 mb-12">
                            This Portal is used for splitting existing DAGs into multiple part DAGs of specified districts and all other related data entries including property feature details. It can be accessed by Surveyors and admin. The system is integrated with Dharitree.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                                <div className="p-2 bg-medical-100 rounded-lg">
                                    <SplitIcon className="h-6 w-6 text-medical-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-700 mb-1">DAG Splitting</h3>
                                    <p className="text-medical-600">Split existing DAGs into multiple part DAGs for districts</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                                <div className="p-2 bg-medical-100 rounded-lg">
                                    <Shield className="h-6 w-6 text-medical-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-700 mb-1">Access Control</h3>
                                    <p className="text-medical-600">Accessible by Surveyors and Admin for secure operations</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
                                <div className="p-2 bg-medical-100 rounded-lg">
                                    <Link className="h-6 w-6 text-medical-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-medical-700 mb-1">Dharitree Integration</h3>
                                    <p className="text-medical-600">Seamless integration with Dharitree for property data</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white relative overflow-hidden min-h-screen lg:min-h-0">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/code.jpeg"
                            alt="Technology Background"
                            className="w-full h-full object-cover opacity-5"
                        />
                    </div>
                    <Outlet />
                </div>
            </div>
        </main>
    );
}
