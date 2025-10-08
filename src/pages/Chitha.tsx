import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const Chitha: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [chithaData, setChithaData] = useState<any>(null);

    useEffect(() => {
        if (location.pathname == '/chitha-view') {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            getChithaData(id);
        }

    }, [location]);

    const getChithaData = async (id: string) => {
        if (!id || id == '' && id == undefined) {
            return;
        }
        const data = {
            id: id
        };
        setLoading(true);
        const response = await ApiService.get('get_chitha_data', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        setChithaData(response.data);
        console.log(response.data);

    };

    const handleDownloadPDF = async () => {
        const content = document.getElementById("chitha-content");
        if (!content) return;

        // Dynamically import required libraries
        const jsPDFModule = await import("jspdf");
        const html2canvasModule = await import("html2canvas");
        const jsPDF = jsPDFModule.jsPDF;
        const html2canvas = html2canvasModule.default;

        // Create canvas from HTML
        const canvas = await html2canvas(content, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const pdfWidth = imgWidth * ratio;
        const pdfHeight = imgHeight * ratio;

        pdf.addImage(
            imgData,
            "PNG",
            (pageWidth - pdfWidth) / 2,
            20,
            pdfWidth,
            pdfHeight
        );

        pdf.save("chitha.pdf");
        toast.success("PDF downloaded successfully!");
    };



    return (
        <div className="p-6">
            <div className="flex justify-end mb-4 gap-2 print:hidden">
                {/* <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Print
                </button> */}
                <button
                    onClick={handleDownloadPDF}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Download as PDF
                </button>
            </div>
            <div id="chitha-content">
                <h2 className="text-center text-lg font-semibold mb-2">
                    অসম অনুসূচী XXXVII,প্ৰপত্ৰ নং ৩০
                </h2>
                <h1 className="text-center text-xl font-bold mb-4">
                    Chitha for Surveyed Villages / জৰীপ হোৱা গাঁৱৰ চিঠা
                </h1>

                {/* Top Section */}
                <table className="w-full border border-black text-sm text-center">
                    <tbody>
                        <tr>
                            <td className="border border-black p-2">জিলা: <span>{chithaData?.location.dist_name}</span></td>
                            <td className="border border-black p-2">মহকুমা: <span>{chithaData?.location.subdiv_name}</span></td>
                            <td className="border border-black p-2">চক্র: <span>{chithaData?.location.circle_name}</span></td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2">মৌজা: <span>{chithaData?.location.mouza_name}</span></td>
                            <td className="border border-black p-2">লট নং: <span>{chithaData?.location.lot_name}</span></td>
                            <td className="border border-black p-2">গাঁও <span>{chithaData?.location.village_name}</span></td>
                        </tr>
                    </tbody>
                </table>

                {/* Middle Section */}
                <table className="w-full border border-black text-sm text-center mt-4">
                    <thead>
                        <tr>
                            <th className="border border-black p-2" rowSpan={2}>পুৰনা দাগ নং</th>
                            <th className="border border-black p-2" rowSpan={2}>অংশ দাগ নং</th>
                            <th className="border border-black p-2" rowSpan={2}>নতুন দাগ নং</th>
                            <th className="border border-black p-2" colSpan={2}>মাটিৰ শ্ৰেণী</th>
                            <th className="border border-black p-2" colSpan={2}>কালি</th>
                            <th className="border border-black p-2" colSpan={2}>পট্টা নং আৰু প্ৰকাৰ</th>
                            <th className="border border-black p-2" rowSpan={2}>ৰাজহ (টকা)</th>
                            <th className="border border-black p-2" rowSpan={2}>স্থানীয় কৰ (টকা)</th>
                            <th className="border border-black p-2" rowSpan={2}>পট্টাদাৰৰ নাম, পিতাৰ নাম আৰু ঠিকনা</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ নাম</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ অভিভাৱকৰ নাম</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ অভিভাৱকৰ সৈতে সম্পৰ্ক</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলকাৰীয়ে কৰা লেনদেন/অধিগ্ৰহণৰ পদ্ধতি</th>
                            <th className="border border-black p-2" rowSpan={2}>নামজাৰী হবলগীয়া দখলদাৰৰ নাম, পিতাৰ নাম, ঠিকনা</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ লিংগ</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ জন্ম তাৰিখ</th>
                            <th className="border border-black p-2" rowSpan={2}>ৰায়ত/ আধিয়াৰৰ নাম, পিতাৰ নাম, ঠিকনা</th>
                            <th className="border border-black p-2" rowSpan={2}>দখলদাৰৰ ৰায়তৰ সৈতে সম্পৰ্ক</th>
                            <th className="border border-black p-2" rowSpan={2}>ৰায়তৰ প্ৰকাৰ/ খতিয়ন নং, খাজানা বা ফছলৰ নিৰিখ</th>
                            <th className="border border-black p-2" rowSpan={2}>মন্তব্য</th>
                        </tr>
                        <tr>
                            <th className="border border-black p-2">পুৰনা মাটিৰ শ্ৰেণী</th>
                            <th className="border border-black p-2">বৰ্তমান মাটিৰ ব্যৱহাৰ</th>
                            <th className="border border-black p-2 text-nowrap">বি-ক-লে</th>
                            <th className="border border-black p-2 text-nowrap">বৰ্গ মিটাৰ</th>
                            <th className="border border-black p-2">পুৰনা পট্টা নং আৰু প্ৰকাৰ</th>
                            <th className="border border-black p-2">নতুন পট্টা নং আৰু প্ৰকাৰ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Header Row (serials etc.) */}
                        <tr>
                            <td className="border border-black p-2">১</td>
                            <td className="border border-black p-2">১/ক</td>
                            <td className="border border-black p-2">১/খ</td>
                            <td className="border border-black p-2">২</td>
                            <td className="border border-black p-2">২/ক</td>
                            <td className="border border-black p-2">৩</td>
                            <td className="border border-black p-2">৩/ক</td>
                            <td className="border border-black p-2">৪</td>
                            <td className="border border-black p-2">৪/ক</td>
                            <td className="border border-black p-2">৫</td>
                            <td className="border border-black p-2">৬</td>
                            <td className="border border-black p-2">৭</td>
                            <td className="border border-black p-2">৭/ক</td>
                            <td className="border border-black p-2">৭/খ</td>
                            <td className="border border-black p-2">৭/গ</td>
                            <td className="border border-black p-2">৭/ঘ</td>
                            <td className="border border-black p-2">৭/ঙ</td>
                            <td className="border border-black p-2">৭/চ</td>
                            <td className="border border-black p-2">৮</td>
                            <td className="border border-black p-2">৯</td>
                            <td className="border border-black p-2">৯/ক</td>
                            <td className="border border-black p-2">১০</td>
                            <td className="border border-black p-2">১১</td>
                        </tr>

                        {/* Data Rows */}
                        {chithaData?.possessors?.map((possessor: any, idx: number) => (
                            <tr key={idx}>
                                {idx === 0 && (
                                    <>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.dag_no}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.survey_no}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">&nbsp;</td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.dag.land_class_old}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.land_current_use}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.dag_area_b}-{chithaData?.part_dag.dag_area_k}-{Number(chithaData?.part_dag.dag_area_lc).toFixed(1)}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {Math.floor(Number(chithaData?.part_dag.dag_area_sqmtr))}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2 text-nowrap">
                                            {chithaData?.dag.patta_no}, {chithaData?.dag.patta_type_old}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2 text-nowrap">
                                            0, {chithaData?.part_dag.patta_type}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.dag_revenue}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.part_dag.dag_local_tax}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.pattadars?.map((pattadar: any, i: number) => (
                                                <div key={i} className="py-0">
                                                    {pattadar.pdar_name}<br />
                                                    {pattadar.pdar_father}<br />
                                                    {pattadar.pdar_add1}{pattadar.pdar_add2}{pattadar.pdar_add3}
                                                    {i !== chithaData.pattadars.length - 1 && <hr className="my-2" />}
                                                </div>
                                            ))}
                                        </td>
                                    </>
                                )}

                                <td className="border-r border-black p-2">{possessor.name || '\u00A0'}</td>
                                <td className="border-r border-black p-2">{possessor.guard_name || '\u00A0'}</td>
                                <td className="border-r border-black p-2">{possessor.guard_relation_name || '\u00A0'}</td>
                                <td className="border-r border-black p-2">{possessor.mode_of_acquisition_name || '\u00A0'}</td>
                                <td className="border-r border-black p-2">{possessor.mut_possessor_name || '\u00A0'}, {possessor.mut_possessor_father_name || '\u00A0'} <br /> {possessor.mut_possessor_address || '\u00A0'}</td>
                                <td className="border-r border-black p-2">{possessor.gender ? possessor.gender.charAt(0).toUpperCase() + possessor.gender.slice(1).toLowerCase() : '\u00A0'}</td>
                                <td className="border-r border-black p-2">
                                    {possessor.dob
                                        ? new Date(possessor.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                                        : '\u00A0'}
                                </td>

                                {idx === 0 && (
                                    <>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.tenants?.map((tenant: any, i: number) => (
                                                <div key={i} className="mb-2">
                                                    {tenant.tenant_name || '\u00A0'}<br />
                                                    {tenant.tenants_father || '\u00A0'}<br />
                                                    {tenant.tenants_add1 || "N/A"}{tenant.tenants_add2 ? `, ${tenant.tenants_add2}` : ""}
                                                    {i !== chithaData.tenants.length - 1 && <hr className="my-2" />}
                                                </div>
                                            ))}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">
                                            {chithaData?.tenants?.map((tenant: any, i: number) => (
                                                <div key={i} className="mb-2">
                                                    {tenant.khatian_no || '\u00A0'} {tenant.revenue_tenant}
                                                    {i !== chithaData.tenants.length - 1 && <hr className="my-2" />}
                                                </div>
                                            ))}
                                        </td>
                                        <td rowSpan={chithaData.possessors.length} className="border border-black p-2">&nbsp;</td>
                                    </>
                                )}
                                <td className="border-r border-black p-2">{possessor.remarks || '\u00A0'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Chitha;