import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AssetType } from "@/hooks/useAssetTypes";
import type { FormDefinition } from "@/hooks/useFormDefinitions";
import type { HierarchyLevel, CriticalityLevel } from "@/hooks/useAssets";

interface Props {
  assetName: string;
  assetType: AssetType | undefined;
  selectedForm: FormDefinition | undefined;
  hierarchyLevel: HierarchyLevel;
  criticality: CriticalityLevel;
  location: string;
  formData: Record<string, any>;
  coreFieldData: Record<string, any>;
}

export function ReviewStep({
  assetName,
  assetType,
  selectedForm,
  hierarchyLevel,
  criticality,
  location,
  formData,
  coreFieldData,
}: Props) {
  const formatFieldLabel = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Review your asset details before creating:</p>

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium">{assetName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Asset Type</span>
                <p className="font-medium">{assetType?.name || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hierarchy Level</span>
                <p className="font-medium">{hierarchyLevel}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Criticality</span>
                <p className="font-medium">{criticality}</p>
              </div>
              {location && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-medium">{location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Core Fields Data */}
          {Object.keys(coreFieldData).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Core Fields</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(coreFieldData).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{formatFieldLabel(key)}</span>
                      <p className="font-medium">{formatValue(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Custom Form Data */}
          {Object.keys(formData).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  {selectedForm?.name || "Form"} Data
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{formatFieldLabel(key)}</span>
                      <p className="font-medium">{formatValue(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
