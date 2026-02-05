 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "@/hooks/use-toast";
 
 export type AssetStatus = "Active" | "Maintenance" | "Inactive";
 export type CriticalityLevel = "High" | "Medium" | "Low";
 export type HierarchyLevel = "Enterprise" | "Site" | "Area" | "System" | "Unit" | "Subunit" | "Component" | "Part" | "Sensor";
 
 export interface Asset {
   id: string;
   asset_type_id: string | null;
   parent_id: string | null;
   name: string;
   hierarchy_level: HierarchyLevel;
   status: AssetStatus;
   criticality: CriticalityLevel;
   location: string | null;
   data: Record<string, any>;
   created_at: string;
   updated_at: string;
   children?: Asset[];
 }
 
 export function useAssets() {
   return useQuery({
     queryKey: ["assets"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("assets")
         .select("*")
         .order("created_at", { ascending: false });
 
       if (error) throw error;
       return data as Asset[];
     },
   });
 }
 
 export function useAssetHierarchy() {
   return useQuery({
     queryKey: ["assets", "hierarchy"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("assets")
         .select("*")
         .order("hierarchy_level", { ascending: true })
         .order("name", { ascending: true });
 
       if (error) throw error;
 
       // Build tree structure
       const assets = data as Asset[];
       const assetMap = new Map<string, Asset>();
       const roots: Asset[] = [];
 
       assets.forEach((asset) => {
         asset.children = [];
         assetMap.set(asset.id, asset);
       });
 
       assets.forEach((asset) => {
         if (asset.parent_id && assetMap.has(asset.parent_id)) {
           assetMap.get(asset.parent_id)!.children!.push(asset);
         } else {
           roots.push(asset);
         }
       });
 
       return roots;
     },
   });
 }
 
 export function useCreateAsset() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (input: {
       name: string;
       asset_type_id?: string;
       parent_id?: string;
       hierarchy_level: HierarchyLevel;
       status?: AssetStatus;
       criticality?: CriticalityLevel;
       location?: string;
       data?: Record<string, any>;
     }) => {
       const { data, error } = await supabase
         .from("assets")
         .insert(input)
         .select()
         .single();
 
       if (error) throw error;
       return data as Asset;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["assets"] });
       toast({ title: "Asset created successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to create asset", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useUpdateAsset() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, ...updates }: Partial<Asset> & { id: string }) => {
       const { data, error } = await supabase
         .from("assets")
         .update(updates)
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data as Asset;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["assets"] });
       toast({ title: "Asset updated successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to update asset", description: error.message, variant: "destructive" });
     },
   });
 }
 
 export function useDeleteAsset() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("assets").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["assets"] });
       toast({ title: "Asset deleted successfully" });
     },
     onError: (error) => {
       toast({ title: "Failed to delete asset", description: error.message, variant: "destructive" });
     },
   });
 }