import { motion } from "framer-motion";
import { Shield, Eye, Edit, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const roles = ["Admin", "Maintenance", "Viewer"];

const fields = [
  "Asset Name",
  "Asset ID",
  "Serial Number",
  "Location",
  "Status",
  "Criticality",
  "Manufacturer",
  "Installation Date",
  "Rated Power",
  "Operating Hours",
  "Maintenance Notes",
];

type Permission = "view" | "edit" | "none";

const defaultPermissions: Record<string, Record<string, Permission>> = {
  Admin: Object.fromEntries(fields.map((f) => [f, "edit"])),
  Maintenance: {
    "Asset Name": "view",
    "Asset ID": "view",
    "Serial Number": "edit",
    Location: "edit",
    Status: "edit",
    Criticality: "view",
    Manufacturer: "view",
    "Installation Date": "view",
    "Rated Power": "view",
    "Operating Hours": "edit",
    "Maintenance Notes": "edit",
  },
  Viewer: Object.fromEntries(fields.map((f) => [f, "view"])),
};

const PermissionsDesigner = () => {
  const [selectedRole, setSelectedRole] = useState("Maintenance");
  const [permissions, setPermissions] = useState(defaultPermissions);

  const cyclePermission = (field: string) => {
    const current = permissions[selectedRole][field];
    const next: Permission =
      current === "none" ? "view" : current === "view" ? "edit" : "none";

    setPermissions({
      ...permissions,
      [selectedRole]: {
        ...permissions[selectedRole],
        [field]: next,
      },
    });
  };

  const getPermissionIcon = (permission: Permission) => {
    switch (permission) {
      case "edit":
        return <Edit className="w-4 h-4" />;
      case "view":
        return <Eye className="w-4 h-4" />;
      case "none":
        return <X className="w-4 h-4" />;
    }
  };

  const getPermissionColor = (permission: Permission) => {
    switch (permission) {
      case "edit":
        return "bg-success/10 text-success border-success/30 hover:bg-success/20";
      case "view":
        return "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20";
      case "none":
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Permissions Designer</h1>
          <p className="text-muted-foreground mt-1">
            Control who can see and edit each field by role
          </p>
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Permissions Matrix */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Field Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex gap-6 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Edit className="w-4 h-4 text-success" />
              </div>
              <span>View & Edit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <span>View Only</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>No Access</span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left text-sm font-medium text-foreground p-4 w-1/3">
                    Field
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className={`text-center text-sm font-medium p-4 ${
                        role === selectedRole
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, i) => (
                  <motion.tr
                    key={field}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t"
                  >
                    <td className="p-4 font-medium text-sm">{field}</td>
                    {roles.map((role) => (
                      <td
                        key={role}
                        className={`p-4 text-center ${
                          role === selectedRole ? "bg-primary/5" : ""
                        }`}
                      >
                        <button
                          onClick={() =>
                            role === selectedRole && cyclePermission(field)
                          }
                          disabled={role !== selectedRole}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                            role === selectedRole
                              ? "cursor-pointer " +
                                getPermissionColor(permissions[role][field])
                              : "cursor-default " +
                                getPermissionColor(permissions[role][field])
                          }`}
                        >
                          {getPermissionIcon(permissions[role][field])}
                        </button>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Click on a cell in the selected role column to toggle permission level
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsDesigner;
