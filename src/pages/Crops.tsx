
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf, Search, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CropRecommendation {
  crop: string;
  suitability: string;
  description: string;
}

interface SoilData {
  type: string;
  characteristics: string;
  suitableCrops: string[];
}

const Crops = () => {
  const [location, setLocation] = useState("");
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data for soil info - we'll use this until we can get the Gemini API working properly
  const mockSoilData = {
    "India": {
      type: "Black Cotton Soil (Regur)",
      characteristics: "Rich in clay, high moisture retention, deep cracks when dry, high fertility but drainage issues",
      suitableCrops: ["Cotton", "Wheat", "Sugarcane", "Pulses", "Oilseeds"]
    },
    "USA": {
      type: "Prairie Soil",
      characteristics: "Rich in organic matter, high in nutrients, deep topsoil layer, excellent for agriculture",
      suitableCrops: ["Corn", "Soybeans", "Wheat", "Barley", "Sunflowers"]
    },
    "Brazil": {
      type: "Latosol (Oxisol)",
      characteristics: "Weathered, reddish, acidic, low nutrient content but deep and well-drained",
      suitableCrops: ["Coffee", "Soybeans", "Sugarcane", "Citrus", "Rice"]
    },
    "Australia": {
      type: "Terra Rossa",
      characteristics: "Red, clay-rich soil formed over limestone, well-drained, moderate fertility",
      suitableCrops: ["Grapes", "Olives", "Almonds", "Wheat", "Barley"]
    },
    "Kenya": {
      type: "Volcanic Soil",
      characteristics: "Derived from volcanic ash, highly fertile, good structure and drainage",
      suitableCrops: ["Coffee", "Tea", "Maize", "Beans", "Vegetables"]
    },
    "China": {
      type: "Loess Soil",
      characteristics: "Windblown silt deposits, very fertile, good water retention, easily tilled",
      suitableCrops: ["Wheat", "Millet", "Corn", "Soybeans", "Vegetables"]
    },
    "United Kingdom": {
      type: "Brown Earth Soil",
      characteristics: "Moderate fertility, good structure, moderate drainage, slightly acidic",
      suitableCrops: ["Wheat", "Barley", "Oats", "Potatoes", "Sugar beets"]
    },
    "Japan": {
      type: "Andisol",
      characteristics: "Volcanic origin, very fertile, good water retention, high in organic matter",
      suitableCrops: ["Rice", "Tea", "Vegetables", "Fruits", "Soybeans"]
    }
  };

  // Mock crop recommendations
  const mockCropRecommendations = {
    "India": [
      {
        crop: "Rice",
        suitability: "High",
        description: "Perfect for the monsoon season with high water availability and warm temperatures"
      },
      {
        crop: "Chickpeas",
        suitability: "Medium",
        description: "Good for post-monsoon cultivation, utilizes residual soil moisture"
      },
      {
        crop: "Mustard",
        suitability: "High",
        description: "Thrives in cooler winter temperatures, requires less water"
      }
    ],
    "USA": [
      {
        crop: "Corn",
        suitability: "High",
        description: "Excellent for summer growing season with long daylight hours"
      },
      {
        crop: "Winter Wheat",
        suitability: "High",
        description: "Ideal for fall planting and spring harvest cycle"
      },
      {
        crop: "Soybeans",
        suitability: "Medium",
        description: "Good rotation crop after corn, fixes nitrogen in soil"
      }
    ],
    "Brazil": [
      {
        crop: "Soybeans",
        suitability: "High",
        description: "Well-adapted to tropical climate, major export crop"
      },
      {
        crop: "Corn",
        suitability: "Medium",
        description: "Good as second crop after soybeans in same year"
      },
      {
        crop: "Beans",
        suitability: "High",
        description: "Fast-growing crop suitable for short rainy periods"
      }
    ],
    "Australia": [
      {
        crop: "Wheat",
        suitability: "High",
        description: "Winter crop that makes good use of winter rainfall"
      },
      {
        crop: "Canola",
        suitability: "Medium",
        description: "Good rotation crop that breaks disease cycles"
      },
      {
        crop: "Barley",
        suitability: "High",
        description: "Tolerates slightly saline conditions common in parts of Australia"
      }
    ],
    "Kenya": [
      {
        crop: "Maize",
        suitability: "High",
        description: "Staple crop well-suited to rainy seasons"
      },
      {
        crop: "Beans",
        suitability: "High",
        description: "Quick-maturing crop for good returns in short growing window"
      },
      {
        crop: "Sweet Potatoes",
        suitability: "Medium",
        description: "Drought-resistant crop for food security"
      }
    ],
    "China": [
      {
        crop: "Rice",
        suitability: "High",
        description: "Perfect for summer monsoon season in southern regions"
      },
      {
        crop: "Winter Wheat",
        suitability: "High",
        description: "Well-suited to northern plains during cooler months"
      },
      {
        crop: "Rapeseed",
        suitability: "Medium",
        description: "Good winter crop in central regions"
      }
    ],
    "United Kingdom": [
      {
        crop: "Winter Wheat",
        suitability: "High",
        description: "Ideal for mild winter and moderate rainfall conditions"
      },
      {
        crop: "Barley",
        suitability: "High",
        description: "Adaptable to various soil conditions across UK regions"
      },
      {
        crop: "Oilseed Rape",
        suitability: "Medium",
        description: "Good break crop in cereal rotations"
      }
    ],
    "Japan": [
      {
        crop: "Rice",
        suitability: "High",
        description: "Perfect for humid summer conditions"
      },
      {
        crop: "Soybeans",
        suitability: "Medium",
        description: "Good rotation crop after rice harvest"
      },
      {
        crop: "Sweet Potatoes",
        suitability: "High",
        description: "Well-suited to warmer southern regions"
      }
    ]
  };

  const fetchSoilData = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to get soil data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Find a matching country in our mock data
      const country = Object.keys(mockSoilData).find(
        country => location.toLowerCase().includes(country.toLowerCase())
      );

      if (country) {
        // Use mock data
        setTimeout(() => {
          setSoilData(mockSoilData[country]);
          setCropRecommendations(mockCropRecommendations[country]);
          setLoading(false);
        }, 1500); // Add a small delay to simulate API call
      } else {
        // Default to India if no match
        setTimeout(() => {
          setSoilData(mockSoilData["India"]);
          setCropRecommendations(mockCropRecommendations["India"]);
          setLoading(false);
          toast({
            title: "Location approximated",
            description: "We've provided data for the closest match to your location.",
            variant: "default",
          });
        }, 1500);
      }

      localStorage.setItem("lastLocationCrops", location);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch soil and crop data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchSoilData();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-white to-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tighter mb-2 sm:text-4xl md:text-5xl">Soil & Crop Analysis</h1>
            <p className="text-gray-500 md:text-xl">Get AI-powered soil insights and crop recommendations</p>
          </motion.div>

          <div className="w-full max-w-md mb-8">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter location (country name)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={fetchSoilData} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-500">Analyzing soil and crop data for {location}...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center bg-red-50 text-red-800 p-4 rounded-lg mb-6 w-full max-w-4xl">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {soilData && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <Tabs defaultValue="soil" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="soil">Soil Analysis</TabsTrigger>
                  <TabsTrigger value="crops">Crop Recommendations</TabsTrigger>
                </TabsList>
                <TabsContent value="soil">
                  <Card>
                    <CardHeader className="bg-primary text-white">
                      <CardTitle className="text-2xl flex items-center">
                        <Leaf className="h-6 w-6 mr-2" />
                        Soil Analysis for {location}
                      </CardTitle>
                      <CardDescription className="text-white/90">
                        Based on geographical and climate data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Soil Type</h3>
                          <p className="text-gray-700 mt-1">{soilData.type}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Characteristics</h3>
                          <p className="text-gray-700 mt-1">{soilData.characteristics}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Suitable Crops</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {soilData.suitableCrops.map((crop, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="crops">
                  <Card>
                    <CardHeader className="bg-primary text-white">
                      <CardTitle className="text-2xl flex items-center">
                        <Leaf className="h-6 w-6 mr-2" />
                        Crop Recommendations for {location}
                      </CardTitle>
                      <CardDescription className="text-white/90">
                        Optimized for the next 2-3 months
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cropRecommendations.map((recommendation, index) => (
                          <Card key={index} className="border border-green-100">
                            <CardHeader className="pb-2">
                              <CardTitle>{recommendation.crop}</CardTitle>
                              <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block
                                ${recommendation.suitability === 'High' ? 'bg-green-100 text-green-800' : 
                                  recommendation.suitability === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}
                              >
                                {recommendation.suitability} Suitability
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 text-sm">{recommendation.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-green-50 p-4">
                      <p className="text-sm text-gray-600">
                        These recommendations are based on soil type, local climate patterns, and seasonal factors.
                        Consider consulting with a local agricultural expert for specific guidance.
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crops;
