
import { motion } from "framer-motion";
import { Cloud, Leaf, Sun, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sun,
    title: "Weather Insights",
    description: "Get real-time weather updates and forecasts for precise planning",
    link: "/weather"
  },
  {
    icon: Leaf,
    title: "Smart Crop Recommendations",
    description: "AI-powered suggestions for optimal crop selection based on your conditions",
    link: "/crops"
  },
  {
    icon: Cloud,
    title: "Sustainability Guidance",
    description: "Expert advice on sustainable farming practices and resource management",
    link: "/sustainability"
  },
  {
    icon: LineChart,
    title: "Market Intelligence",
    description: "Stay informed with market trends and price predictions",
    link: "/market"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="pt-20 pb-8 md:pt-24 md:pb-12">
        {/* Hero Section */}
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to CloudCrop AI
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Empowering farmers with AI-driven insights for sustainable and profitable agriculture
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-x-4"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container px-4 md:px-6 mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => (
              <Link to={feature.link} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * (index + 3) }}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow h-full"
                >
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
