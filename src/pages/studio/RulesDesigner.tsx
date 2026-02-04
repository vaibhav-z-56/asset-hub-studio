import { motion } from "framer-motion";
import { Plus, GitBranch, Play, Trash2, Copy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const rules = [
  {
    id: "1",
    name: "Show Gear Ratio for Gearbox",
    description: "Display gear ratio field when asset type is Gearbox",
    conditions: [{ field: "Asset Type", operator: "equals", value: "Gearbox" }],
    actions: [{ type: "Show", field: "Gear Ratio" }],
    enabled: true,
  },
  {
    id: "2",
    name: "Critical Asset Validation",
    description: "Make Serial Number required for high criticality assets",
    conditions: [{ field: "Criticality", operator: "equals", value: "High" }],
    actions: [{ type: "Make Required", field: "Serial Number" }],
    enabled: true,
  },
  {
    id: "3",
    name: "Motor-specific Fields",
    description: "Show motor-specific fields for Motor asset type",
    conditions: [{ field: "Asset Type", operator: "equals", value: "Motor" }],
    actions: [
      { type: "Show", field: "Rated Power" },
      { type: "Show", field: "RPM" },
    ],
    enabled: true,
  },
  {
    id: "4",
    name: "Maintenance Status Alert",
    description: "Show maintenance notes when status is Maintenance",
    conditions: [{ field: "Status", operator: "equals", value: "Maintenance" }],
    actions: [{ type: "Show", field: "Maintenance Notes" }],
    enabled: false,
  },
];

const RulesDesigner = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rules Designer</h1>
          <p className="text-muted-foreground mt-1">
            Configure conditional logic for dynamic form behavior
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{rule.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                  <Switch checked={rule.enabled} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Conditions */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    When
                  </p>
                  <div className="space-y-2">
                    {rule.conditions.map((condition, ci) => (
                      <div
                        key={ci}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm"
                      >
                        <Badge variant="secondary" className="font-mono text-xs">
                          {condition.field}
                        </Badge>
                        <span className="text-muted-foreground">{condition.operator}</span>
                        <Badge variant="outline" className="font-medium">
                          {condition.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Then
                  </p>
                  <div className="space-y-2">
                    {rule.actions.map((action, ai) => (
                      <div
                        key={ai}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 text-sm"
                      >
                        <Badge className="text-xs">{action.type}</Badge>
                        <span className="font-medium">{action.field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rule Testing Panel */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Rule Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Play className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Select a rule and simulate values to test its behavior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesDesigner;
