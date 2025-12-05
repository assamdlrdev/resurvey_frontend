import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { File, Users } from "lucide-react";

interface DeedType {
    unique_id: string;
    comcaseno: string;
    fcaseno: string;
    dag_no: string | number;
    registration_date: string;
    dbname: string;
    deed_type: string;
    from_epanjeeyan_ngdrs: string;
    // circle: string;
    // mouza: string;
    // village: string;
    // category: number | string;
    // conamount: number | string;
    // dtcomple: string;
    // barea: number | string;
    // karea: string | number;
    // larea: string | number;
    // reg_fee: number | string;
    // stampfee: number | string;
};


interface DeedProps {
    deeds: DeedType[];
    viewDoc: (e: any) => void
};

const DeedList: React.FC<DeedProps> = ({ deeds, viewDoc }) => {

    return (
        <CardContent className="p-4 sm:p-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
                <File className="h-5 w-5 text-indigo-500" />
                <p className="text-sm font-semibold text-medical-700">Documents</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {deeds?.length ? (
                    deeds.map((d, index) => (
                        <div
                            key={index}
                            className="p-3 border rounded-lg bg-white/60 shadow-sm hover:shadow transition"
                        >
                            <p className="text-sm font-medium text-medical-600">Unique Id:</p>
                            <p className="text-base text-medical-900">{d.unique_id || "N/A"}</p>

                            <p className="text-sm font-medium text-medical-600 mt-2">Date:</p>
                            <p className="text-base text-medical-900">{d.registration_date || "N/A"}</p>

                            <p className="text-sm font-medium text-medical-600 mt-2">Deed Type:</p>
                            <p className="text-base text-medical-900">{d.deed_type || "N/A"}</p>

                            <p className="text-sm font-medium text-medical-600 mt-2">From Epanjeeyan / NGDRS:</p>
                            <p className="text-base text-medical-900">{d.from_epanjeeyan_ngdrs || "N/A"}</p>

                            <div className="mt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    id={`${d.comcaseno}-${d.dbname}-${d.from_epanjeeyan_ngdrs}`}
                                    className="w-full"
                                    onClick={viewDoc}
                                >
                                    View Document
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-sm italic">No Documents Available in NGDRS for this Dag</p>
                )}
            </div>
        </CardContent>
    );
};

export default DeedList;