import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const fieldTypes = [
  { value: "text", label: "Text Field" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "lookup", label: "Lookup" },
  { value: "toggle", label: "Toggle" },
  { value: "textarea", label: "Text Area" },
];

const formSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  field_key: z.string().min(1, "Field key is required").max(50).regex(
    /^[a-z][a-z0-9_]*$/,
    "Field key must start with lowercase letter and contain only lowercase letters, numbers, and underscores"
  ),
  field_type: z.string().min(1, "Field type is required"),
  help_text: z.string().max(500).optional(),
  default_value: z.string().max(255).optional(),
  is_required: z.boolean(),
  placeholder: z.string().max(255).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCustomFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (field: {
    field_key: string;
    label: string;
    type: string;
    required: boolean;
    helpText?: string;
    defaultValue?: string;
    placeholder?: string;
    options?: string[];
  }) => void;
}

export function AddCustomFieldModal({ open, onOpenChange, onAdd }: AddCustomFieldModalProps) {
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      field_key: "",
      field_type: "text",
      help_text: "",
      default_value: "",
      is_required: false,
      placeholder: "",
    },
  });

  const fieldType = form.watch("field_type");

  // Auto-generate field_key from label
  const handleLabelChange = (label: string) => {
    form.setValue("label", label);
    const key = label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
    if (key && !form.getValues("field_key")) {
      form.setValue("field_key", key);
    }
  };

  const addDropdownOption = () => {
    if (newOption.trim() && !dropdownOptions.includes(newOption.trim())) {
      setDropdownOptions([...dropdownOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeDropdownOption = (option: string) => {
    setDropdownOptions(dropdownOptions.filter((o) => o !== option));
  };

  const onSubmit = (values: FormValues) => {
    onAdd({
      field_key: values.field_key,
      label: values.label,
      type: values.field_type,
      required: values.is_required,
      helpText: values.help_text,
      defaultValue: values.default_value,
      placeholder: values.placeholder,
      options: fieldType === "dropdown" ? dropdownOptions : undefined,
    });
    form.reset();
    setDropdownOptions([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Serial Number"
                      onChange={(e) => handleLabelChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="field_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Key</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., serial_number" />
                  </FormControl>
                  <FormDescription>Unique identifier for this field (auto-generated)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="field_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dropdown options */}
            {fieldType === "dropdown" && (
              <div className="space-y-2">
                <FormLabel>Dropdown Options</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add option..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDropdownOption();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addDropdownOption}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {dropdownOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dropdownOptions.map((option) => (
                      <Badge key={option} variant="secondary" className="gap-1">
                        {option}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeDropdownOption(option)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter placeholder text..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="help_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Help Text</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe this field..."
                      className="resize-none h-16"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Value</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter default value..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-base">Required Field</FormLabel>
                    <FormDescription>Make this field mandatory</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Field</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
