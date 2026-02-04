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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "Active" | "Maintenance" | "Inactive";
  criticality: "High" | "Medium" | "Low";
  lastUpdated: string;
  children?: Asset[];
}

const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Main Production Plant",
    type: "Enterprise",
    location: "Chicago, IL",
    status: "Active",
    criticality: "High",
    lastUpdated: "2024-01-15",
    children: [
      {
        id: "1.1",
        name: "Building A - Manufacturing",
        type: "Site",
        location: "Building A",
        status: "Active",
        criticality: "High",
        lastUpdated: "2024-01-14",
        children: [
          {
            id: "1.1.1",
            name: "Production Line 1",
            type: "Area",
            location: "Floor 1",
            status: "Active",
            criticality: "High",
            lastUpdated: "2024-01-13",
            children: [
              {
                id: "1.1.1.1",
                name: "Motor M-2847",
                type: "Unit",
                location: "Station A",
                status: "Active",
                criticality: "Medium",
                lastUpdated: "2024-01-12",
              },
              {
                id: "1.1.1.2",
                name: "Pump P-1234",
                type: "Unit",
                location: "Station B",
                status: "Maintenance",
                criticality: "High",
                lastUpdated: "2024-01-11",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "East Coast Distribution",
    type: "Enterprise",
    location: "New York, NY",
    status: "Active",
    criticality: "Medium",
    lastUpdated: "2024-01-10",
  },
];

const flatAssets: Asset[] = [
  { id: "1", name: "Motor M-2847", type: "Motor", location: "Line A, Station 1", status: "Active", criticality: "High", lastUpdated: "2024-01-15" },
  { id: "2", name: "Pump P-1234", type: "Pump", location: "Line A, Station 2", status: "Maintenance", criticality: "Medium", lastUpdated: "2024-01-14" },
  { id: "3", name: "Gearbox G-567", type: "Gearbox", location: "Line B, Station 1", status: "Active", criticality: "Low", lastUpdated: "2024-01-13" },
  { id: "4", name: "Compressor C-890", type: "Compressor", location: "Utility Room", status: "Inactive", criticality: "High", lastUpdated: "2024-01-12" },
  { id: "5", name: "Valve V-111", type: "Valve", location: "Line A, Station 3", status: "Active", criticality: "Low", lastUpdated: "2024-01-11" },
];

const getStatusColor = (status: Asset["status"]) => {
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

const getCriticalityColor = (criticality: Asset["criticality"]) => {
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
    case "Unit":
      return Cog;
    case "Component":
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
}

const TreeNode = ({ asset, level }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = asset.children && asset.children.length > 0;
  const Icon = getTypeIcon(asset.type);

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
          <p className="text-xs text-muted-foreground">{asset.type} • {asset.location}</p>
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
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" /> View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
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
            <TreeNode key={child.id} asset={child} level={level + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Assets = () => {
  const [view, setView] = useState<"list" | "tree">("list");

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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Asset
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search assets..." className="pl-10" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="gearbox">Gearbox</SelectItem>
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
            {flatAssets.length} assets found
          </p>
        </div>

        <TabsContent value="list" className="mt-4">
          <Card className="shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
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
                {flatAssets.map((asset, i) => (
                  <motion.tr
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-muted-foreground" />
                        {asset.type}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{asset.location}</TableCell>
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
                    <TableCell className="text-muted-foreground">{asset.lastUpdated}</TableCell>
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
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
        </TabsContent>

        <TabsContent value="tree" className="mt-4">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Asset Hierarchy: Enterprise → Site → Area → System → Unit → Component → Sensor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {mockAssets.map((asset) => (
                <TreeNode key={asset.id} asset={asset} level={0} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assets;
