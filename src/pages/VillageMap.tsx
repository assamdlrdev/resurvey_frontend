import MapViewCom from "@/components/MapView";
import ApiService from "@/services/ApiService";
import { FilterLocationStore } from "@/store/SurveyStore";
import { Label } from "@radix-ui/react-label";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const VillageMap: React.FC = () => {
    const { districts, circles, mouzas, lots, villages, setCircles, setMouzas, setLots, setVillages, getDistricts, getCircles, getMouzas, getLots, getVillages } = FilterLocationStore();
    const { distCode, subdivCode, cirCode, mouzaPargonaCode, lotNo, villTownprtCode, setDistCode, setSubdivCode, setCirCode, setMouzaPargonaCode, setLotNo, setVillTownprtCode } = FilterLocationStore();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [map_geojson, setMapGeojson] = useState<any>(null);

    useEffect(() => {
        if (location.pathname == '/village-map') {
            const params = new URLSearchParams(window.location.search);
            const loc = params.get('loc');
            getVillageMapData(loc);
            if (districts.length == 0) {
                getDistricts();
            }
            var loc_codes_array = loc ? loc.split('-') : [];
            if (loc_codes_array.length >= 1) {
                const dist_code = loc_codes_array[0];
                setDistCode(dist_code);
            }
            if (loc_codes_array.length >= 2) {
                const subdiv_code = loc_codes_array.slice(0, 2).join('-');
                setSubdivCode(subdiv_code);
            }
            if (loc_codes_array.length >= 3) {
                const cir_code = loc_codes_array.slice(0, 3).join('-');
                setCirCode(cir_code);
            }
            if (loc_codes_array.length >= 4) {
                const mouza_code = loc_codes_array.slice(0, 4).join('-');
                setMouzaPargonaCode(mouza_code);
            }
            if (loc_codes_array.length >= 5) {
                const lot_no = loc_codes_array.slice(0, 5).join('-');
                setLotNo(lot_no);
            }
            if (loc_codes_array.length >= 6) {
                const vill_code = loc_codes_array.slice(0, 6).join('-');
                setVillTownprtCode(vill_code);
            }
        }

    }, [location]);

    const getVillageMapData = async (loc: string) => {
        if (!loc || loc == '' && loc == undefined) {
            return;
        }
        const data = {
            loc: loc
        };
        setLoading(true);
        const response = await ApiService.get('api/report/village_map_data', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        setMapGeojson(response.map_geojson);

    };

    useEffect(() => {
        if (distCode != '') {
            if (circles.length == 0) {
                resetField('circle');
                getCircles(distCode);
            } else {
                //check if dist code changed
                if (circles[0].dist_code != distCode) {
                    resetField('circle');
                    getCircles(distCode);
                }
            }
        } else {
            resetField('circle');
        }
    }, [distCode]);

    useEffect(() => {
        if (cirCode != '') {
            if (mouzas.length == 0) {
                getMouzas(cirCode);
            } else {
                //check if cir code changed
                const cir_code_parts = cirCode.split('-');
                var dist_code = cir_code_parts[0];
                var subdiv_code = cir_code_parts[1];
                var cir_code = cir_code_parts[2];
                if (mouzas[0].dist_code != dist_code || mouzas[0].subdiv_code != subdiv_code || mouzas[0].cir_code != cir_code) {
                    getMouzas(cirCode);
                }
            }
        } else {
            setMouzas([]);
            resetField('mouza');
        }
    }, [cirCode]);

    useEffect(() => {
        if (mouzaPargonaCode != '') {
            if (lots.length == 0) {
                getLots(mouzaPargonaCode);
            }
            else {
                //check if mouza code changed
                const mouza_code_parts = mouzaPargonaCode.split('-');
                var dist_code = mouza_code_parts[0];
                var subdiv_code = mouza_code_parts[1];
                var cir_code = mouza_code_parts[2];
                var mouza_code = mouza_code_parts[3];
                if (lots[0].dist_code != dist_code || lots[0].subdiv_code != subdiv_code || lots[0].cir_code != cir_code || lots[0].mouza_code != mouza_code) {
                    getLots(mouzaPargonaCode);
                }
            }
        } else {
            setLots([]);
            resetField('lot');
        }
    }, [mouzaPargonaCode]);

    useEffect(() => {
        if (lotNo) {
            if (villages.length == 0) {
                getVillages(lotNo);
            }
            else {
                //check if lot code changed
                const lot_code_parts = lotNo.split('-');
                var dist_code = lot_code_parts[0];
                var subdiv_code = lot_code_parts[1];
                var cir_code = lot_code_parts[2];
                var mouza_code = lot_code_parts[3];
                var lot_no = lot_code_parts[4];
                if (villages[0].dist_code != dist_code || villages[0].subdiv_code != subdiv_code || villages[0].cir_code != cir_code || villages[0].mouza_code != mouza_code || villages[0].lot_no != lot_no) {
                    getVillages(lotNo);
                }
            }
        } else {
            setVillages([]);
            resetField('vill');
        }
    }, [lotNo]);

    const onVillageChange = (value: string) => {
        setVillTownprtCode(value);
        getVillageMapData(value);
    };

    const resetField = (type: string) => {
        if (type == 'circle') {
            setCircles([]);
            setMouzas([]);
            setLots([]);
            setVillages([]);
            setMapGeojson(null);

            setSubdivCode('');
            setCirCode('');
            setMouzaPargonaCode('');
            setLotNo('');
            setVillTownprtCode('');
        }
        else if (type == 'mouza') {
            setMouzas([]);
            setLots([]);
            setVillages([]);
            setMapGeojson(null);
            
            setMouzaPargonaCode('');
            setLotNo('');
            setVillTownprtCode('');
        }
        else if (type == 'lot') {
            setLots([]);
            setVillages([]);
            setMapGeojson(null);
            
            setLotNo('');
            setVillTownprtCode('');
        }
        else if (type == 'vill') {
            setMapGeojson(null);
        }
        else if (type == 'dist') {
            setCircles([]);
            setMouzas([]);
            setLots([]);
            setVillages([]);

            setSubdivCode('');
            setCirCode('');
            setMouzaPargonaCode('');
            setLotNo('');
            setVillTownprtCode('');
            setMapGeojson(null);
        }
    };


    return (
        <div className="p-6 h-100vh">
            <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <Label htmlFor="district">District</Label>
                        <select
                            id="district"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={distCode}
                            onChange={(e: any) => setDistCode(e.currentTarget.value)}
                        >
                            <option value="">Select District</option>
                            {
                                districts && districts.length > 0 && districts.map((ddata, index) => <option key={index} value={ddata.key}>{ddata.value}</option>)
                            }

                        </select>

                    </div>
                    <div>
                        <Label htmlFor="circle">Circle</Label>
                        <select
                            id="circle"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={cirCode}
                            onChange={(e: any) => setCirCode(e.currentTarget.value)}
                        >
                            <option value="">Select Circle</option>
                            {circles && circles.length > 0 && circles.map((cdata, index) => <option key={index} value={`${cdata.dist_code}-${cdata.subdiv_code}-${cdata.cir_code}`}>{`${cdata.loc_name} (${cdata.locname_eng})`}</option>)}
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="mouza">Mouza</Label>
                        <select
                            id="mouza"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={mouzaPargonaCode}
                            onChange={(e: any) => setMouzaPargonaCode(e.currentTarget.value)}
                        >
                            <option value="">Select Mouza</option>

                            {
                                mouzas && mouzas.length > 0 && mouzas.map((mdata, index) => <option key={index} value={`${mdata.dist_code}-${mdata.subdiv_code}-${mdata.cir_code}-${mdata.mouza_code}`}>{`${mdata.loc_name} (${mdata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="lot">Lot</Label>
                        <select
                            id="lot"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={lotNo}
                            onChange={(e: any) => setLotNo(e.currentTarget.value)}
                        >
                            <option value="">Select Lot</option>
                            {
                                lots && lots.length > 0 && lots.map((ldata, index) => <option key={index} value={`${ldata.dist_code}-${ldata.subdiv_code}-${ldata.cir_code}-${ldata.mouza_code}-${ldata.lot_no}`}>{`${ldata.loc_name} (${ldata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="village">Village</Label>
                        <select
                            id="village"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={villTownprtCode}
                            onChange={(e: any) => onVillageChange(e.currentTarget.value)}
                        >
                            <option value="">Select Village</option>
                            {
                                villages && villages.length > 0 && villages.map((vdata, index) => <option key={index} value={`${vdata.dist_code}-${vdata.subdiv_code}-${vdata.cir_code}-${vdata.mouza_code}-${vdata.lot_no}-${vdata.village_code}`}>{`${vdata.loc_name} (${vdata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
                </div>

            </div>
            {loading && <div>Loading map data...</div>}
            {!loading && map_geojson &&
                <MapViewCom mapdata={map_geojson} />
            }
        </div>
    );
};

export default VillageMap;