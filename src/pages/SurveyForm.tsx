import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
// import { useToast } from "@/hooks/use-toast";
import ChithaView from "@/components/ChithaView";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Constants from "@/config/Constants";
import ApiService from "@/services/ApiService";
import StorageService from "@/services/StorageService";
import Loader from "@/components/Loader";
import PartDagEntryForm from "@/components/PartDagEntryForm";
import { useDagStore } from "@/store/SurveyStore";
import PartDagsView from "@/components/PartDagsView";
import { useMasterDataStore } from "@/store/SurveyStore";
import MapView from "@/components/MapView";
import MapViewCom from "@/components/MapView";

interface DagType {
  dag_no: string
}
interface Village{
  dist_code:string;
  subdiv_code:string;
  cir_code:string;
  mouza_pargona_code:string;
  lot_no:string;
  vill_townprt_code:string;
  loc_name:string;
  locname_eng:string;
}




export default function SurveyData() {
  const { dagNo, setDagNo, getData, resetDagData, getCreatedPartDags, setLoading, isLoading } = useDagStore();
  const { getMasterData } = useMasterDataStore();
  const [mode, setMode] = useState<string>("reference");
  const [showDagDropdown, setShowDagDropdown] = useState(false);
  const [dagNos, setDagNos] = useState<DagType[]>([]
  );
  // const [dagNo, setDagNo] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [district, setDistrict] = useState<string>('');
  const [circle, setCircle] = useState<string>('');
  const [mouza, setMouza] = useState<string>('');
  const [lot, setLot] = useState<string>('');
  const [vill, setVill] = useState<string>('');
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [circleData, setCircleData] = useState<any[]>([]);
  const [mouzaData, setMouzaData] = useState<any[]>([]);
  const [lotData, setLotData] = useState<any[]>([]);
  const [villData, setVillData] = useState<any[]>([]);
  const [originalDagInfo, setOriginalDagInfo] = useState<any[]>([]);
  const [mapGeoJson, setMapGeoJson] = useState<string>('');
  // const [villObj,setVillObj] = 


  useEffect(() => {
    if (location.pathname == '/survey-form') {
      resetDagData();
      getDistricts();
    }
  }, [location]);

  useEffect(() => {
    if (district != '') {
      getMasterData(district);
      getCircles(district);
    }
    else {
      // toast.error('District not set');
      // return;
    }
  }, [district]);

  useEffect(() => {
    if (circle != '') {
      getMouza(circle);
    }
    else {
      // toast.error('Circle not set');
      // return;
    }
  }, [circle]);

  useEffect(() => {
    if (mouza != '') {
      getLot(mouza);
    }
    else {
      // toast.error('Circle not set');
      // return;
    }
  }, [mouza]);

  useEffect(() => {
    if (lot) {
      getVillage(lot);
    }
  }, [lot]);

  useEffect(() => {
    if (vill) {
      setDagNo('');
      setShowDagDropdown(false);
      getDags(vill);
    }
  }, [vill]);

  useEffect(() => {
    if (dagNo && vill) {
      getData(dagNo, vill);
    } else {
      resetDagData();
    }
  }, [dagNo]);

  const goTo = (url: string) => {
    navigate(url);
  };

  const dagNoUpdated = (new_dag_no: string) => {
    setDagNo(new_dag_no);
    setMode('reference');
  }

  const resetField = (type: string) => {
    if (type == 'circle') {
      setMouzaData([]);
      setLotData([]);
      setVillData([]);
      setDagNos([]);

      setDagNo('');
      setVill('');
      setLot('');
      setMouza('');
    }
    else if (type == 'mouza') {
      setLotData([]);
      setVillData([]);
      setDagNos([]);

      setDagNo('');
      setVill('');
      setLot('');
    }
    else if (type == 'lot') {
      setVillData([]);
      setDagNos([]);

      setDagNo('');
      setVill('');
    }
    else if (type == 'vill') {
      setDagNos([]);

      setDagNo('');
    }
    else if (type == 'dist') {
      setCircleData([]);
      setMouzaData([]);
      setLotData([]);
      setVillData([]);
      setDagNos([]);

      setDagNo('');
      setVill('');
      setLot('');
      setMouza('');
      setCircle('');

    }
  };

  const getDistricts = async () => {
    resetField('dist');
    const data = {
      // api_key:Constants.API_SECRET
    };
    setLoading(true);
    const response = await ApiService.get('get_districts', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }
    // const districts = StorageService.getJwtCookieData(response.data);
    const districtsArr = Object.entries(response.data).map(([key, value]) => ({ key, value }));
    setDistrictData(districtsArr);

  };

  const getCircles = async (d: any) => {
    resetField('circle');
    const data = {
      // api_key:Constants.API_SECRET,
      dist_code: d
    };
    setLoading(true);
    const response = await ApiService.get('get_circles', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }
    // const circles = StorageService.getJwtCookieData(response.data);
    setCircleData(response.data);
  };

  const getMouza = async (c: any) => {
    resetField('mouza');
    const data = {
      // api_key:Constants.API_SECRET,
      cir_code: c
    };
    setLoading(true);
    const response = await ApiService.get('get_mouzas', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }

    setMouzaData(response.data);
    // console.log(response);

  };

  const getLot = async (m: any) => {
    resetField('lot');
    const data = {
      mouza_pargona_code: m
    };
    setLoading(true);
    const response = await ApiService.get('get_lots', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }

    setLotData(response.data);

    // console.log(response);
  };

  const getVillage = async (l: any) => {
    resetField('vill');
    const data = {
      lot_no: l
    };
    setLoading(true);
    const response = await ApiService.get('get_vills', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }

    // console.log(response.data);

    setVillData(response.data);
  };

  const getDags = async (v: any) => {
    setMapGeoJson("");
    const data = {
      vill_townprt_code: v
    };

    setLoading(true);
    const response = await ApiService.get('get_dags', JSON.stringify(data));
    setLoading(false);

    if (response.status !== 'y') {
      toast.error(response.msg);
      return;
    }
    if (response.data == 'N') {
      toast.error('No Data!');
      setDagNos([]);
      return;
    }
    setMapGeoJson(response.map_geojson);
    setDagNos(response.data);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">

      <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-medical-900 mb-2">Survey Form</h1>
        </div>
        <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="district">District</Label>
              <select
                id="district"
                className="w-full border rounded px-3 py-2 mt-1"
                value={district}
                onChange={(e: any) => setDistrict(e.currentTarget.value)}
              >
                <option value="">Select District</option>
                {
                  districtData && districtData.length > 0 && districtData.map((ddata, index) => <option key={index} value={ddata.key}>{ddata.value}</option>)
                }

              </select>

            </div>
            <div>
              <Label htmlFor="circle">Circle</Label>
              <select
                id="circle"
                className="w-full border rounded px-3 py-2 mt-1"
                value={circle}
                onChange={(e: any) => setCircle(e.currentTarget.value)}
              >
                <option value="">Select Circle</option>
                {circleData && circleData.length > 0 && circleData.map((cdata, index) => <option key={index} value={`${cdata.dist_code}-${cdata.subdiv_code}-${cdata.cir_code}`}>{`${cdata.loc_name} (${cdata.locname_eng})`}</option>)}
              </select>

            </div>
            <div>
              <Label htmlFor="mouza">Mouza</Label>
              <select
                id="mouza"
                className="w-full border rounded px-3 py-2 mt-1"
                value={mouza}
                onChange={(e: any) => setMouza(e.currentTarget.value)}
              >
                <option value="">Select Mouza</option>

                {
                  mouzaData && mouzaData.length > 0 && mouzaData.map((mdata, index) => <option key={index} value={`${mdata.dist_code}-${mdata.subdiv_code}-${mdata.cir_code}-${mdata.mouza_code}`}>{`${mdata.loc_name} (${mdata.locname_eng})`}</option>)
                }
              </select>

            </div>
            <div>
              <Label htmlFor="lot">Lot</Label>
              <select
                id="lot"
                className="w-full border rounded px-3 py-2 mt-1"
                value={lot}
                onChange={(e: any) => setLot(e.currentTarget.value)}
              >
                <option value="">Select Lot</option>
                {
                  lotData && lotData.length > 0 && lotData.map((ldata, index) => <option key={index} value={`${ldata.dist_code}-${ldata.subdiv_code}-${ldata.cir_code}-${ldata.mouza_code}-${ldata.lot_no}`}>{`${ldata.loc_name} (${ldata.locname_eng})`}</option>)
                }
              </select>

            </div>
            <div>
              <Label htmlFor="village">Village</Label>
              <select
                id="village"
                className="w-full border rounded px-3 py-2 mt-1"
                value={vill}
                onChange={(e: any) => setVill(e.currentTarget.value)}
              >
                <option value="">Select Village</option>
                {
                  villData && villData.length > 0 && villData.map((vdata, index) => <option key={index} value={`${vdata.dist_code}-${vdata.subdiv_code}-${vdata.cir_code}-${vdata.mouza_code}-${vdata.lot_no}-${vdata.village_code}-${vdata.lgd_code}`}>{`${vdata.loc_name} (${vdata.locname_eng})`}</option>)
                }
              </select>

            </div>
          </div>
          <div className="mt-4 relative">
            <Label htmlFor="dagNo">Dag No</Label>
            <Input
              id="dagNo"
              placeholder="Enter Dag No"
              autoComplete="off"
              onFocus={() => setShowDagDropdown(true)}
              onBlur={() => setTimeout(() => setShowDagDropdown(false), 150)}
              value={dagNo}
              onChange={(e: any) => dagNoUpdated(e.currentTarget.value)}
            />

            {showDagDropdown && (
              <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto p-2 flex flex-wrap gap-2">
                {dagNos && dagNos.length > 0 && dagNos.map((dag, index) => (
                  <button
                    type="button"
                    key={index}
                    className="text-center rounded-full bg-medical-100 hover:bg-green-400 w-10 h-10 flex items-center justify-center font-semibold text-medical-900 shadow aspect-square"
                    onMouseDown={() => {
                      dagNoUpdated(dag.dag_no);
                      setShowDagDropdown(false);
                    }}
                  >
                    {dag.dag_no}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => setMode(val)}
            className="bg-white rounded-lg p-1 shadow-sm 
               flex flex-wrap gap-2 sm:flex-nowrap sm:gap-0"
          >
            <ToggleGroupItem
              value="reference"
              className="px-4 py-2 text-sm sm:px-6 sm:py-2 w-full sm:w-auto"
            >
              Dharitry Data
            </ToggleGroupItem>

            <ToggleGroupItem
              disabled={!dagNo}
              value="input"
              className="px-4 py-2 text-sm sm:px-6 sm:py-2 w-full sm:w-auto"
            >
              Enter Possessor Details
            </ToggleGroupItem>

            <ToggleGroupItem
              value="part_dags"
              className="px-4 py-2 text-sm sm:px-6 sm:py-2 w-full sm:w-auto"
            >
              Existing Part Dags{" "}
              <span className="text-gray-500">({getCreatedPartDags().length})</span>
            </ToggleGroupItem>

            {(mapGeoJson && vill) && (
              <ToggleGroupItem
                value="map_view"
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 w-full sm:w-auto"
              >
                Draft Bhunaksa Map
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </div>


        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-center">
              {mode === "reference"
                ? "Dharitry Data"
                : mode === "input"
                  ? "Possessor Details Entry"
                  :mode == 'map_view' 
                  ? 'Draft Bhunaksa MAp View'
                  : "Existing Part Dags"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {mode === "reference" && <ChithaView />}
            {mode === "input" && (
              <PartDagEntryForm
                dagNo={dagNo}
                setDagNo={setDagNo}
                vill={vill}
                mapdata={mapGeoJson}
                setVill={setVill}
              />
            )}
            {mode === "part_dags" && <PartDagsView />}
            {(mode === 'map_view' && mapGeoJson && vill) && <MapViewCom mapdata={mapGeoJson} />}
          </CardContent>
        </Card>

        <Toaster position="top-center" />
        <Loader loading={isLoading} />
      </div>
    </div>
  );
}