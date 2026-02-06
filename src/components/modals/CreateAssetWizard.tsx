import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateAsset, type HierarchyLevel, type AssetStatus, type CriticalityLevel } from "@/hooks/useAssets";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { useFormDefinitions, type FormDefinition } from "@/hooks/useFormDefinitions";
import { DynamicFormRenderer } from "@/components/forms/DynamicFormRenderer";
import { Loader2, ArrowLeft, ArrowRight, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const hierarchyLevels: HierarchyLevel[] = [
  "Enterprise", "Site", "Area", "System", "Unit", "Subunit", "Component", "Part", "Sensor"
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WizardStep = "asset-type" | "form-select" | "form-fill" | "review";

export function CreateAssetWizard({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<WizardStep>("asset-type");
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [assetName, setAssetName] = useState("");
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>("Unit");
  const [status, setStatus] = useState<AssetStatus>("Active");
  const [criticality, setCriticality] = useState<CriticalityLevel>("Medium");
  const [location, setLocation] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});

  const createMutation = useCreateAsset();
  const { data: assetTypes } = useAssetTypes();
  const { data: allForms } = useFormDefinitions();

  // Filter published forms for selected asset type
  const availableForms = allForms?.filter(
    (f) => f.asset_type_id === selectedAssetTypeId && f.is_published
  ) || [];

  const selectedAssetType = assetTypes?.find((t) => t.id === selectedAssetTypeId);
  const selectedForm = allForms?.find((f) => f.id === selectedFormId);

  // Reset wizard when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("asset-type");
      setSelectedAssetTypeId(null);
      setSelectedFormId(null);
      setAssetName("");
      setHierarchyLevel("Unit");
      setStatus("Active");
      setCriticality("Medium");
      setLocation("");
      setFormData({});
    }
  }, [open]);

  const handleNext = () => {
    if (step === "asset-type") {
      if (availableForms.length === 0) {
        // Skip form selection if no forms available
        setStep("form-fill");
      } else if (availableForms.length === 1) {
        // Auto-select if only one form
        setSelectedFormId(availableForms[0].id);
        setStep("form-fill");
      } else {
        setStep("form-select");
      }
    } else if (step === "form-select") {
      setStep("form-fill");
    } else if (step === "form-fill") {
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "form-select") {
      setStep("asset-type");
    } else if (step === "form-fill") {
      if (availableForms.length > 1) {
        setStep("form-select");
      } else {
        setStep("asset-type");
      }
    } else if (step === "review") {
      setStep("form-fill");
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    setStep("review");
  };

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: assetName,
      asset_type_id: selectedAssetTypeId || undefined,
      hierarchy_level: hierarchyLevel,
      status,
      criticality,
      location: location || undefined,
      data: formData,
    });
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === "asset-type") {
      return !!selectedAssetTypeId && !!assetName.trim();
    }
    if (step === "form-select") {
      return !!selectedFormId;
    }
    return true;
  };

  const steps = [
    { id: "asset-type", label: "Asset Type" },
    { id: "form-select", label: "Select Form", skip: availableForms.length <= 1 },
    { id: "form-fill", label: "Fill Details" },
    { id: "review", label: "Review" },
  ].filter((s) => !s.skip);

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Asset</DialogTitle>
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    i < currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : i === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      i < currentStepIndex ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Step 1: Asset Type Selection */}
          {step === "asset-type" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Asset Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g., Motor M-2847"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Asset Type <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3">
                  {assetTypes?.map((type) => (
                    <Card
                      key={type.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary/50",
                        selectedAssetTypeId === type.id && "border-primary ring-2 ring-primary/20"
                      )}
                      onClick={() => {
                        setSelectedAssetTypeId(type.id);
                        setSelectedFormId(null); // Reset form selection
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{type.name}</p>
                            {type.description && (
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            )}
                          </div>
                          <Badge variant="outline">{type.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hierarchy Level</Label>
                  <Select value={hierarchyLevel} onValueChange={(v) => setHierarchyLevel(v as HierarchyLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hierarchyLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Criticality</Label>
                  <Select value={criticality} onValueChange={(v) => setCriticality(v as CriticalityLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., Building A, Floor 1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Form Selection */}
          {step === "form-select" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a form template for your <strong>{selectedAssetType?.name}</strong> asset:
              </p>
              <div className="grid gap-3">
                {availableForms.map((form) => (
                  <Card
                    key={form.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      selectedFormId === form.id && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => setSelectedFormId(form.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{form.name}</p>
                          {form.description && (
                            <p className="text-sm text-muted-foreground">{form.description}</p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {form.form_fields?.length || 0} fields
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Fill Form */}
          {step === "form-fill" && (
            <div className="space-y-4">
              {selectedForm && selectedForm.form_fields && selectedForm.form_fields.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details for your asset using the <strong>{selectedForm.name}</strong> form:
                  </p>
                  <DynamicFormRenderer
                    fields={selectedForm.form_fields}
                    onSubmit={handleFormSubmit}
                    defaultValues={formData}
                  >
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button type="submit">
                        Review
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogFooter>
                  </DynamicFormRenderer>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">No custom fields configured for this form.</p>
                  <p className="text-sm text-muted-foreground">You can proceed to create the asset with basic info.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {step === "review" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review your asset details before creating:</p>
              
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{assetName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Asset Type:</span>
                      <p className="font-medium">{selectedAssetType?.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hierarchy Level:</span>
                      <p className="font-medium">{hierarchyLevel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Criticality:</span>
                      <p className="font-medium">{criticality}</p>
                    </div>
                    {location && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">{location}</p>
                      </div>
                    )}
                  </div>

                  {Object.keys(formData).length > 0 && (
                    <>
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Form Data:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(formData).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                              <p className="font-medium">{String(value) || "-"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Navigation (except for form-fill which has its own) */}
        {step !== "form-fill" && (
          <DialogFooter>
            {step !== "asset-type" && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step === "review" ? (
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Asset
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </DialogFooter>
        )}

        {/* Special footer for form-fill with no fields */}
        {step === "form-fill" && (!selectedForm?.form_fields || selectedForm.form_fields.length === 0) && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => setStep("review")}>
              Review
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
