export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      asset_type_fields: {
        Row: {
          asset_type_id: string
          created_at: string
          default_value: string | null
          field_key: string
          field_type: string
          help_text: string | null
          id: string
          is_readonly: boolean
          is_required: boolean
          label: string
          options: Json | null
          placeholder: string | null
          sort_order: number
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          asset_type_id: string
          created_at?: string
          default_value?: string | null
          field_key: string
          field_type?: string
          help_text?: string | null
          id?: string
          is_readonly?: boolean
          is_required?: boolean
          label: string
          options?: Json | null
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          asset_type_id?: string
          created_at?: string
          default_value?: string | null
          field_key?: string
          field_type?: string
          help_text?: string | null
          id?: string
          is_readonly?: boolean
          is_required?: boolean
          label?: string
          options?: Json | null
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_type_fields_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["lifecycle_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["lifecycle_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["lifecycle_status"]
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          asset_type_id: string | null
          created_at: string
          criticality: Database["public"]["Enums"]["criticality_level"]
          data: Json
          hierarchy_level: Database["public"]["Enums"]["hierarchy_level"]
          id: string
          location: string | null
          name: string
          parent_id: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string
        }
        Insert: {
          asset_type_id?: string | null
          created_at?: string
          criticality?: Database["public"]["Enums"]["criticality_level"]
          data?: Json
          hierarchy_level?: Database["public"]["Enums"]["hierarchy_level"]
          id?: string
          location?: string | null
          name: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Update: {
          asset_type_id?: string | null
          created_at?: string
          criticality?: Database["public"]["Enums"]["criticality_level"]
          data?: Json
          hierarchy_level?: Database["public"]["Enums"]["hierarchy_level"]
          id?: string
          location?: string | null
          name?: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          entity_id: string
          entity_type: string
          id: string
          performed_at: string
          performed_by: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Relationships: []
      }
      field_permissions: {
        Row: {
          can_edit: boolean
          can_view: boolean
          created_at: string
          field_id: string
          id: string
          role: string
        }
        Insert: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          field_id: string
          id?: string
          role: string
        }
        Update: {
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          field_id?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_permissions_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "form_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      form_definitions: {
        Row: {
          asset_type_id: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          name: string
          status: Database["public"]["Enums"]["lifecycle_status"]
          updated_at: string
          version: number
        }
        Insert: {
          asset_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          name: string
          status?: Database["public"]["Enums"]["lifecycle_status"]
          updated_at?: string
          version?: number
        }
        Update: {
          asset_type_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          name?: string
          status?: Database["public"]["Enums"]["lifecycle_status"]
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_definitions_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          column_span: number | null
          created_at: string
          default_value: string | null
          field_key: string
          field_type: string
          form_id: string
          help_text: string | null
          id: string
          is_readonly: boolean
          is_required: boolean
          is_system_field: boolean
          is_visible: boolean
          label: string
          options: Json | null
          placeholder: string | null
          section: string | null
          sort_order: number
          tab: string
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          column_span?: number | null
          created_at?: string
          default_value?: string | null
          field_key: string
          field_type?: string
          form_id: string
          help_text?: string | null
          id?: string
          is_readonly?: boolean
          is_required?: boolean
          is_system_field?: boolean
          is_visible?: boolean
          label: string
          options?: Json | null
          placeholder?: string | null
          section?: string | null
          sort_order?: number
          tab?: string
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          column_span?: number | null
          created_at?: string
          default_value?: string | null
          field_key?: string
          field_type?: string
          form_id?: string
          help_text?: string | null
          id?: string
          is_readonly?: boolean
          is_required?: boolean
          is_system_field?: boolean
          is_visible?: boolean
          label?: string
          options?: Json | null
          placeholder?: string | null
          section?: string | null
          sort_order?: number
          tab?: string
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      form_rules: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          description: string | null
          form_id: string | null
          id: string
          is_enabled: boolean
          name: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          form_id?: string | null
          id?: string
          is_enabled?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          description?: string | null
          form_id?: string | null
          id?: string
          is_enabled?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_rules_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_status: "Active" | "Maintenance" | "Inactive"
      criticality_level: "High" | "Medium" | "Low"
      hierarchy_level:
        | "Enterprise"
        | "Site"
        | "Area"
        | "System"
        | "Unit"
        | "Subunit"
        | "Component"
        | "Part"
        | "Sensor"
      lifecycle_status: "Active" | "Draft" | "Deprecated"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_status: ["Active", "Maintenance", "Inactive"],
      criticality_level: ["High", "Medium", "Low"],
      hierarchy_level: [
        "Enterprise",
        "Site",
        "Area",
        "System",
        "Unit",
        "Subunit",
        "Component",
        "Part",
        "Sensor",
      ],
      lifecycle_status: ["Active", "Draft", "Deprecated"],
    },
  },
} as const
