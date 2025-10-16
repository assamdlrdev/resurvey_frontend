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
import { FilterLocationStore } from "@/store/SurveyStore";

interface DagType {
  dag_no: string
}
interface Village {
  dist_code: string;
  subdiv_code: string;
  cir_code: string;
  mouza_pargona_code: string;
  lot_no: string;
  vill_townprt_code: string;
  loc_name: string;
  locname_eng: string;
}




export default function SurveyData() {
  const { dagNo, setDagNo, getData, resetDagData, getCreatedPartDags, setLoading, isLoading } = useDagStore();
  const { districts, circles, mouzas, lots, villages, setDistricts, setCircles, setMouzas, setLots, setVillages } = FilterLocationStore();
  const { distCode, subdivCode, cirCode, mouzaPargonaCode, lotNo, villTownprtCode, surveyFormMode, setDistCode, setSubdivCode, setCirCode, setMouzaPargonaCode, setLotNo, setVillTownprtCode, setSurveyFormMode } = FilterLocationStore();
  const { getMasterData } = useMasterDataStore();
  // const [mode, setMode] = useState<string>("reference");
  const [showDagDropdown, setShowDagDropdown] = useState(false);
  const [dagNos, setDagNos] = useState<DagType[]>([]
  );
  // const [dagNo, setDagNo] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  // const [district, setDistrict] = useState<string>('');
  // const [circle, setCircle] = useState<string>('');
  // const [mouza, setMouza] = useState<string>('');
  // const [lot, setLot] = useState<string>('');
  // const [vill, setVill] = useState<string>('');
  // const [districtData, setDistrictData] = useState<any[]>([]);
  // const [circleData, setCircleData] = useState<any[]>([]);
  // const [mouzaData, setMouzaData] = useState<any[]>([]);
  // const [lotData, setLotData] = useState<any[]>([]);
  // const [villData, setVillData] = useState<any[]>([]);
  const [originalDagInfo, setOriginalDagInfo] = useState<any[]>([]);
  const [mapGeoJson, setMapGeoJson] = useState<string>('');
  // const [villObj,setVillObj] = 


  useEffect(() => {
    if (location.pathname == '/survey-form') {
      resetDagData();
      if (districts.length == 0) {
        getDistricts();
      }
    }
  }, [location]);

  useEffect(() => {
    if (distCode != '') {
      getMasterData(distCode);
      if (circles.length == 0) {
        getCircles(distCode);
      } else {
        //check if dist code changed
        if (circles[0].dist_code != distCode) {
          getCircles(distCode);
        }
      }
    }
    else {
      // toast.error('District not set');
      // return;
    }
  }, [distCode]);

  useEffect(() => {
    if (cirCode != '') {
      if (mouzas.length == 0) {
        getMouza(cirCode);
      } else {
        //check if cir code changed
        const cir_code_parts = cirCode.split('-');
        var dist_code = cir_code_parts[0];
        var subdiv_code = cir_code_parts[1];
        var cir_code = cir_code_parts[2];
        if (mouzas[0].dist_code != dist_code || mouzas[0].subdiv_code != subdiv_code || mouzas[0].cir_code != cir_code) {
          getMouza(cirCode);
        }
      }
    }
    else {
      // toast.error('Circle not set');
      // return;
    }
  }, [cirCode]);

  useEffect(() => {
    if (mouzaPargonaCode != '') {
      if(lots.length == 0) {
        getLot(mouzaPargonaCode);
      }
      else {
        //check if mouza code changed
        const mouza_code_parts = mouzaPargonaCode.split('-');
        var dist_code = mouza_code_parts[0];
        var subdiv_code = mouza_code_parts[1];
        var cir_code = mouza_code_parts[2];
        var mouza_code = mouza_code_parts[3];
        if (lots[0].dist_code != dist_code || lots[0].subdiv_code != subdiv_code || lots[0].cir_code != cir_code || lots[0].mouza_code != mouza_code) {
          getLot(mouzaPargonaCode);
        }
      }
    }
    else {
      // toast.error('Circle not set');
      // return;
    }
  }, [mouzaPargonaCode]);

  useEffect(() => {
    if (lotNo) {
      if(villages.length == 0) {
        getVillage(lotNo);
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
          getVillage(lotNo);
        }
      }
    }
  }, [lotNo]);

  useEffect(() => {
    if (villTownprtCode) {
      setDagNo('');
      setShowDagDropdown(false);
      getDags(villTownprtCode);
    }
  }, [villTownprtCode]);

  useEffect(() => {
    if (dagNo && villTownprtCode) {
      getData(dagNo, villTownprtCode);
    } else {
      resetDagData();
    }
  }, [dagNo]);

  const goTo = (url: string) => {
    navigate(url);
  };

  const dagNoUpdated = (new_dag_no: string) => {
    setDagNo(new_dag_no);
    setSurveyFormMode('reference');
  }

  const resetField = (type: string) => {
    if (type == 'circle') {
      setMouzas([]);
      setLots([]);
      setVillages([]);
      setDagNos([]);

      setDagNo('');
      // setVillTownprtCode('');
      // setLotNo('');
      // setMouzaPargonaCode('');
    }
    else if (type == 'mouza') {
      setLots([]);
      setVillages([]);
      setDagNos([]);

      setDagNo('');
      // setVillTownprtCode('');
      // setLotNo('');
    }
    else if (type == 'lot') {
      setVillages([]);
      setDagNos([]);

      setDagNo('');
      // setVillTownprtCode('');
    }
    else if (type == 'vill') {
      setDagNos([]);

      setDagNo('');
    }
    else if (type == 'dist') {
      setCircles([]);
      setMouzas([]);
      setLots([]);
      setVillages([]);
      setDagNos([]);

      setDagNo('');
      // setVillTownprtCode('');
      // setLotNo('');
      // setMouzaPargonaCode('');
      // setCirCode('');

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
    setDistricts(districtsArr);

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
    setCircles(response.data);
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

    setMouzas(response.data);
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

    setLots(response.data);

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

    setVillages(response.data);
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
                onChange={(e: any) => setVillTownprtCode(e.currentTarget.value)}
              >
                <option value="">Select Village</option>
                {
                  villages && villages.length > 0 && villages.map((vdata, index) => <option key={index} value={`${vdata.dist_code}-${vdata.subdiv_code}-${vdata.cir_code}-${vdata.mouza_code}-${vdata.lot_no}-${vdata.village_code}-${vdata.lgd_code}`}>{`${vdata.loc_name} (${vdata.locname_eng})`}</option>)
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
            value={surveyFormMode}
            onValueChange={(val) => setSurveyFormMode(val)}
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

            {(mapGeoJson && villTownprtCode) && (
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
              {surveyFormMode === "reference"
                ? "Dharitry Data"
                : surveyFormMode === "input"
                  ? "Possessor Details Entry"
                  : surveyFormMode == 'map_view'
                    ? 'Draft Bhunaksa MAp View'
                    : "Existing Part Dags"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {surveyFormMode === "reference" && <ChithaView />}
            {surveyFormMode === "input" && (
              <PartDagEntryForm
                dagNo={dagNo}
                setDagNo={setDagNo}
                vill={villTownprtCode}
                mapdata={mapGeoJson}
                setVill={setVillTownprtCode}
              />
            )}
            {surveyFormMode === "part_dags" && <PartDagsView />}
            {(surveyFormMode === 'map_view' && mapGeoJson && villTownprtCode) && <MapViewCom mapdata={mapGeoJson} />}
          </CardContent>
        </Card>

        <Toaster position="top-center" />
        <Loader loading={isLoading} />
      </div>
    </div>
  );
}