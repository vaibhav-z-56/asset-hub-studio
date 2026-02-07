import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Settings,
  Box,
  CheckCircle,
  Clock,
  Loader2,
  GripVertical,
  Lock,
  Asterisk,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useAssetTypes, useUpdateAssetType, useDeleteAssetType, type AssetType } from "@/hooks/useAssetTypes";
import { useAssetTypeFields, useDeleteAssetTypeField, type AssetTypeField } from "@/hooks/useAssetTypeFields";
import { useFormDefinitions } from "@/hooks/useFormDefinitions";
import { useAssets } from "@/hooks/useAssets";
import { CreateAssetTypeModal } from "@/components/modals/CreateAssetTypeModal";
import { AddCoreFieldModal } from "@/components/modals/AddCoreFieldModal";

const fieldTypeLabels: Record<string, string> = {
  text: "Text",
  number: "Number",
  date: "Date",
  dropdown: "Dropdown",
  toggle: "Toggle",
  textarea: "Text Area",
  lookup: "Lookup",
};

const EntityDesigner = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteFieldConfirm, setDeleteFieldConfirm] = useState<{ id: string; assetTypeId: string } | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<string>("Draft");

  const { data: assetTypes, isLoading } = useAssetTypes();
  const { data: coreFields } = useAssetTypeFields(selectedEntityId);
  const { data: forms } = useFormDefinitions();
  const { data: assets } = useAssets();
  const updateMutation = useUpdateAssetType();
  const deleteMutation = useDeleteAssetType();
  const deleteFieldMutation = useDeleteAssetTypeField();

  const selectedEntity = assetTypes?.find((t) => t.id === selectedEntityId);

  // Select first entity if none selected
  useEffect(() => {
    if (assetTypes?.length && !selectedEntityId) {
      setSelectedEntityId(assetTypes[0].id);
    }
  }, [assetTypes, selectedEntityId]);

  // Update edit fields when selection changes
  useEffect(() => {
    if (selectedEntity) {
      setEditName(selectedEntity.name);
      setEditDescription(selectedEntity.description || "");
      setEditStatus(selectedEntity.status);
    }
  }, [selectedEntity]);

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Box;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Box;
  };

  const getFormsCount = (assetTypeId: string) => {
    return forms?.filter((f) => f.asset_type_id === assetTypeId).length || 0;
  };

  const getAssetsCount = (assetTypeId: string) => {
    return assets?.filter((a) => a.asset_type_id === assetTypeId).length || 0;
  };

  const handleSave = async () => {
    if (!selectedEntityId) return;
    await updateMutation.mutateAsync({
      id: selectedEntityId,
      name: editName,
      description: editDescription || null,
      status: editStatus as AssetType["status"],
    });
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
      if (selectedEntityId === deleteConfirmId) {
        setSelectedEntityId(null);
      }
    }
  };

  const handleDeleteField = async () => {
    if (deleteFieldConfirm) {
      await deleteFieldMutation.mutateAsync({
        id: deleteFieldConfirm.id,
        asset_type_id: deleteFieldConfirm.assetTypeId,
      });
      setDeleteFieldConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entity Designer</h1>
          <p className="text-muted-foreground mt-1">
            Define asset types and their core mandatory fields
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Asset Type
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Entity List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Asset Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {assetTypes?.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-sm">No asset types yet</p>
                </div>
              ) : (
                assetTypes?.map((entity, i) => {
                  const IconComponent = getIconComponent(entity.icon);
                  return (
                    <motion.div
                      key={entity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedEntityId(entity.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedEntityId === entity.id
                          ? "border-primary bg-accent/50"
                          : "border-transparent hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{entity.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {getAssetsCount(entity.id)} assets • {getFormsCount(entity.id)} forms
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            entity.status === "Active"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {entity.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Entity Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          {selectedEntity ? (
            <Card className="shadow-card">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const IconComponent = getIconComponent(selectedEntity.icon);
                        return <IconComponent className="w-7 h-7 text-primary" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedEntity.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedEntity.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteConfirmId(selectedEntity.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Box className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Assets</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {getAssetsCount(selectedEntity.id)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Forms</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {getFormsCount(selectedEntity.id)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      {selectedEntity.status === "Active" ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Clock className="w-4 h-4 text-warning" />
                      )}
                      <span className="text-sm text-muted-foreground">Status</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedEntity.status}</p>
                  </div>
                </div>

                {/* Entity Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">Entity Settings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entityName">Name</Label>
                      <Input
                        id="entityName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entityStatus">Lifecycle Status</Label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="entityDesc">Description</Label>
                      <Textarea
                        id="entityDesc"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Mandatory Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Core Mandatory Fields</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        These fields are required for all assets of this type and appear in every form
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddFieldModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left text-xs font-medium text-muted-foreground p-3 w-8"></th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Field Name
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Key
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Type
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Required
                          </th>
                          <th className="w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {coreFields?.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              <Lock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p className="text-sm">No core fields defined yet</p>
                              <p className="text-xs">Add fields that will be mandatory for all assets of this type</p>
                            </td>
                          </tr>
                        ) : (
                          coreFields?.map((field) => (
                            <tr key={field.id} className="border-t group hover:bg-muted/30">
                              <td className="p-3">
                                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{field.label}</span>
                                  <Lock className="w-3 h-3 text-muted-foreground" />
                                </div>
                              </td>
                              <td className="p-3">
                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {field.field_key}
                                </code>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {fieldTypeLabels[field.field_type] || field.field_type}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {field.is_required && (
                                  <div className="flex items-center gap-1">
                                    <Asterisk className="w-3 h-3 text-destructive" />
                                    <CheckCircle className="w-4 h-4 text-success" />
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 opacity-0 group-hover:opacity-100"
                                  onClick={() =>
                                    setDeleteFieldConfirm({
                                      id: field.id,
                                      assetTypeId: selectedEntity.id,
                                    })
                                  }
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedEntity) {
                        setEditName(selectedEntity.name);
                        setEditDescription(selectedEntity.description || "");
                        setEditStatus(selectedEntity.status);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Select an asset type</p>
                <p className="text-sm">Choose from the list to view details</p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Create Asset Type Modal */}
      <CreateAssetTypeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={(id) => setSelectedEntityId(id)}
      />

      {/* Add Core Field Modal */}
      {selectedEntityId && (
        <AddCoreFieldModal
          open={addFieldModalOpen}
          onOpenChange={setAddFieldModalOpen}
          assetTypeId={selectedEntityId}
          existingFieldKeys={coreFields?.map((f) => f.field_key) || []}
        />
      )}

      {/* Delete Asset Type Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset Type?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this asset type and all its core fields. Forms and assets using this type may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Field Confirmation */}
      <AlertDialog open={!!deleteFieldConfirm} onOpenChange={() => setDeleteFieldConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Core Field?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this field from all forms that use this asset type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteField}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EntityDesigner;
