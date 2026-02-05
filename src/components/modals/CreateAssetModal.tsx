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
 import { useCreateAsset, type HierarchyLevel, type AssetStatus, type CriticalityLevel } from "@/hooks/useAssets";
 import { useAssetTypes } from "@/hooks/useAssetTypes";
 import { Loader2 } from "lucide-react";
 
 const hierarchyLevels: HierarchyLevel[] = [
   "Enterprise", "Site", "Area", "System", "Unit", "Subunit", "Component", "Part", "Sensor"
 ];
 
 const formSchema = z.object({
   name: z.string().min(1, "Name is required"),
   hierarchy_level: z.enum(["Enterprise", "Site", "Area", "System", "Unit", "Subunit", "Component", "Part", "Sensor"]),
   asset_type_id: z.string().optional(),
   status: z.enum(["Active", "Maintenance", "Inactive"]),
   criticality: z.enum(["High", "Medium", "Low"]),
   location: z.string().optional(),
 });
 
 type FormValues = z.infer<typeof formSchema>;
 
 interface Props {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }
 
 export function CreateAssetModal({ open, onOpenChange }: Props) {
   const createMutation = useCreateAsset();
   const { data: assetTypes } = useAssetTypes();
 
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       name: "",
       hierarchy_level: "Unit",
       status: "Active",
       criticality: "Medium",
       location: "",
     },
   });
 
   const onSubmit = async (values: FormValues) => {
     await createMutation.mutateAsync({
       name: values.name,
       hierarchy_level: values.hierarchy_level as HierarchyLevel,
       asset_type_id: values.asset_type_id,
       status: values.status as AssetStatus,
       criticality: values.criticality as CriticalityLevel,
       location: values.location,
     });
     form.reset();
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Create Asset</DialogTitle>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Asset Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Motor M-2847" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="hierarchy_level"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Hierarchy Level</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select level" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {hierarchyLevels.map((level) => (
                         <SelectItem key={level} value={level}>{level}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="asset_type_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Asset Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select type" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {assetTypes?.map((type) => (
                         <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="status"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="Active">Active</SelectItem>
                         <SelectItem value="Maintenance">Maintenance</SelectItem>
                         <SelectItem value="Inactive">Inactive</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="criticality"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Criticality</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="High">High</SelectItem>
                         <SelectItem value="Medium">Medium</SelectItem>
                         <SelectItem value="Low">Low</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
             <FormField
               control={form.control}
               name="location"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Location</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Building A, Floor 1" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={createMutation.isPending}>
                 {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 Create Asset
               </Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 }