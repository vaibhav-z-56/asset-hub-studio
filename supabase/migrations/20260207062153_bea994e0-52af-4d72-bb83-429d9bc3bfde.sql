-- Create table for Asset Type Core Fields (mandatory fields per asset type)
CREATE TABLE public.asset_type_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type_id UUID NOT NULL REFERENCES public.asset_types(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_readonly BOOLEAN NOT NULL DEFAULT false,
  default_value TEXT,
  help_text TEXT,
  placeholder TEXT,
  options JSONB,
  validation_rules JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(asset_type_id, field_key)
);

-- Enable RLS
ALTER TABLE public.asset_type_fields ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read on asset_type_fields" 
ON public.asset_type_fields 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on asset_type_fields" 
ON public.asset_type_fields 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on asset_type_fields" 
ON public.asset_type_fields 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on asset_type_fields" 
ON public.asset_type_fields 
FOR DELETE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_asset_type_fields_updated_at
BEFORE UPDATE ON public.asset_type_fields
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();