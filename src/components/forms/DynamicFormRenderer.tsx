import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import type { FormField as DBFormField } from "@/hooks/useFormDefinitions";

interface DynamicFormRendererProps {
  fields: DBFormField[];
  onSubmit: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
  children?: React.ReactNode; // For submit button
}

// Build Zod schema dynamically from form fields
function buildSchema(fields: DBFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.field_type) {
      case "number":
        fieldSchema = z.coerce.number().optional();
        if (field.is_required) {
          fieldSchema = z.coerce.number({ required_error: `${field.label} is required` });
        }
        break;
      case "toggle":
        fieldSchema = z.boolean().optional();
        break;
      case "date":
        fieldSchema = z.string().optional();
        if (field.is_required) {
          fieldSchema = z.string().min(1, `${field.label} is required`);
        }
        break;
      default: // text, textarea, dropdown, lookup
        fieldSchema = z.string().optional();
        if (field.is_required) {
          fieldSchema = z.string().min(1, `${field.label} is required`);
        }
    }

    shape[field.field_key] = fieldSchema;
  });

  return z.object(shape);
}

// Parse options for dropdowns
function parseOptions(options: any): { label: string; value: string }[] {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((opt) => 
      typeof opt === "string" ? { label: opt, value: opt } : opt
    );
  }
  return [];
}

export function DynamicFormRenderer({
  fields,
  onSubmit,
  defaultValues = {},
  children,
}: DynamicFormRendererProps) {
  const schema = buildSchema(fields);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.field_key] = defaultValues[field.field_key] ?? field.default_value ?? "";
      return acc;
    }, {} as Record<string, any>),
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Sort fields by sort_order
  const sortedFields = [...fields].sort((a, b) => a.sort_order - b.sort_order);

  // Only render visible, non-system fields
  const visibleFields = sortedFields.filter((f) => f.is_visible && !f.is_system_field);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {visibleFields.map((field) => (
            <div
              key={field.id}
              className={field.column_span === 2 ? "col-span-2" : "col-span-1"}
            >
              <FormField
                control={form.control}
                name={field.field_key}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.is_required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {renderFieldInput(field, formField)}
                    </FormControl>
                    {field.help_text && (
                      <FormDescription>{field.help_text}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        {children}
      </form>
    </Form>
  );
}

function renderFieldInput(field: DBFormField, formField: any) {
  const isReadOnly = field.is_readonly;

  switch (field.field_type) {
    case "text":
      return (
        <Input
          {...formField}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          disabled={isReadOnly}
        />
      );

    case "number":
      return (
        <Input
          {...formField}
          type="number"
          placeholder={field.placeholder || "0"}
          disabled={isReadOnly}
        />
      );

    case "date":
      return (
        <Input
          {...formField}
          type="date"
          disabled={isReadOnly}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...formField}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          disabled={isReadOnly}
          className="resize-none"
        />
      );

    case "toggle":
      return (
        <Switch
          checked={!!formField.value}
          onCheckedChange={formField.onChange}
          disabled={isReadOnly}
        />
      );

    case "dropdown":
      const options = parseOptions(field.options);
      return (
        <Select
          value={formField.value}
          onValueChange={formField.onChange}
          disabled={isReadOnly}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "lookup":
      // For now, treat lookup as text - can be enhanced later
      return (
        <Input
          {...formField}
          placeholder={field.placeholder || "Search..."}
          disabled={isReadOnly}
        />
      );

    default:
      return (
        <Input
          {...formField}
          placeholder={field.placeholder || ""}
          disabled={isReadOnly}
        />
      );
  }
}
