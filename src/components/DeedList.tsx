import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

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

// $row_deeds['from_epanjeeyan_ngdrs'] = 'ngdrs';
//                 $row_deeds['unique_id'] = $deed->documentRegistrationNumber . ' & ' . $deed->id;
//                 $row_deeds['deed_type'] = '';
//                 $row_deeds['registration_date'] = $deed->documentRegistrationDate;
//                 $row_deeds['dbname'] = strtolower($deed->district);
//                 $row_deeds['fcaseno'] = $deed->documentRegistrationNumber;
//                 $row_deeds['comcaseno'] = $deed->id;
//                 $row_deeds['dag_no'] = $deed->dagNo;

interface DeedProps {
    deeds: DeedType[];
    viewDoc: (e: any) => void
};

const DeedList: React.FC<DeedProps> = ({deeds, viewDoc}) => {

    // const navigate = useNavigate();

    // const viewDoc = (e: any) => {
    //     navigate(`/deedDoc?id=${e.currentTarget.id}`);
    // };

    return (
        <div className="w-full">
            {/* Table View for md+ */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border rounded-lg bg-white text-sm md:text-base text-gray-800">
                    <thead>
                        <tr className="bg-medical-50">
                        <th className="px-2 py-2 border text-start">Document Unique Id </th>
                        <th className="px-2 py-2 border text-center">Date</th>
                        <th className="px-2 py-2 border text-center">Deed Type</th>
                        <th className="px-2 py-2 border text-center">From Epanjeeyan / NGDRS</th>
                        <th className="px-2 py-2 border text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deeds?.length ? (
                            deeds.map((d, index) => (<tr key={index} className="hover:bg-medical-50">
                                <td className="px-2 py-2 border text-start">{d.unique_id || "N/A"}</td>
                                <td className="px-2 py-2 border text-center">{d.registration_date}</td>
                                <td className="px-2 py-2 border text-center">{d.deed_type}</td>
                                <td className="px-2 py-2 border text-center">{d.from_epanjeeyan_ngdrs}</td>
                                <td className="px-2 py-2 border text-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        id={`${d.comcaseno}-${d.dbname}-${d.from_epanjeeyan_ngdrs}`}
                                        className="mt-2 w-full md:w-auto"
                                        onClick={viewDoc}
                                    >
                                        View Document
                                    </Button>
                                </td>
                            </tr>))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-medical-500">
                                📭 No Deeds Available
                                </td>
                            </tr>
                        ) }
                    </tbody>
                </table>
            </div>
      </div>
    );
};

export default DeedList;