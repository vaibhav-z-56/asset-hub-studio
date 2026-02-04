import { motion } from "framer-motion";
import { History, User, Box, FileText, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const auditLogs = [
  {
    id: "1",
    user: "John Smith",
    action: "Created",
    object: "Motor M-2847",
    objectType: "Asset",
    timestamp: "2024-01-15 14:32:05",
  },
  {
    id: "2",
    user: "Sarah Johnson",
    action: "Published",
    object: "Gearbox Inspection Form v2.3",
    objectType: "Form",
    timestamp: "2024-01-15 13:45:22",
  },
  {
    id: "3",
    user: "Mike Davis",
    action: "Updated",
    object: "Pump P-1234",
    objectType: "Asset",
    timestamp: "2024-01-15 12:18:44",
  },
  {
    id: "4",
    user: "Emily Chen",
    action: "Created",
    object: "Critical Asset Validation",
    objectType: "Rule",
    timestamp: "2024-01-15 11:05:33",
  },
  {
    id: "5",
    user: "John Smith",
    action: "Deleted",
    object: "Draft Form v1.0",
    objectType: "Form",
    timestamp: "2024-01-15 10:22:11",
  },
  {
    id: "6",
    user: "Sarah Johnson",
    action: "Updated",
    object: "Motor Entity Type",
    objectType: "Entity",
    timestamp: "2024-01-15 09:55:48",
  },
  {
    id: "7",
    user: "Admin",
    action: "Modified",
    object: "Maintenance Role Permissions",
    objectType: "Permission",
    timestamp: "2024-01-14 16:30:00",
  },
];

const getActionColor = (action: string) => {
  switch (action) {
    case "Created":
      return "bg-success/10 text-success border-success/20";
    case "Updated":
    case "Modified":
      return "bg-primary/10 text-primary border-primary/20";
    case "Published":
      return "bg-info/10 text-info border-info/20";
    case "Deleted":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getObjectIcon = (objectType: string) => {
  switch (objectType) {
    case "Asset":
      return Box;
    case "Form":
      return FileText;
    default:
      return History;
  }
};

const AuditLog = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit & Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Track all changes and actions across the platform
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input placeholder="Search by user, object, or action..." />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Davis</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Object Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="asset">Asset</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="rule">Rule</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">User</TableHead>
                <TableHead className="w-32">Action</TableHead>
                <TableHead>Object</TableHead>
                <TableHead className="w-32">Type</TableHead>
                <TableHead className="w-48">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log, i) => {
                const ObjectIcon = getObjectIcon(log.objectType);
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ObjectIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{log.object}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.objectType}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.timestamp}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
