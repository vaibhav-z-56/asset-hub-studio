import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssetTypeField } from "@/hooks/useAssetTypeFields";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetTypeId: string;
  existingFieldKeys: string[];
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "toggle", label: "Toggle" },
  { value: "textarea", label: "Text Area" },
];

export function AddCoreFieldModal({ open, onOpenChange, assetTypeId, existingFieldKeys }: Props) {
  const [label, setLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [isRequired, setIsRequired] = useState(true);
  const [helpText, setHelpText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState("");

  const createMutation = useCreateAssetTypeField();

  const handleLabelChange = (value: string) => {
    setLabel(value);
    // Auto-generate field key from label
    const key = value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
    setFieldKey(key);
  };

  const handleSubmit = async () => {
    if (!label.trim() || !fieldKey.trim()) return;

    if (existingFieldKeys.includes(fieldKey)) {
      return; // Show validation error
    }

    await createMutation.mutateAsync({
      asset_type_id: assetTypeId,
      label: label.trim(),
      field_key: fieldKey.trim(),
      field_type: fieldType,
      is_required: isRequired,
      help_text: helpText.trim() || undefined,
      placeholder: placeholder.trim() || undefined,
      options: fieldType === "dropdown" && dropdownOptions.trim()
        ? dropdownOptions.split(",").map((o) => o.trim()).filter(Boolean)
        : undefined,
    });

    // Reset form
    setLabel("");
    setFieldKey("");
    setFieldType("text");
    setIsRequired(true);
    setHelpText("");
    setPlaceholder("");
    setDropdownOptions("");
    onOpenChange(false);
  };

  const isKeyDuplicate = existingFieldKeys.includes(fieldKey);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Core Field</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Field Label <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g., Serial Number"
              value={label}
              onChange={(e) => handleLabelChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Field Key <span className="text-destructive">*</span></Label>
            <Input
              placeholder="e.g., serial_number"
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              className={isKeyDuplicate ? "border-destructive" : ""}
            />
            {isKeyDuplicate && (
              <p className="text-xs text-destructive">This field key already exists</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {fieldType === "dropdown" && (
            <div className="space-y-2">
              <Label>Dropdown Options</Label>
              <Textarea
                placeholder="Enter options separated by commas (e.g., Option 1, Option 2, Option 3)"
                value={dropdownOptions}
                onChange={(e) => setDropdownOptions(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              placeholder="Placeholder text..."
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Help Text</Label>
            <Textarea
              placeholder="Help text for users..."
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
              className="resize-none h-16"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Required</Label>
            <Switch checked={isRequired} onCheckedChange={setIsRequired} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!label.trim() || !fieldKey.trim() || isKeyDuplicate || createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
