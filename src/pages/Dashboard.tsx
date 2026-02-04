import { motion } from "framer-motion";
import {
  Box,
  Layers,
  FileEdit,
  CheckCircle,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Total Assets",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Box,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Asset Types",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Layers,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    label: "Draft Forms",
    value: "5",
    change: "In progress",
    trend: "neutral",
    icon: FileEdit,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    label: "Published Forms",
    value: "24",
    change: "+3 this week",
    trend: "up",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const recentActivity = [
  {
    action: "Asset created",
    description: "Motor #M-2847 added to Production Line A",
    time: "2 minutes ago",
    icon: Box,
  },
  {
    action: "Form published",
    description: "Gearbox Inspection Form v2.3",
    time: "15 minutes ago",
    icon: CheckCircle,
  },
  {
    action: "Asset updated",
    description: "Pump #P-1234 status changed to Maintenance",
    time: "1 hour ago",
    icon: Activity,
  },
  {
    action: "Rule added",
    description: "Critical asset validation rule enabled",
    time: "3 hours ago",
    icon: TrendingUp,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your asset management platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/studio/forms")}>
            Open Studio
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button onClick={() => navigate("/assets")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Asset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="stat-card border-0 shadow-card hover:shadow-card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      {stat.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-success" />
                      )}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <activity.icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-12 gap-3"
                onClick={() => navigate("/assets")}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                Create New Asset
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-12 gap-3"
                onClick={() => navigate("/studio/forms")}
              >
                <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                  <FileEdit className="w-4 h-4 text-info" />
                </div>
                Open Form Builder
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-12 gap-3"
                onClick={() => navigate("/studio/entities")}
              >
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-warning" />
                </div>
                Manage Asset Types
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-12 gap-3"
                onClick={() => navigate("/audit")}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                View Audit Log
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
