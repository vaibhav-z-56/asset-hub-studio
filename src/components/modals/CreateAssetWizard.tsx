import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateAsset, type HierarchyLevel, type AssetStatus, type CriticalityLevel } from "@/hooks/useAssets";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { useFormDefinitions, type FormDefinition } from "@/hooks/useFormDefinitions";
import { useAssetTypeFields } from "@/hooks/useAssetTypeFields";
import { DynamicFormRenderer } from "@/components/forms/DynamicFormRenderer";
import { AssetTypeStep } from "@/components/wizard/AssetTypeStep";
import { FormSelectStep } from "@/components/wizard/FormSelectStep";
import { ReviewStep } from "@/components/wizard/ReviewStep";
import { WizardStepIndicator } from "@/components/wizard/WizardStepIndicator";
import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WizardStep = "asset-type" | "form-select" | "core-fields" | "form-fill" | "review";

export function CreateAssetWizard({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<WizardStep>("asset-type");
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [assetName, setAssetName] = useState("");
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>("Unit");
  const [status] = useState<AssetStatus>("Active");
  const [criticality, setCriticality] = useState<CriticalityLevel>("Medium");
  const [location, setLocation] = useState("");
  const [coreFieldData, setCoreFieldData] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const createMutation = useCreateAsset();
  const { data: assetTypes } = useAssetTypes();
  const { data: allForms } = useFormDefinitions();
  const { data: coreFields } = useAssetTypeFields(selectedAssetTypeId);

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
      setCriticality("Medium");
      setLocation("");
      setCoreFieldData({});
      setFormData({});
    }
  }, [open]);

  const handleSelectAssetType = (id: string) => {
    setSelectedAssetTypeId(id);
    setSelectedFormId(null);
    setCoreFieldData({});
    setFormData({});
  };

  const handleNext = () => {
    if (step === "asset-type") {
      // Check if there are core fields
      if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else if (availableForms.length === 0) {
        setStep("review");
      } else if (availableForms.length === 1) {
        setSelectedFormId(availableForms[0].id);
        setStep("form-fill");
      } else {
        setStep("form-select");
      }
    } else if (step === "core-fields") {
      if (availableForms.length === 0) {
        setStep("review");
      } else if (availableForms.length === 1) {
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
    if (step === "core-fields") {
      setStep("asset-type");
    } else if (step === "form-select") {
      if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else {
        setStep("asset-type");
      }
    } else if (step === "form-fill") {
      if (availableForms.length > 1) {
        setStep("form-select");
      } else if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else {
        setStep("asset-type");
      }
    } else if (step === "review") {
      const hasCustomFields = selectedForm?.form_fields && selectedForm.form_fields.length > 0;
      if (hasCustomFields) {
        setStep("form-fill");
      } else if (availableForms.length > 1) {
        setStep("form-select");
      } else if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else {
        setStep("asset-type");
      }
    }
  };

  const handleCoreFieldsSubmit = (data: Record<string, any>) => {
    setCoreFieldData(data);
    if (availableForms.length === 0) {
      setStep("review");
    } else if (availableForms.length === 1) {
      setSelectedFormId(availableForms[0].id);
      setStep("form-fill");
    } else {
      setStep("form-select");
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
      data: { ...coreFieldData, ...formData },
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

  // Build dynamic steps list
  const buildSteps = () => {
    const steps = [{ id: "asset-type", label: "Asset Type" }];
    
    if (coreFields && coreFields.length > 0) {
      steps.push({ id: "core-fields", label: "Core Fields" });
    }
    
    if (availableForms.length > 1) {
      steps.push({ id: "form-select", label: "Select Form" });
    }
    
    const hasCustomFields = selectedForm?.form_fields && selectedForm.form_fields.length > 0;
    if (hasCustomFields || availableForms.length === 1) {
      steps.push({ id: "form-fill", label: "Fill Details" });
    }
    
    steps.push({ id: "review", label: "Review" });
    
    return steps;
  };

  const steps = buildSteps();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  // Convert core fields to form field format for renderer
  const coreFieldsForRenderer = coreFields?.map((f) => ({
    id: f.id,
    form_id: "",
    field_key: f.field_key,
    label: f.label,
    field_type: f.field_type,
    tab: "general",
    section: null,
    column_span: 1,
    sort_order: f.sort_order,
    is_required: f.is_required,
    is_readonly: f.is_readonly,
    is_visible: true,
    is_system_field: false,
    default_value: f.default_value,
    help_text: f.help_text,
    placeholder: f.placeholder,
    options: f.options,
    validation_rules: f.validation_rules,
  })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Asset</DialogTitle>
          <WizardStepIndicator steps={steps} currentStepIndex={currentStepIndex} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 px-1">
          {/* Step 1: Asset Type Selection */}
          {step === "asset-type" && (
            <AssetTypeStep
              assetTypes={assetTypes}
              selectedAssetTypeId={selectedAssetTypeId}
              onSelectAssetType={handleSelectAssetType}
              assetName={assetName}
              onAssetNameChange={setAssetName}
              hierarchyLevel={hierarchyLevel}
              onHierarchyLevelChange={setHierarchyLevel}
              criticality={criticality}
              onCriticalityChange={setCriticality}
              location={location}
              onLocationChange={setLocation}
            />
          )}

          {/* Step 2: Core Fields */}
          {step === "core-fields" && coreFields && coreFields.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fill in the required core fields for <strong>{selectedAssetType?.name}</strong>:
              </p>
              <DynamicFormRenderer
                fields={coreFieldsForRenderer}
                onSubmit={handleCoreFieldsSubmit}
                defaultValues={coreFieldData}
              >
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogFooter>
              </DynamicFormRenderer>
            </div>
          )}

          {/* Step 3: Form Selection */}
          {step === "form-select" && (
            <FormSelectStep
              forms={availableForms}
              selectedFormId={selectedFormId}
              onSelectForm={setSelectedFormId}
              assetTypeName={selectedAssetType?.name || ""}
            />
          )}

          {/* Step 4: Fill Form */}
          {step === "form-fill" && (
            <div className="space-y-4">
              {selectedForm && selectedForm.form_fields && selectedForm.form_fields.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details using the <strong>{selectedForm.name}</strong> form:
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
                  <p className="text-sm text-muted-foreground">You can proceed to review and create the asset.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === "review" && (
            <ReviewStep
              assetName={assetName}
              assetType={selectedAssetType}
              selectedForm={selectedForm}
              hierarchyLevel={hierarchyLevel}
              criticality={criticality}
              location={location}
              formData={formData}
              coreFieldData={coreFieldData}
            />
          )}
        </div>

        {/* Footer Navigation */}
        {step !== "core-fields" && step !== "form-fill" && (
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

        {/* Footer for form-fill with no fields */}
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
