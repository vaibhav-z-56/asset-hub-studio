 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 import type { LifecycleStatus } from "./useAssetTypes";
 
 export interface FormField {
   id: string;
   form_id: string;
   field_key: string;
   label: string;
   field_type: string;
   tab: string;
   section: string | null;
   column_span: number;
   sort_order: number;
   is_required: boolean;
   is_readonly: boolean;
   is_visible: boolean;
   is_system_field: boolean;
   default_value: string | null;
   help_text: string | null;
   placeholder: string | null;
   options: any;
   validation_rules: any;
 }
 
 export interface FormDefinition {
   id: string;
   asset_type_id: string | null;
   name: string;
   description: string | null;
   status: LifecycleStatus;
   version: number;
   is_published: boolean;
   created_at: string;
   updated_at: string;
   form_fields?: FormField[];
 }
 
 export function useFormDefinitions(assetTypeId?: string) {
   return useQuery({
     queryKey: ["form-definitions", assetTypeId],
     queryFn: async () => {
       let query = supabase
         .from("form_definitions")
         .select("*, form_fields(*)")
         .order("created_at", { ascending: false });
 
       if (assetTypeId) {
         query = query.eq("asset_type_id", assetTypeId);
       }
 
       const { data, error } = await query;
       if (error) throw error;
       return data as FormDefinition[];
     },
   });
 }
 
 export function useFormDefinition(id: string | null) {
   return useQuery({
     queryKey: ["form-definitions", "detail", id],
     queryFn: async () => {
       if (!id) return null;
       const { data, error } = await supabase
         .from("form_definitions")
         .select("*, form_fields(*)")
         .eq("id", id)
         .maybeSingle();
 
       if (error) throw error;
       return data as FormDefinition | null;
     },
     enabled: !!id,
   });
 }
 
 export function useCreateFormDefinition() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (input: { name: string; asset_type_id?: string; description?: string }) => {
       const { data, error } = await supabase
         .from("form_definitions")
         .insert(input)
         .select()
         .single();
 
       if (error) throw error;
       return data as FormDefinition;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["form-definitions"] });
       toast({ title: "Form created successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to create form", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useUpdateFormDefinition() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<FormDefinition> & { id: string }) => {
       const { data, error } = await supabase
         .from("form_definitions")
         .update(updates)
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data as FormDefinition;
     },
     onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ["form-definitions"] });
       queryClient.invalidateQueries({ queryKey: ["form-definitions", "detail", variables.id] });
       toast({ title: "Form saved successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to save form", description: error.message, variant: "destructive" });
     },
   });
 }
 
export function useSaveFormFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, fields }: { formId: string; fields: Omit<FormField, "id" | "form_id">[] }) => {
      // Delete existing fields
      await supabase.from("form_fields").delete().eq("form_id", formId);

      // Insert new fields
      if (fields.length > 0) {
        const { error } = await supabase.from("form_fields").insert(
          fields.map((f, i) => ({
            ...f,
            form_id: formId,
            sort_order: i,
            // Convert options array to JSONB if present
            options: f.options ? (Array.isArray(f.options) ? f.options : f.options) : null,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["form-definitions"] });
      queryClient.invalidateQueries({ queryKey: ["form-definitions", "detail", variables.formId] });
      toast({ title: "Form fields saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to save form fields", description: error.message, variant: "destructive" });
    },
  });
}
 
 export function usePublishForm() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { data, error } = await supabase
         .from("form_definitions")
         .update({ is_published: true, status: "Active" as LifecycleStatus })
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data;
     },
     onSuccess: (_, id) => {
       queryClient.invalidateQueries({ queryKey: ["form-definitions"] });
       queryClient.invalidateQueries({ queryKey: ["form-definitions", "detail", id] });
       toast({ title: "Form published successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to publish form", description: error.message, variant: "destructive" });
     },
   });
 }