import { useState } from "react";
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
  Layers,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";
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

interface EntityType {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Draft";
  formsCount: number;
  assetsCount: number;
  icon: React.ElementType;
}

const entityTypes: EntityType[] = [
  {
    id: "1",
    name: "Motor",
    description: "Electric motors and drives used in production equipment",
    status: "Active",
    formsCount: 3,
    assetsCount: 847,
    icon: Box,
  },
  {
    id: "2",
    name: "Pump",
    description: "Centrifugal and positive displacement pumps",
    status: "Active",
    formsCount: 2,
    assetsCount: 523,
    icon: Layers,
  },
  {
    id: "3",
    name: "Gearbox",
    description: "Speed reducers and gear drives",
    status: "Active",
    formsCount: 2,
    assetsCount: 312,
    icon: Settings,
  },
  {
    id: "4",
    name: "Compressor",
    description: "Air and gas compressors for utilities",
    status: "Draft",
    formsCount: 1,
    assetsCount: 0,
    icon: Database,
  },
  {
    id: "5",
    name: "Valve",
    description: "Control and isolation valves",
    status: "Active",
    formsCount: 2,
    assetsCount: 1245,
    icon: Box,
  },
];

const baseFields = [
  { name: "Asset Name", type: "Text", required: true },
  { name: "Asset ID", type: "Auto-generated", required: true },
  { name: "Status", type: "Dropdown", required: true },
  { name: "Location", type: "Lookup", required: true },
  { name: "Criticality", type: "Dropdown", required: true },
  { name: "Created Date", type: "Date", required: true },
  { name: "Modified Date", type: "Date", required: true },
];

const EntityDesigner = () => {
  const [selectedEntity, setSelectedEntity] = useState<EntityType | null>(entityTypes[0]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entity Designer</h1>
          <p className="text-muted-foreground mt-1">
            Define asset types and their core metadata
          </p>
        </div>
        <Button>
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
              {entityTypes.map((entity, i) => (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEntity(entity)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedEntity?.id === entity.id
                      ? "border-primary bg-accent/50"
                      : "border-transparent hover:border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <entity.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{entity.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entity.assetsCount} assets • {entity.formsCount} forms
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
              ))}
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
                      <selectedEntity.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedEntity.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedEntity.description}
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
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
                    <p className="text-2xl font-bold text-foreground">{selectedEntity.assetsCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Forms</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{selectedEntity.formsCount}</p>
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
                      <Input id="entityName" value={selectedEntity.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entityStatus">Lifecycle Status</Label>
                      <Select value={selectedEntity.status.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="entityDesc">Description</Label>
                      <Textarea
                        id="entityDesc"
                        value={selectedEntity.description}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Base Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Base Fields (System)</h3>
                    <Badge variant="outline" className="text-xs">
                      {baseFields.length} fields
                    </Badge>
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Field Name
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Type
                          </th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">
                            Required
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {baseFields.map((field, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-3 text-sm font-medium">{field.name}</td>
                            <td className="p-3">
                              <Badge variant="secondary" className="text-xs font-normal">
                                {field.type}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {field.required && (
                                <CheckCircle className="w-4 h-4 text-success" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
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
    </div>
  );
};

export default EntityDesigner;
