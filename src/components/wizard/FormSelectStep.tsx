import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormDefinition } from "@/hooks/useFormDefinitions";

interface Props {
  forms: FormDefinition[];
  selectedFormId: string | null;
  onSelectForm: (formId: string) => void;
  assetTypeName: string;
}

export function FormSelectStep({ forms, selectedFormId, onSelectForm, assetTypeName }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Select a form template for your <strong>{assetTypeName}</strong> asset:
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {filteredForms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No forms found</p>
            </div>
          ) : (
            filteredForms.map((form) => (
              <Card
                key={form.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  selectedFormId === form.id && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => onSelectForm(form.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{form.name}</p>
                        {selectedFormId === form.id && (
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      {form.description && (
                        <p className="text-sm text-muted-foreground truncate">{form.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {form.form_fields?.length || 0} fields
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
