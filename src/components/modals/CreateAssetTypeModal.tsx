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
 import { useCreateAssetType, useUpdateAssetType, type AssetType } from "@/hooks/useAssetTypes";
 import { Loader2 } from "lucide-react";
 
 const formSchema = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().optional(),
   icon: z.string().optional(),
   status: z.enum(["Active", "Draft", "Deprecated"]),
 });
 
 type FormValues = z.infer<typeof formSchema>;
 
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingType?: AssetType | null;
  onCreated?: (id: string) => void;
}
 
 const iconOptions = [
   { value: "Box", label: "Box" },
   { value: "Zap", label: "Motor" },
   { value: "Droplets", label: "Pump" },
   { value: "Cog", label: "Gearbox" },
   { value: "Wind", label: "Compressor" },
   { value: "CircleDot", label: "Valve" },
   { value: "ArrowRight", label: "Conveyor" },
 ];
 
 export function CreateAssetTypeModal({ open, onOpenChange, editingType, onCreated }: Props) {
   const createMutation = useCreateAssetType();
   const updateMutation = useUpdateAssetType();
   const isEditing = !!editingType;
 
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       name: editingType?.name || "",
       description: editingType?.description || "",
       icon: editingType?.icon || "Box",
       status: editingType?.status || "Draft",
     },
   });
 
   // Reset form when editingType changes
   useState(() => {
     if (editingType) {
       form.reset({
         name: editingType.name,
         description: editingType.description || "",
         icon: editingType.icon || "Box",
         status: editingType.status,
       });
     } else {
       form.reset({
         name: "",
         description: "",
         icon: "Box",
         status: "Draft",
       });
     }
   });
 
  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: editingType.id, ...values });
    } else {
      const result = await createMutation.mutateAsync({
        name: values.name,
        description: values.description,
        icon: values.icon,
        status: values.status,
      });
      onCreated?.(result.id);
    }
    form.reset();
    onOpenChange(false);
  };
 
   const isLoading = createMutation.isPending || updateMutation.isPending;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>{isEditing ? "Edit Asset Type" : "Create Asset Type"}</DialogTitle>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Motor, Pump, Valve" {...field} />
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
                       placeholder="Describe this asset type..."
                       className="resize-none"
                       {...field}
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="icon"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Icon</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select an icon" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {iconOptions.map((opt) => (
                         <SelectItem key={opt.value} value={opt.value}>
                           {opt.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="status"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select status" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value="Draft">Draft</SelectItem>
                       <SelectItem value="Active">Active</SelectItem>
                       <SelectItem value="Deprecated">Deprecated</SelectItem>
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={isLoading}>
                 {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 {isEditing ? "Save Changes" : "Create"}
               </Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 }