import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Box, Layers, Settings, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Layers,
    title: "Form-Driven Design",
    description: "Build complex asset forms with our intuitive drag-and-drop builder. No coding required.",
  },
  {
    icon: Box,
    title: "Asset Hierarchy",
    description: "Organize assets from Enterprise to Sensor level with full tree-view navigation.",
  },
  {
    icon: Settings,
    title: "Studio Experience",
    description: "Configure entities, forms, fields, rules, and permissions in one powerful interface.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permissions control who can see, edit, or manage each field and asset.",
  },
  {
    icon: Zap,
    title: "Dynamic Rules",
    description: "Create conditional logic that shows, hides, or validates fields in real-time.",
  },
  {
    icon: BarChart3,
    title: "Audit & Versioning",
    description: "Full traceability with version control, rollback, and detailed activity logs.",
  },
];

const Landing = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">AssetFlow</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Button
              variant="ghost"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setAuthOpen(true)}
            >
              Sign in
            </Button>
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
              onClick={() => setAuthOpen(true)}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
              <Zap className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">
                Enterprise-Grade Asset Management
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Build. Configure.
              <br />
              <span className="bg-gradient-to-r from-teal-soft to-primary-foreground bg-clip-text text-transparent">
                Manage Assets.
              </span>
            </h1>

            <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10">
              A low-code platform that empowers business users to create, configure, and manage
              assets using an intuitive form-builder experience. No deployments, no complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-14 px-8 text-lg shadow-glow-lg"
                onClick={() => setAuthOpen(true)}
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass-card rounded-2xl p-4 shadow-2xl max-w-5xl mx-auto">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                  <span className="ml-4 text-xs text-muted-foreground">AssetFlow Dashboard</span>
                </div>
                <div className="p-6 bg-gradient-to-br from-background to-muted/50 min-h-[300px] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                    {[
                      { label: "Total Assets", value: "2,847" },
                      { label: "Asset Types", value: "12" },
                      { label: "Active Users", value: "156" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="stat-card bg-card shadow-card"
                      >
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage assets
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for designers and business users, with separate experiences for
              configuration and runtime operation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to transform your asset management?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of organizations using AssetFlow to streamline operations.
            </p>
            <Button
              size="lg"
              className="h-14 px-8 text-lg shadow-glow"
              onClick={() => setAuthOpen(true)}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Landing;
