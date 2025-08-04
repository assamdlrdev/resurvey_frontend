import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import ChithaView from "@/components/ChithaView";

type FormMode = "reference" | "input";

interface InputFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const mockReferenceData = [
  { id: 1, title: "Sample Entry 1", category: "Type A", priority: "High", description: "This is a sample reference entry for demonstration purposes." },
  { id: 2, title: "Sample Entry 2", category: "Type B", priority: "Medium", description: "Another reference entry showing the data structure." },
  { id: 3, title: "Sample Entry 3", category: "Type A", priority: "Low", description: "Third sample entry for reference viewing." },
];

export default function SurveyData() {
  const [mode, setMode] = useState<FormMode>("reference");
  const [showDagDropdown, setShowDagDropdown] = useState(false);
  const [dagNos, setDagNos] = useState<string[]>(
    Array.from({ length: 50 }, (_, i) => `${i + 1}`)
  );
  const [dagNo, setDagNo] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InputFormData>();
  const { toast } = useToast();

  const onSubmit = (data: InputFormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Form submitted successfully",
      description: "Your data has been saved.",
    });
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
                        {...register("district", { required: "District is required" })}
                    >
                        <option value="">Select District</option>
                        <option value="District A">District A</option>
                        <option value="District B">District B</option>
                        <option value="District C">District C</option>
                    </select>
                    {errors.district && (
                        <p className="text-sm text-destructive">{errors.district.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="circle">Circle</Label>
                    <select
                        id="circle"
                        className="w-full border rounded px-3 py-2 mt-1"
                        {...register("circle", { required: "Circle is required" })}
                    >
                        <option value="">Select Circle</option>
                        <option value="Circle X">Circle X</option>
                        <option value="Circle Y">Circle Y</option>
                        <option value="Circle Z">Circle Z</option>
                    </select>
                    {errors.circle && (
                        <p className="text-sm text-destructive">{errors.circle.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="mouza">Mouza</Label>
                    <select
                        id="mouza"
                        className="w-full border rounded px-3 py-2 mt-1"
                        {...register("mouza", { required: "Mouza is required" })}
                    >
                        <option value="">Select Mouza</option>
                        <option value="Mouza 1">Mouza 1</option>
                        <option value="Mouza 2">Mouza 2</option>
                        <option value="Mouza 3">Mouza 3</option>
                    </select>
                    {errors.mouza && (
                        <p className="text-sm text-destructive">{errors.mouza.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="village">Village</Label>
                    <select
                        id="village"
                        className="w-full border rounded px-3 py-2 mt-1"
                        {...register("village", { required: "Village is required" })}
                    >
                        <option value="">Select Village</option>
                        <option value="Village A">Village A</option>
                        <option value="Village B">Village B</option>
                        <option value="Village C">Village C</option>
                    </select>
                    {errors.village && (
                        <p className="text-sm text-destructive">{errors.village.message}</p>
                    )}
                </div>
            </div>
            <div className="mt-4 relative">
                <Label htmlFor="dagNo">Dag No</Label>
                <Input
                    id="dagNo"
                    {...register("dagNo", { required: "Dag No is required" })}
                    placeholder="Enter Dag No"
                    autoComplete="off"
                    onFocus={() => setShowDagDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDagDropdown(false), 150)}
                    value={dagNo}
                />
                {errors.dagNo && (
                    <p className="text-sm text-destructive">{errors.dagNo.message}</p>
                )}
                {showDagDropdown && (
                    <div className="absolute left-0 right-0 z-10 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto p-2 flex flex-wrap gap-2">
                        {dagNos.map((dag) => (
                            <button
                                type="button"
                                key={dag}
                                className="text-center rounded-full bg-medical-100 hover:bg-medical-200 w-10 h-10 flex items-center justify-center font-semibold text-medical-900 shadow aspect-square"
                                onMouseDown={() => {
                                    setDagNo(dag);
                                    setShowDagDropdown(false);
                                }}
                            >
                                {dag}
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
            onValueChange={(value) => value && setMode(value as FormMode)}
            className="bg-white rounded-lg p-1 shadow-sm"
          >
            <ToggleGroupItem value="reference" className="px-6 py-2">
              Data Reference
            </ToggleGroupItem>
            <ToggleGroupItem value="input" className="px-6 py-2">
              Input Form
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {mode === "reference" ? "Data Reference View" : "Input Form"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "reference" ? (
              <div className="space-y-4">
                <ChithaView />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...register("title", { required: "Title is required" })}
                      placeholder="Enter title"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      {...register("category", { required: "Category is required" })}
                      placeholder="Enter category"
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    {...register("priority", { required: "Priority is required" })}
                    placeholder="Enter priority (High/Medium/Low)"
                  />
                  {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Enter description"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => reset()}>
                    Reset
                  </Button>
                  <Button type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}