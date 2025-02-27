
import { motion } from "framer-motion";
import { Cloud, Leaf, Sun, LineChart, Thermometer, Droplets, Wind, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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

const benefits = [
  {
    icon: Thermometer,
    title: "Support For Climate Changes",
    description: "Timely weather updates, seasonal forecasts, and warnings of critical situations like droughts or monsoons help farmers plan irrigation, planting, and harvesting activities precisely."
  },
  {
    icon: Leaf,
    title: "Crop Suggestions",
    description: "With information on soil health, regional weather patterns, and historical data, we provide custom solutions for optimal crop selection each season."
  },
  {
    icon: Droplets,
    title: "Guidance On Sustainability",
    description: "We encourage sustainable farming practices through efficient resource use, including proper water management and fertilization to increase soil health."
  },
  {
    icon: BarChart4,
    title: "Price Estimations & Predictions",
    description: "Our system analyzes market activities and previous pricing data to estimate crop prices, helping farmers determine the best time to sell."
  }
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

        {/* About Section */}
        <div className="container px-4 md:px-6 mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              Farmers with small and marginal landholdings are among the worst hit due to climate shifts, limited resources, and restricted adoption of modern technology. Erratic rainfall, soil erosion, and market uncertainty diminish both yield and returns.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              We developed CloudCrop AI to confront these issues with advanced technologies including machine learning, data analytics, and predictive modeling to provide actionable insights and recommendations.
            </p>
          </motion.div>
          
          {/* Benefits */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">How CloudCrop AI Helps</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="h-full border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full mr-4">
                          <benefit.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{benefit.title}</h3>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container px-4 md:px-6 mt-16 md:mt-24">
          <h2 className="text-2xl font-bold text-center mb-8">Our Key Features</h2>
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
        
        {/* Final CTA */}
        <div className="container px-4 md:px-6 mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="bg-primary text-white rounded-lg p-8 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to transform your farming?</h2>
            <p className="mb-6">Join thousands of farmers who are already benefiting from data-driven agriculture.</p>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
              Sign Up for Free
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
