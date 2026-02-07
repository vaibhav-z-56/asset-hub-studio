import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  List,
  GitBranch,
  ChevronRight,
  ChevronDown,
  Building2,
  MapPin,
  Cpu,
  Cog,
  Component,
  Radio,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssets, useAssetHierarchy, useDeleteAsset, type Asset } from "@/hooks/useAssets";
import { useAssetTypes } from "@/hooks/useAssetTypes";
import { CreateAssetWizard } from "@/components/modals/CreateAssetWizard";
import { EditAssetWizard } from "@/components/modals/EditAssetWizard";
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Maintenance":
      return "bg-warning/10 text-warning border-warning/20";
    case "Inactive":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "";
  }
};

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "Low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Enterprise":
      return Building2;
    case "Site":
      return MapPin;
    case "Area":
      return Component;
    case "System":
      return Cog;
    case "Unit":
    case "Subunit":
      return Cog;
    case "Component":
    case "Part":
      return Cpu;
    case "Sensor":
      return Radio;
    default:
      return Box;
  }
};

interface TreeNodeProps {
  asset: Asset;
  level: number;
  onDelete: (id: string) => void;
  onEdit: (asset: Asset) => void;
}

const TreeNode = ({ asset, level, onDelete, onEdit }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = asset.children && asset.children.length > 0;
  const Icon = getTypeIcon(asset.hierarchy_level);

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <button className="w-5 h-5 flex items-center justify-center">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="w-4 h-4 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.hierarchy_level} • {asset.location || "No location"}</p>
        </div>
        <Badge variant="outline" className={getStatusColor(asset.status)}>
          {asset.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(asset.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {hasChildren && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          {asset.children!.map((child) => (
            <TreeNode key={child.id} asset={child} level={level + 1} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Assets = () => {
  const [view, setView] = useState<"list" | "tree">("list");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: assets, isLoading } = useAssets();
  const { data: assetHierarchy } = useAssetHierarchy();
  const { data: assetTypes } = useAssetTypes();
  const deleteMutation = useDeleteAsset();

  const filteredAssets = assets?.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssetTypeName = (typeId: string | null) => {
    if (!typeId) return "—";
    const type = assetTypes?.find((t) => t.id === typeId);
    return type?.name || "—";
  };

  const handleDelete = async () => {
    for (const id of deleteConfirmIds) {
      await deleteMutation.mutateAsync(id);
    }
    setDeleteConfirmIds([]);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (filteredAssets && selectedIds.size === filteredAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAssets?.map((a) => a.id) || []));
    }
  };

  const handleBulkDelete = () => {
    setDeleteConfirmIds(Array.from(selectedIds));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your asset hierarchy
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Asset
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {assetTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs defaultValue="list" onValueChange={(v) => setView(v as "list" | "tree")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" className="gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="tree" className="gap-2">
              <GitBranch className="w-4 h-4" />
              Tree View
            </TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">
            {filteredAssets?.length || 0} assets found
          </p>
        </div>

        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAssets?.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Box className="w-12 h-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No assets yet</h3>
                <p className="text-muted-foreground text-sm mb-4">Create your first asset to get started</p>
                <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Asset
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredAssets && selectedIds.size === filteredAssets.length && filteredAssets.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets?.map((asset, i) => (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`hover:bg-muted/50 ${selectedIds.has(asset.id) ? "bg-accent/50" : ""}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(asset.id)}
                          onCheckedChange={() => toggleSelect(asset.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-muted-foreground" />
                          {getAssetTypeName(asset.asset_type_id)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{asset.location || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCriticalityColor(asset.criticality)}>
                          {asset.criticality}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(asset.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingAsset(asset)}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setDeleteConfirmIds([asset.id])}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tree" className="mt-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asset Hierarchy: Enterprise → Site → Area → System → Unit → Component → Sensor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {assetHierarchy?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <GitBranch className="w-12 h-12 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground text-sm">No assets in hierarchy view</p>
                </div>
              ) : (
                assetHierarchy?.map((asset) => (
                  <TreeNode 
                    key={asset.id} 
                    asset={asset} 
                    level={0} 
                    onDelete={(id) => setDeleteConfirmIds([id])} 
                    onEdit={setEditingAsset}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Modal */}
      <CreateAssetWizard open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Edit Modal */}
      {editingAsset && (
        <EditAssetWizard
          open={!!editingAsset}
          onOpenChange={(open) => !open && setEditingAsset(null)}
          asset={editingAsset}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmIds.length > 0} onOpenChange={() => setDeleteConfirmIds([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteConfirmIds.length === 1 ? "Asset" : `${deleteConfirmIds.length} Assets`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {deleteConfirmIds.length === 1 
                ? "This will permanently delete the asset." 
                : `This will permanently delete ${deleteConfirmIds.length} assets.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Assets;
