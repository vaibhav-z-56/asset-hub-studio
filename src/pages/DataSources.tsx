import { motion } from "framer-motion";
import { Database, Plus, Link2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dataSources = [
  {
    id: "1",
    name: "Production Database",
    type: "PostgreSQL",
    status: "Connected",
    lastSync: "2 minutes ago",
  },
  {
    id: "2",
    name: "ERP System",
    type: "SAP API",
    status: "Connected",
    lastSync: "15 minutes ago",
  },
  {
    id: "3",
    name: "CMMS Integration",
    type: "REST API",
    status: "Error",
    lastSync: "Failed",
  },
  {
    id: "4",
    name: "IoT Sensor Hub",
    type: "MQTT",
    status: "Connected",
    lastSync: "Real-time",
  },
];

const DataSources = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Sources</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage external data sources
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      {/* Data Sources Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {dataSources.map((source, i) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{source.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      source.status === "Connected"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    <span className="flex items-center gap-1">
                      {source.status === "Connected" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {source.status}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last sync: {source.lastSync}
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State for adding more */}
      <Card className="shadow-card border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <h3 className="font-medium text-foreground mb-2">Add more data sources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect to databases, APIs, or streaming platforms
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSources;
