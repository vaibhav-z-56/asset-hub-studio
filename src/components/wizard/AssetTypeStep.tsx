import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { AssetType } from "@/hooks/useAssetTypes";
import type { HierarchyLevel, CriticalityLevel } from "@/hooks/useAssets";

const hierarchyLevels: HierarchyLevel[] = [
  "Enterprise", "Site", "Area", "System", "Unit", "Subunit", "Component", "Part", "Sensor"
];

interface Props {
  assetTypes: AssetType[] | undefined;
  selectedAssetTypeId: string | null;
  onSelectAssetType: (id: string) => void;
  assetName: string;
  onAssetNameChange: (name: string) => void;
  hierarchyLevel: HierarchyLevel;
  onHierarchyLevelChange: (level: HierarchyLevel) => void;
  criticality: CriticalityLevel;
  onCriticalityChange: (level: CriticalityLevel) => void;
  location: string;
  onLocationChange: (location: string) => void;
  disableAssetTypeSelect?: boolean;
}

export function AssetTypeStep({
  assetTypes,
  selectedAssetTypeId,
  onSelectAssetType,
  assetName,
  onAssetNameChange,
  hierarchyLevel,
  onHierarchyLevelChange,
  criticality,
  onCriticalityChange,
  location,
  onLocationChange,
  disableAssetTypeSelect = false,
}: Props) {
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return LucideIcons.Box;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Box;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Asset Name <span className="text-destructive">*</span></Label>
        <Input
          placeholder="e.g., Motor M-2847"
          value={assetName}
          onChange={(e) => onAssetNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Asset Type {!disableAssetTypeSelect && <span className="text-destructive">*</span>}</Label>
        <Select 
          value={selectedAssetTypeId || ""} 
          onValueChange={onSelectAssetType}
          disabled={disableAssetTypeSelect}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select an asset type..." />
          </SelectTrigger>
          <SelectContent>
            {assetTypes?.map((type) => {
              const IconComponent = getIconComponent(type.icon);
              return (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">{type.status}</Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hierarchy Level</Label>
          <Select value={hierarchyLevel} onValueChange={(v) => onHierarchyLevelChange(v as HierarchyLevel)}>
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
          <Select value={criticality} onValueChange={(v) => onCriticalityChange(v as CriticalityLevel)}>
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
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
}
