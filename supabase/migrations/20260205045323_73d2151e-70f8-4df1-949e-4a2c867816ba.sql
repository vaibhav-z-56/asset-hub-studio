-- Create ENUM types for statuses
CREATE TYPE public.asset_status AS ENUM ('Active', 'Maintenance', 'Inactive');
CREATE TYPE public.criticality_level AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE public.lifecycle_status AS ENUM ('Active', 'Draft', 'Deprecated');
CREATE TYPE public.hierarchy_level AS ENUM ('Enterprise', 'Site', 'Area', 'System', 'Unit', 'Subunit', 'Component', 'Part', 'Sensor');

-- Asset Types table (Entity Designer)
CREATE TABLE public.asset_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Box',
    status public.lifecycle_status NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Form Definitions table (stores form configurations)
CREATE TABLE public.form_definitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_type_id UUID REFERENCES public.asset_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status public.lifecycle_status NOT NULL DEFAULT 'Draft',
    version INTEGER NOT NULL DEFAULT 1,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Form Fields table (fields within a form)
CREATE TABLE public.form_fields (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES public.form_definitions(id) ON DELETE CASCADE NOT NULL,
    field_key TEXT NOT NULL,
    label TEXT NOT NULL,
    field_type TEXT NOT NULL DEFAULT 'text',
    tab TEXT NOT NULL DEFAULT 'general',
    section TEXT,
    column_span INTEGER DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT false,
    is_readonly BOOLEAN NOT NULL DEFAULT false,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    is_system_field BOOLEAN NOT NULL DEFAULT false,
    default_value TEXT,
    help_text TEXT,
    placeholder TEXT,
    options JSONB,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rules table (conditional logic)
CREATE TABLE public.form_rules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID REFERENCES public.form_definitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    conditions JSONB NOT NULL DEFAULT '[]',
    actions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Field Permissions table (role-based access)
CREATE TABLE public.field_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    field_id UUID REFERENCES public.form_fields(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    can_view BOOLEAN NOT NULL DEFAULT true,
    can_edit BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Assets table (actual asset records)
CREATE TABLE public.assets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_type_id UUID REFERENCES public.asset_types(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    hierarchy_level public.hierarchy_level NOT NULL DEFAULT 'Unit',
    status public.asset_status NOT NULL DEFAULT 'Active',
    criticality public.criticality_level NOT NULL DEFAULT 'Medium',
    location TEXT,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit Log table
CREATE TABLE public.audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    changes JSONB,
    performed_by TEXT,
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- For MVP, allow public access (we'll add auth-based policies later)
CREATE POLICY "Allow public read on asset_types" ON public.asset_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert on asset_types" ON public.asset_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on asset_types" ON public.asset_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on asset_types" ON public.asset_types FOR DELETE USING (true);

CREATE POLICY "Allow public read on form_definitions" ON public.form_definitions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on form_definitions" ON public.form_definitions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on form_definitions" ON public.form_definitions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on form_definitions" ON public.form_definitions FOR DELETE USING (true);

CREATE POLICY "Allow public read on form_fields" ON public.form_fields FOR SELECT USING (true);
CREATE POLICY "Allow public insert on form_fields" ON public.form_fields FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on form_fields" ON public.form_fields FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on form_fields" ON public.form_fields FOR DELETE USING (true);

CREATE POLICY "Allow public read on form_rules" ON public.form_rules FOR SELECT USING (true);
CREATE POLICY "Allow public insert on form_rules" ON public.form_rules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on form_rules" ON public.form_rules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on form_rules" ON public.form_rules FOR DELETE USING (true);

CREATE POLICY "Allow public read on field_permissions" ON public.field_permissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on field_permissions" ON public.field_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on field_permissions" ON public.field_permissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on field_permissions" ON public.field_permissions FOR DELETE USING (true);

CREATE POLICY "Allow public read on assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on assets" ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on assets" ON public.assets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on assets" ON public.assets FOR DELETE USING (true);

CREATE POLICY "Allow public read on audit_log" ON public.audit_log FOR SELECT USING (true);
CREATE POLICY "Allow public insert on audit_log" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_form_definitions_asset_type ON public.form_definitions(asset_type_id);
CREATE INDEX idx_form_fields_form ON public.form_fields(form_id);
CREATE INDEX idx_form_rules_form ON public.form_rules(form_id);
CREATE INDEX idx_assets_type ON public.assets(asset_type_id);
CREATE INDEX idx_assets_parent ON public.assets(parent_id);
CREATE INDEX idx_audit_entity ON public.audit_log(entity_type, entity_id);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_asset_types_updated_at BEFORE UPDATE ON public.asset_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_form_definitions_updated_at BEFORE UPDATE ON public.form_definitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_form_fields_updated_at BEFORE UPDATE ON public.form_fields FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_form_rules_updated_at BEFORE UPDATE ON public.form_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some seed data for asset types
INSERT INTO public.asset_types (name, description, icon, status) VALUES
('Motor', 'Electric motors and drives used in production equipment', 'Zap', 'Active'),
('Pump', 'Centrifugal and positive displacement pumps', 'Droplets', 'Active'),
('Gearbox', 'Speed reducers and gear drives', 'Cog', 'Active'),
('Compressor', 'Air and gas compressors for utilities', 'Wind', 'Draft'),
('Valve', 'Control and isolation valves', 'CircleDot', 'Active'),
('Conveyor', 'Belt and roller conveyors', 'ArrowRight', 'Draft');