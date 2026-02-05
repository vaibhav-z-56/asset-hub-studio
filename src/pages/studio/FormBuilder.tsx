 import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  GripVertical,
  Type,
  Hash,
  Calendar,
  List,
  Link2,
  ToggleLeft,
  FileText,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Asterisk,
  Plus,
  Save,
  Play,
  Undo,
  Redo,
  Columns,
   Loader2,
   CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
 import { useFormDefinitions, useSaveFormFields, usePublishForm, type FormField as DBFormField } from "@/hooks/useFormDefinitions";
 import { CreateFormModal } from "@/components/modals/CreateFormModal";
 import { toast } from "@/hooks/use-toast";

interface Field {
  id: string;
   field_key: string;
  label: string;
  type: string;
  icon: React.ElementType;
  required: boolean;
  readOnly: boolean;
   isSystem: boolean;
   helpText?: string;
   defaultValue?: string;
}

const fieldTypes = [
  { type: "text", label: "Text Field", icon: Type },
  { type: "number", label: "Number", icon: Hash },
  { type: "date", label: "Date", icon: Calendar },
  { type: "dropdown", label: "Dropdown", icon: List },
  { type: "lookup", label: "Lookup", icon: Link2 },
  { type: "toggle", label: "Toggle", icon: ToggleLeft },
  { type: "textarea", label: "Text Area", icon: FileText },
];

const systemFields: Field[] = [
   { id: "sys-1", field_key: "asset_id", label: "Asset ID", type: "text", icon: Type, required: true, readOnly: true, isSystem: true },
   { id: "sys-2", field_key: "created_date", label: "Created Date", type: "date", icon: Calendar, required: true, readOnly: true, isSystem: true },
   { id: "sys-3", field_key: "modified_date", label: "Modified Date", type: "date", icon: Calendar, required: true, readOnly: true, isSystem: true },
   { id: "sys-4", field_key: "created_by", label: "Created By", type: "lookup", icon: Link2, required: true, readOnly: true, isSystem: true },
];

const customFields: Field[] = [
   { id: "cust-1", field_key: "serial_number", label: "Serial Number", type: "text", icon: Type, required: true, readOnly: false, isSystem: false },
   { id: "cust-2", field_key: "manufacturer", label: "Manufacturer", type: "dropdown", icon: List, required: false, readOnly: false, isSystem: false },
   { id: "cust-3", field_key: "installation_date", label: "Installation Date", type: "date", icon: Calendar, required: false, readOnly: false, isSystem: false },
   { id: "cust-4", field_key: "rated_power", label: "Rated Power (kW)", type: "number", icon: Hash, required: false, readOnly: false, isSystem: false },
   { id: "cust-5", field_key: "operating_hours", label: "Operating Hours", type: "number", icon: Hash, required: false, readOnly: false, isSystem: false },
];

 const getIconForType = (type: string): React.ElementType => {
   const found = fieldTypes.find((f) => f.type === type);
   return found?.icon || Type;
 };
 
const FormBuilder = () => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
   const [formFields, setFormFields] = useState<Field[]>([]);
  const [activeTab, setActiveTab] = useState("general");
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 
   const { data: forms, isLoading } = useFormDefinitions();
   const saveFieldsMutation = useSaveFormFields();
   const publishMutation = usePublishForm();
 
   // Select first form if none selected
   useEffect(() => {
     if (forms?.length && !selectedFormId) {
       setSelectedFormId(forms[0].id);
     }
   }, [forms, selectedFormId]);
 
   // Load form fields when selected form changes
   useEffect(() => {
     if (selectedFormId && forms) {
       const form = forms.find((f) => f.id === selectedFormId);
       if (form?.form_fields) {
         const loadedFields: Field[] = form.form_fields.map((f) => ({
           id: f.id,
           field_key: f.field_key,
           label: f.label,
           type: f.field_type,
           icon: getIconForType(f.field_type),
           required: f.is_required,
           readOnly: f.is_readonly,
           isSystem: f.is_system_field,
           helpText: f.help_text || undefined,
           defaultValue: f.default_value || undefined,
         }));
         setFormFields(loadedFields);
         setHasUnsavedChanges(false);
       } else {
         setFormFields([]);
       }
     }
   }, [selectedFormId, forms]);
 
   const selectedForm = forms?.find((f) => f.id === selectedFormId);

  const handleDragStart = (e: React.DragEvent, field: Field) => {
    e.dataTransfer.setData("field", JSON.stringify(field));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldData = e.dataTransfer.getData("field");
    if (fieldData) {
      const field = JSON.parse(fieldData) as Field;
       // Generate unique ID for new fields
       const newField = {
         ...field,
         id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
       };
       if (!formFields.find((f) => f.field_key === field.field_key)) {
         setFormFields([...formFields, newField]);
         setHasUnsavedChanges(true);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeField = (fieldId: string) => {
    setFormFields(formFields.filter((f) => f.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
     setHasUnsavedChanges(true);
  };
 
   const handleSave = async () => {
     if (!selectedFormId) return;
     
     const fieldsToSave = formFields.map((f, i) => ({
       field_key: f.field_key,
       label: f.label,
       field_type: f.type,
       tab: activeTab,
       is_required: f.required,
       is_readonly: f.readOnly,
       is_visible: true,
       is_system_field: f.isSystem,
       sort_order: i,
       column_span: 1,
       help_text: f.helpText || null,
       default_value: f.defaultValue || null,
       placeholder: null,
       options: null,
       validation_rules: null,
       section: null,
     }));
 
     await saveFieldsMutation.mutateAsync({ formId: selectedFormId, fields: fieldsToSave });
     setHasUnsavedChanges(false);
   };
 
   const handlePublish = async () => {
     if (!selectedFormId) return;
     await publishMutation.mutateAsync(selectedFormId);
   };
 
   const updateSelectedField = (updates: Partial<Field>) => {
     if (!selectedField) return;
     const updated = { ...selectedField, ...updates };
     setSelectedField(updated);
     setFormFields(formFields.map((f) => (f.id === selectedField.id ? updated : f)));
     setHasUnsavedChanges(true);
   };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Form Builder</h1>
          <p className="text-muted-foreground mt-1">
            Design and configure asset forms visually
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Play className="w-4 h-4" />
            Preview
          </Button>
           <Button 
             className="gap-2" 
             onClick={handleSave}
             disabled={saveFieldsMutation.isPending || !hasUnsavedChanges}
           >
             {saveFieldsMutation.isPending ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
            <Save className="w-4 h-4" />
             )}
            Save Draft
          </Button>
           <Button 
             variant="secondary"
             className="gap-2" 
             onClick={handlePublish}
             disabled={publishMutation.isPending || !selectedFormId}
           >
             {publishMutation.isPending ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <CheckCircle className="w-4 h-4" />
             )}
             Publish
           </Button>
        </div>
      </div>
 
       {/* Form Selector */}
       {isLoading ? (
         <div className="flex items-center justify-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
         </div>
       ) : forms?.length === 0 ? (
         <Card className="shadow-card">
           <CardContent className="flex flex-col items-center justify-center py-16">
             <FileText className="w-12 h-12 text-muted-foreground/40 mb-4" />
             <h3 className="text-lg font-medium text-foreground mb-2">No forms yet</h3>
             <p className="text-muted-foreground text-sm mb-4">Create your first form to start building</p>
             <Button onClick={() => setCreateModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Form
             </Button>
           </CardContent>
         </Card>
       ) : (
         <>
           <div className="flex items-center gap-4">
             <Select value={selectedFormId || ""} onValueChange={setSelectedFormId}>
               <SelectTrigger className="w-64">
                 <SelectValue placeholder="Select a form" />
               </SelectTrigger>
               <SelectContent>
                 {forms?.map((form) => (
                   <SelectItem key={form.id} value={form.id}>
                     {form.name}
                     {form.is_published && <Badge variant="outline" className="ml-2 text-xs">Published</Badge>}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={() => setCreateModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               New Form
             </Button>
             {hasUnsavedChanges && (
               <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                 Unsaved changes
               </Badge>
             )}
           </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)]">
        {/* Left Panel - Field Library */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-3"
        >
          <Card className="shadow-card h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-sm font-medium">Field Library</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search fields..." className="pl-10 h-9" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 pt-0">
              {/* System Fields */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  System Fields
                </p>
                <div className="space-y-2">
                  {systemFields.map((field) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <field.icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Custom Fields
                </p>
                <div className="space-y-2">
                  {customFields.map((field) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <field.icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <span className="text-sm font-medium">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Types */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  Add New Field
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {fieldTypes.map((fieldType) => (
                    <div
                      key={fieldType.type}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all"
                    >
                      <fieldType.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{fieldType.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Center Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-6"
        >
          <Card className="shadow-card h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-3 shrink-0 border-b">
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-lg">{selectedForm?.name || "Select a form"}</CardTitle>
                   <p className="text-xs text-muted-foreground mt-1">{selectedForm?.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge 
                     variant="outline" 
                     className={selectedForm?.is_published 
                       ? "bg-success/10 text-success border-success/20" 
                       : "bg-warning/10 text-warning border-warning/20"
                     }
                   >
                     {selectedForm?.is_published ? "Published" : "Draft"}
                   </Badge>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Columns className="w-4 h-4" />
                    2 Columns
                  </Button>
                </div>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
                <TabsList className="h-9">
                  <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                  <TabsTrigger value="technical" className="text-xs">Technical Details</TabsTrigger>
                  <TabsTrigger value="operational" className="text-xs">Operational</TabsTrigger>
                  <TabsTrigger value="attachments" className="text-xs">Attachments</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent
              className="flex-1 overflow-y-auto p-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="form-canvas min-h-full p-4">
                {formFields.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Plus className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">Drop fields here</p>
                      <p className="text-sm">Drag fields from the library to build your form</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedField(field)}
                        className={`p-4 rounded-lg border-2 bg-card cursor-pointer transition-all ${
                          selectedField?.id === field.id
                            ? "border-primary shadow-sm"
                            : "border-transparent hover:border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">{field.label}</Label>
                            {field.required && (
                              <Asterisk className="w-3 h-3 text-destructive" />
                            )}
                            {field.readOnly && (
                              <Lock className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Input
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                          disabled
                          className="bg-muted/50"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel - Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-3"
        >
          <Card className="shadow-card h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Field Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {selectedField ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fieldLabel">Label</Label>
                     <Input 
                       id="fieldLabel" 
                       value={selectedField.label} 
                       onChange={(e) => updateSelectedField({ label: e.target.value })}
                     />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fieldType">Field Type</Label>
                     <Select 
                       value={selectedField.type}
                       onValueChange={(v) => updateSelectedField({ type: v, icon: getIconForType(v) })}
                     >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((ft) => (
                          <SelectItem key={ft.type} value={ft.type}>
                            {ft.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="helpText">Help Text</Label>
                    <Textarea
                      id="helpText"
                      placeholder="Enter help text for users..."
                      className="h-20 resize-none"
                       value={selectedField.helpText || ""}
                       onChange={(e) => updateSelectedField({ helpText: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultValue">Default Value</Label>
                     <Input 
                       id="defaultValue" 
                       placeholder="Enter default value..."
                       value={selectedField.defaultValue || ""}
                       onChange={(e) => updateSelectedField({ defaultValue: e.target.value })}
                     />
                  </div>

                  <div className="space-y-3">
                    <Label>Field Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Asterisk className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Required</span>
                        </div>
                         <Switch 
                           checked={selectedField.required} 
                           onCheckedChange={(v) => updateSelectedField({ required: v })}
                         />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Read-only</span>
                        </div>
                         <Switch 
                           checked={selectedField.readOnly} 
                           onCheckedChange={(v) => updateSelectedField({ readOnly: v })}
                         />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Visible</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility Conditions</Label>
                    <Button variant="outline" className="w-full justify-start text-muted-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add condition
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Admin</span>
                        <span className="text-success">View & Edit</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Maintenance</span>
                        <span className="text-primary">View & Edit</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Viewer</span>
                        <span className="text-muted-foreground">View Only</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No field selected</p>
                    <p className="text-sm">Click a field to edit its properties</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
       </>
       )}
 
       {/* Create Form Modal */}
       <CreateFormModal 
         open={createModalOpen} 
         onOpenChange={setCreateModalOpen}
         onCreated={(formId) => setSelectedFormId(formId)}
       />
    </div>
  );
};

export default FormBuilder;
