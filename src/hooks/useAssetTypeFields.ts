import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AssetTypeField {
  id: string;
  asset_type_id: string;
  field_key: string;
  label: string;
  field_type: string;
  is_required: boolean;
  is_readonly: boolean;
  default_value: string | null;
  help_text: string | null;
  placeholder: string | null;
  options: any;
  validation_rules: any;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAssetTypeFieldInput {
  asset_type_id: string;
  field_key: string;
  label: string;
  field_type?: string;
  is_required?: boolean;
  is_readonly?: boolean;
  default_value?: string;
  help_text?: string;
  placeholder?: string;
  options?: any;
  sort_order?: number;
}

export function useAssetTypeFields(assetTypeId: string | null) {
  return useQuery({
    queryKey: ["asset-type-fields", assetTypeId],
    queryFn: async () => {
      if (!assetTypeId) return [];
      const { data, error } = await supabase
        .from("asset_type_fields")
        .select("*")
        .eq("asset_type_id", assetTypeId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as AssetTypeField[];
    },
    enabled: !!assetTypeId,
  });
}

export function useCreateAssetTypeField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAssetTypeFieldInput) => {
      const { data, error } = await supabase
        .from("asset_type_fields")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as AssetTypeField;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asset-type-fields", variables.asset_type_id] });
      toast({ title: "Core field added successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to add core field", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAssetTypeField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, asset_type_id, ...updates }: Partial<AssetTypeField> & { id: string; asset_type_id: string }) => {
      const { data, error } = await supabase
        .from("asset_type_fields")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, asset_type_id } as AssetTypeField;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["asset-type-fields", data.asset_type_id] });
      toast({ title: "Core field updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update core field", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAssetTypeField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, asset_type_id }: { id: string; asset_type_id: string }) => {
      const { error } = await supabase
        .from("asset_type_fields")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { asset_type_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["asset-type-fields", data.asset_type_id] });
      toast({ title: "Core field deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete core field", description: error.message, variant: "destructive" });
    },
  });
}

export function useSaveAssetTypeFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetTypeId, fields }: { assetTypeId: string; fields: Omit<AssetTypeField, "id" | "asset_type_id" | "created_at" | "updated_at">[] }) => {
      // Delete existing fields
      await supabase.from("asset_type_fields").delete().eq("asset_type_id", assetTypeId);

      // Insert new fields
      if (fields.length > 0) {
        const { error } = await supabase.from("asset_type_fields").insert(
          fields.map((f, i) => ({
            ...f,
            asset_type_id: assetTypeId,
            sort_order: i,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asset-type-fields", variables.assetTypeId] });
      toast({ title: "Core fields saved successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to save core fields", description: error.message, variant: "destructive" });
    },
  });
}
