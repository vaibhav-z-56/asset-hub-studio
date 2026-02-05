 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 
 export type LifecycleStatus = "Active" | "Draft" | "Deprecated";
 
 export interface AssetType {
   id: string;
   name: string;
   description: string | null;
   icon: string | null;
   status: LifecycleStatus;
   created_at: string;
   updated_at: string;
 }
 
 export interface CreateAssetTypeInput {
   name: string;
   description?: string;
   icon?: string;
   status?: LifecycleStatus;
 }
 
 export function useAssetTypes() {
   return useQuery({
     queryKey: ["asset-types"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("asset_types")
         .select("*")
         .order("created_at", { ascending: false });
 
       if (error) throw error;
       return data as AssetType[];
     },
   });
 }
 
 export function useAssetType(id: string | null) {
   return useQuery({
     queryKey: ["asset-types", id],
     queryFn: async () => {
       if (!id) return null;
       const { data, error } = await supabase
         .from("asset_types")
         .select("*")
         .eq("id", id)
         .maybeSingle();
 
       if (error) throw error;
       return data as AssetType | null;
     },
     enabled: !!id,
   });
 }
 
 export function useCreateAssetType() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (input: CreateAssetTypeInput) => {
       const { data, error } = await supabase
         .from("asset_types")
         .insert(input)
         .select()
         .single();
 
       if (error) throw error;
       return data as AssetType;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["asset-types"] });
       toast({ title: "Asset type created successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to create asset type", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useUpdateAssetType() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<AssetType> & { id: string }) => {
       const { data, error } = await supabase
         .from("asset_types")
         .update(updates)
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data as AssetType;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["asset-types"] });
       toast({ title: "Asset type updated successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to update asset type", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useDeleteAssetType() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("asset_types").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["asset-types"] });
       toast({ title: "Asset type deleted successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to delete asset type", description: error.message, variant: "destructive" });
     },
   });
 }