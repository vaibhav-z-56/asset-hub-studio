 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Plus, GitBranch, Play, Trash2, Copy, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
 import { useFormRules, useDeleteFormRule, useToggleFormRule } from "@/hooks/useFormRules";
 import { CreateRuleModal } from "@/components/modals/CreateRuleModal";
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from "@/components/ui/alert-dialog";

const RulesDesigner = () => {
   const { data: rules, isLoading } = useFormRules();
   const deleteMutation = useDeleteFormRule();
   const toggleMutation = useToggleFormRule();
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
 
   const handleDelete = async () => {
     if (deleteConfirmId) {
       await deleteMutation.mutateAsync(deleteConfirmId);
       setDeleteConfirmId(null);
     }
   };
 
   const handleToggle = (id: string, currentValue: boolean) => {
     toggleMutation.mutate({ id, is_enabled: !currentValue });
   };
 
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
         <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules Grid */}
       {isLoading ? (
         <div className="flex items-center justify-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
         </div>
       ) : rules?.length === 0 ? (
         <Card className="shadow-card">
           <CardContent className="flex flex-col items-center justify-center py-16">
             <GitBranch className="w-12 h-12 text-muted-foreground/40 mb-4" />
             <h3 className="text-lg font-medium text-foreground mb-2">No rules yet</h3>
             <p className="text-muted-foreground text-sm mb-4">Create conditional logic rules to control form behavior</p>
             <Button onClick={() => setCreateModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Rule
             </Button>
           </CardContent>
         </Card>
       ) : (
         <div className="grid md:grid-cols-2 gap-4">
           {rules?.map((rule, i) => (
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
                           {rule.description || "No description"}
                      </p>
                    </div>
                  </div>
                     <Switch 
                       checked={rule.is_enabled} 
                       onCheckedChange={() => handleToggle(rule.id, rule.is_enabled)}
                     />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Conditions */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    When
                  </p>
                  <div className="space-y-2">
                       {(rule.conditions || []).map((condition, ci) => (
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
                       {(rule.actions || []).map((action, ai) => (
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
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-8 w-8 text-destructive"
                       onClick={() => setDeleteConfirmId(rule.id)}
                     >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
           ))}
         </div>
       )}

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
 
       {/* Create Modal */}
       <CreateRuleModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
 
       {/* Delete Confirmation */}
       <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete the rule.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
               Delete
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
    </div>
  );
};

export default RulesDesigner;
