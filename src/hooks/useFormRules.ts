 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 import type { Json } from "@/integrations/supabase/types";
 
 export interface RuleCondition {
   field: string;
   operator: string;
   value: string;
 }
 
 export interface RuleAction {
   type: string;
   field: string;
 }
 
 export interface FormRule {
   id: string;
   form_id: string | null;
   name: string;
   description: string | null;
   is_enabled: boolean;
   conditions: RuleCondition[];
   actions: RuleAction[];
   created_at: string;
   updated_at: string;
 }
 
 // Helper to safely parse JSONB arrays
 function parseConditions(data: Json): RuleCondition[] {
   if (Array.isArray(data)) {
     return data as unknown as RuleCondition[];
   }
   return [];
 }
 
 function parseActions(data: Json): RuleAction[] {
   if (Array.isArray(data)) {
     return data as unknown as RuleAction[];
   }
   return [];
 }
 
 export function useFormRules(formId?: string) {
   return useQuery({
     queryKey: ["form-rules", formId],
     queryFn: async () => {
       let query = supabase
         .from("form_rules")
         .select("*")
         .order("created_at", { ascending: false });
 
       if (formId) {
         query = query.eq("form_id", formId);
       }
 
       const { data, error } = await query;
       if (error) throw error;
       
       return (data || []).map((row) => ({
         ...row,
         conditions: parseConditions(row.conditions),
         actions: parseActions(row.actions),
       })) as FormRule[];
     },
   });
 }
 
 export function useCreateFormRule() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (input: {
       name: string;
       description?: string;
       form_id?: string;
       conditions: RuleCondition[];
       actions: RuleAction[];
     }) => {
       const { data, error } = await supabase
         .from("form_rules")
         .insert({
           name: input.name,
           description: input.description,
           form_id: input.form_id,
           conditions: input.conditions as unknown as Json,
           actions: input.actions as unknown as Json,
         })
         .select()
         .single();
 
       if (error) throw error;
       return {
         ...data,
         conditions: parseConditions(data.conditions),
         actions: parseActions(data.actions),
       } as FormRule;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["form-rules"] });
       toast({ title: "Rule created successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to create rule", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useUpdateFormRule() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, conditions, actions, ...rest }: Partial<FormRule> & { id: string }) => {
       const updates: Record<string, unknown> = { ...rest };
       if (conditions) updates.conditions = conditions as unknown as Json;
       if (actions) updates.actions = actions as unknown as Json;
 
       const { data, error } = await supabase
         .from("form_rules")
         .update(updates)
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return {
         ...data,
         conditions: parseConditions(data.conditions),
         actions: parseActions(data.actions),
       } as FormRule;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["form-rules"] });
       toast({ title: "Rule updated successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to update rule", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useDeleteFormRule() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("form_rules").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["form-rules"] });
       toast({ title: "Rule deleted successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to delete rule", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useToggleFormRule() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
       const { error } = await supabase
         .from("form_rules")
         .update({ is_enabled })
         .eq("id", id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["form-rules"] });
     },
     onError: (error) => {
       toast({ title: "Failed to toggle rule", description: error.message, variant: "destructive" });
     },
   });
 }