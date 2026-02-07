import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateAsset, type Asset, type HierarchyLevel, type CriticalityLevel } from "@/hooks/useAssets";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { useFormDefinitions } from "@/hooks/useFormDefinitions";
import { useAssetTypeFields } from "@/hooks/useAssetTypeFields";
import { DynamicFormRenderer } from "@/components/forms/DynamicFormRenderer";
import { AssetTypeStep } from "@/components/wizard/AssetTypeStep";
import { WizardStepIndicator } from "@/components/wizard/WizardStepIndicator";
import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
}

type WizardStep = "basic-info" | "core-fields" | "form-fill";

export function EditAssetWizard({ open, onOpenChange, asset }: Props) {
  const [step, setStep] = useState<WizardStep>("basic-info");
  const [assetName, setAssetName] = useState(asset.name);
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(asset.hierarchy_level);
  const [criticality, setCriticality] = useState<CriticalityLevel>(asset.criticality);
  const [location, setLocation] = useState(asset.location || "");
  const [coreFieldData, setCoreFieldData] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateMutation = useUpdateAsset();
  const { data: assetTypes } = useAssetTypes();
  const { data: allForms } = useFormDefinitions();
  const { data: coreFields } = useAssetTypeFields(asset.asset_type_id);

  const selectedAssetType = assetTypes?.find((t) => t.id === asset.asset_type_id);
  
  // Get published forms for this asset type
  const availableForms = allForms?.filter(
    (f) => f.asset_type_id === asset.asset_type_id && f.is_published
  ) || [];
  
  // Use the first published form (or could be enhanced to track which form was used)
  const selectedForm = availableForms[0];

  // Initialize form data from asset data
  useEffect(() => {
    if (open && asset.data) {
      // Separate core field data from form data
      const coreFieldKeys = new Set(coreFields?.map((f) => f.field_key) || []);
      const formFieldKeys = new Set(selectedForm?.form_fields?.map((f) => f.field_key) || []);
      
      const coreData: Record<string, any> = {};
      const customData: Record<string, any> = {};
      
      Object.entries(asset.data).forEach(([key, value]) => {
        if (coreFieldKeys.has(key)) {
          coreData[key] = value;
        } else if (formFieldKeys.has(key)) {
          customData[key] = value;
        }
      });
      
      setCoreFieldData(coreData);
      setFormData(customData);
    }
  }, [open, asset.data, coreFields, selectedForm]);

  // Reset state when asset changes
  useEffect(() => {
    setAssetName(asset.name);
    setHierarchyLevel(asset.hierarchy_level);
    setCriticality(asset.criticality);
    setLocation(asset.location || "");
    setStep("basic-info");
  }, [asset]);

  const handleNext = () => {
    if (step === "basic-info") {
      if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else if (selectedForm?.form_fields && selectedForm.form_fields.length > 0) {
        setStep("form-fill");
      } else {
        handleSave();
      }
    } else if (step === "core-fields") {
      if (selectedForm?.form_fields && selectedForm.form_fields.length > 0) {
        setStep("form-fill");
      } else {
        handleSave();
      }
    }
  };

  const handleBack = () => {
    if (step === "core-fields") {
      setStep("basic-info");
    } else if (step === "form-fill") {
      if (coreFields && coreFields.length > 0) {
        setStep("core-fields");
      } else {
        setStep("basic-info");
      }
    }
  };

  const handleCoreFieldsSubmit = (data: Record<string, any>) => {
    setCoreFieldData(data);
    if (selectedForm?.form_fields && selectedForm.form_fields.length > 0) {
      setStep("form-fill");
    } else {
      handleSaveWithData(data, formData);
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    handleSaveWithData(coreFieldData, data);
  };

  const handleSaveWithData = async (coreData: Record<string, any>, customData: Record<string, any>) => {
    await updateMutation.mutateAsync({
      id: asset.id,
      name: assetName,
      hierarchy_level: hierarchyLevel,
      criticality,
      location: location || null,
      data: { ...coreData, ...customData },
    });
    onOpenChange(false);
  };

  const handleSave = async () => {
    await handleSaveWithData(coreFieldData, formData);
  };

  // Build steps
  const buildSteps = () => {
    const steps = [{ id: "basic-info", label: "Basic Info" }];
    
    if (coreFields && coreFields.length > 0) {
      steps.push({ id: "core-fields", label: "Core Fields" });
    }
    
    if (selectedForm?.form_fields && selectedForm.form_fields.length > 0) {
      steps.push({ id: "form-fill", label: "Form Details" });
    }
    
    return steps;
  };

  const steps = buildSteps();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  // Convert core fields for renderer
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
          <DialogTitle>Edit Asset: {asset.name}</DialogTitle>
          <WizardStepIndicator steps={steps} currentStepIndex={currentStepIndex} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 px-1">
          {/* Basic Info Step */}
          {step === "basic-info" && (
            <AssetTypeStep
              assetTypes={assetTypes}
              selectedAssetTypeId={asset.asset_type_id}
              onSelectAssetType={() => {}} // Read-only for edit
              assetName={assetName}
              onAssetNameChange={setAssetName}
              hierarchyLevel={hierarchyLevel}
              onHierarchyLevelChange={setHierarchyLevel}
              criticality={criticality}
              onCriticalityChange={setCriticality}
              location={location}
              onLocationChange={setLocation}
              disableAssetTypeSelect={true}
            />
          )}

          {/* Core Fields Step */}
          {step === "core-fields" && coreFieldsForRenderer.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update the core fields for <strong>{selectedAssetType?.name}</strong>:
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
                    {selectedForm?.form_fields?.length ? "Next" : "Save"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogFooter>
              </DynamicFormRenderer>
            </div>
          )}

          {/* Form Fill Step */}
          {step === "form-fill" && selectedForm?.form_fields && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update the form details:
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
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </DynamicFormRenderer>
            </div>
          )}
        </div>

        {/* Footer for basic info step */}
        {step === "basic-info" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {steps.length === 1 ? (
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
