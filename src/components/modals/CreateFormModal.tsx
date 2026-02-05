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
 import { useCreateFormDefinition } from "@/hooks/useFormDefinitions";
 import { useAssetTypes } from "@/hooks/useAssetTypes";
 import { Loader2 } from "lucide-react";
 
 const formSchema = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().optional(),
   asset_type_id: z.string().optional(),
 });
 
 type FormValues = z.infer<typeof formSchema>;
 
 interface Props {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onCreated?: (formId: string) => void;
 }
 
 export function CreateFormModal({ open, onOpenChange, onCreated }: Props) {
   const createMutation = useCreateFormDefinition();
   const { data: assetTypes } = useAssetTypes();
 
   const form = useForm<FormValues>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       name: "",
       description: "",
     },
   });
 
   const onSubmit = async (values: FormValues) => {
     const result = await createMutation.mutateAsync({
       name: values.name,
       description: values.description,
       asset_type_id: values.asset_type_id,
     });
     form.reset();
     onOpenChange(false);
     onCreated?.(result.id);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-md">
         <DialogHeader>
           <DialogTitle>Create Form</DialogTitle>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Form Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Motor Inspection Form" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
             <FormField
               control={form.control}
               name="asset_type_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Asset Type (Optional)</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Link to asset type" />
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
             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Description</FormLabel>
                   <FormControl>
                     <Textarea
                       placeholder="Describe this form..."
                       className="resize-none"
                       {...field}
                     />
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
                 Create Form
               </Button>
             </DialogFooter>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 }