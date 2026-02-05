 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Layers, Plus, Box, FileText, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 import { useAssetTypes, useDeleteAssetType, type AssetType } from "@/hooks/useAssetTypes";
 import { CreateAssetTypeModal } from "@/components/modals/CreateAssetTypeModal";
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

const AssetTypes = () => {
   const { data: assetTypes, isLoading } = useAssetTypes();
   const deleteMutation = useDeleteAssetType();
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const [editingType, setEditingType] = useState<AssetType | null>(null);
   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
 
   const handleDelete = async () => {
     if (deleteConfirmId) {
       await deleteMutation.mutateAsync(deleteConfirmId);
       setDeleteConfirmId(null);
     }
   };
 
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your asset type definitions
          </p>
        </div>
         <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Asset Type
        </Button>
      </div>

      {/* Asset Types Grid */}
       {isLoading ? (
         <div className="flex items-center justify-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
         </div>
       ) : assetTypes?.length === 0 ? (
         <Card className="shadow-card">
           <CardContent className="flex flex-col items-center justify-center py-16">
             <Layers className="w-12 h-12 text-muted-foreground/40 mb-4" />
             <h3 className="text-lg font-medium text-foreground mb-2">No asset types yet</h3>
             <p className="text-muted-foreground text-sm mb-4">Create your first asset type to get started</p>
             <Button onClick={() => setCreateModalOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create Asset Type
             </Button>
           </CardContent>
         </Card>
       ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {assetTypes?.map((type, i) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          type.status === "Active"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {type.status}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => setEditingType(type)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                         <DropdownMenuItem 
                           className="text-destructive"
                           onClick={() => setDeleteConfirmId(type.id)}
                         >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                   {type.description && (
                     <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{type.description}</p>
                   )}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="w-4 h-4" />
                       <span>0 assets</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                       <span>0 forms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
           ))}
         </div>
       )}
 
       {/* Create/Edit Modal */}
       <CreateAssetTypeModal
         open={createModalOpen || !!editingType}
         onOpenChange={(open) => {
           if (!open) {
             setCreateModalOpen(false);
             setEditingType(null);
           }
         }}
         editingType={editingType}
       />
 
       {/* Delete Confirmation */}
       <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Asset Type?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete the asset type and all associated forms.
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

export default AssetTypes;
