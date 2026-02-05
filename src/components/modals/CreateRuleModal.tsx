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
 import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from "@/components/ui/form";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { useCreateFormRule, type RuleCondition, type RuleAction } from "@/hooks/useFormRules";
 import { Loader2, Plus, X } from "lucide-react";
 import { useState } from "react";
 
 const formSchema = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().optional(),
 });
 
 type FormValues = z.infer<typeof formSchema>;
 
 const fieldOptions = ["Asset Type", "Status", "Criticality", "Location", "Manufacturer"];
 const operatorOptions = ["equals", "not equals", "contains", "is empty", "is not empty"];
 const actionTypes = ["Show", "Hide", "Make Required", "Make Optional", "Set Value"];
 const targetFields = ["Serial Number", "Gear Ratio", "Rated Power", "RPM", "Maintenance Notes", "Operating Hours"];
 
 interface Props {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }
 
 export function CreateRuleModal({ open, onOpenChange }: Props) {
   const createMutation = useCreateFormRule();
   const [conditions, setConditions] = useState<RuleCondition[]>([
     { field: "Asset Type", operator: "equals", value: "" },
   ]);
   const [actions, setActions] = useState<RuleAction[]>([
     { type: "Show", field: "Serial Number" },
   ]);
 
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       name: "",
       description: "",
     },
   });
 
   const addCondition = () => {
     setConditions([...conditions, { field: "Asset Type", operator: "equals", value: "" }]);
   };
 
   const removeCondition = (index: number) => {
     setConditions(conditions.filter((_, i) => i !== index));
   };
 
   const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
     setConditions(conditions.map((c, i) => (i === index ? { ...c, ...updates } : c)));
   };
 
   const addAction = () => {
     setActions([...actions, { type: "Show", field: "Serial Number" }]);
   };
 
   const removeAction = (index: number) => {
     setActions(actions.filter((_, i) => i !== index));
   };
 
   const updateAction = (index: number, updates: Partial<RuleAction>) => {
     setActions(actions.map((a, i) => (i === index ? { ...a, ...updates } : a)));
   };
 
   const onSubmit = async (values: FormValues) => {
     await createMutation.mutateAsync({
       name: values.name,
       description: values.description,
       conditions,
       actions,
     });
     form.reset();
     setConditions([{ field: "Asset Type", operator: "equals", value: "" }]);
     setActions([{ type: "Show", field: "Serial Number" }]);
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Create Rule</DialogTitle>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Rule Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Show Gear Ratio for Gearbox" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Description</FormLabel>
                   <FormControl>
                     <Textarea
                       placeholder="Describe what this rule does..."
                       className="resize-none"
                       {...field}
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             {/* Conditions */}
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <h4 className="text-sm font-medium">When (Conditions)</h4>
                 <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                   <Plus className="w-4 h-4 mr-1" /> Add Condition
                 </Button>
               </div>
               <div className="space-y-2">
                 {conditions.map((condition, index) => (
                   <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                     <Select
                       value={condition.field}
                       onValueChange={(v) => updateCondition(index, { field: v })}
                     >
                       <SelectTrigger className="w-36">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {fieldOptions.map((f) => (
                           <SelectItem key={f} value={f}>{f}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <Select
                       value={condition.operator}
                       onValueChange={(v) => updateCondition(index, { operator: v })}
                     >
                       <SelectTrigger className="w-32">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {operatorOptions.map((o) => (
                           <SelectItem key={o} value={o}>{o}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <Input
                       className="flex-1"
                       placeholder="Value"
                       value={condition.value}
                       onChange={(e) => updateCondition(index, { value: e.target.value })}
                     />
                     {conditions.length > 1 && (
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         onClick={() => removeCondition(index)}
                       >
                         <X className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                 ))}
               </div>
             </div>
 
             {/* Actions */}
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <h4 className="text-sm font-medium">Then (Actions)</h4>
                 <Button type="button" variant="outline" size="sm" onClick={addAction}>
                   <Plus className="w-4 h-4 mr-1" /> Add Action
                 </Button>
               </div>
               <div className="space-y-2">
                 {actions.map((action, index) => (
                   <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
                     <Select
                       value={action.type}
                       onValueChange={(v) => updateAction(index, { type: v })}
                     >
                       <SelectTrigger className="w-36">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {actionTypes.map((t) => (
                           <SelectItem key={t} value={t}>{t}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <Select
                       value={action.field}
                       onValueChange={(v) => updateAction(index, { field: v })}
                     >
                       <SelectTrigger className="flex-1">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         {targetFields.map((f) => (
                           <SelectItem key={f} value={f}>{f}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     {actions.length > 1 && (
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         onClick={() => removeAction(index)}
                       >
                         <X className="w-4 h-4" />
                       </Button>
                     )}
                   </div>
                 ))}
               </div>
             </div>
 
             <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={createMutation.isPending}>
                 {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 Create Rule
               </Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 }