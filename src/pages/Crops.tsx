
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf, Search, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const API_KEY = "AIzaSyAYktI0MriKwCDVU2bMwWhzEb9ARzlU6XM";
  const genAI = new GoogleGenerativeAI(API_KEY);

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

      // Using Gemini API to get soil data based on location
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const soilPrompt = `
        Analyze the soil type commonly found in ${location}.
        Return the information in the following JSON format:
        {
          "type": "Soil type name",
          "characteristics": "Brief description of the soil characteristics",
          "suitableCrops": ["crop1", "crop2", "crop3", "crop4", "crop5"]
        }
        Only return valid JSON, nothing else.
      `;
      
      const soilResult = await model.generateContent(soilPrompt);
      const soilResponse = soilResult.response;
      const soilText = soilResponse.text();
      
      // Extract JSON from the response
      const jsonMatch = soilText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const soilJSON = JSON.parse(jsonMatch[0]);
        setSoilData(soilJSON);
      } else {
        throw new Error("Failed to parse soil data");
      }

      // Now get crop recommendations
      const cropPrompt = `
        Based on the soil type and climate in ${location}, recommend 3 crops that would grow well in the next 2-3 months.
        For each crop, provide:
        1. Name of the crop
        2. Suitability score (High, Medium, Low)
        3. Brief description on why it's suitable
        
        Return the information in the following JSON format:
        [
          {
            "crop": "Crop Name",
            "suitability": "High/Medium/Low",
            "description": "Brief explanation of why this crop is suitable"
          }
        ]
        Only return valid JSON, nothing else.
      `;
      
      const cropResult = await model.generateContent(cropPrompt);
      const cropResponse = cropResult.response;
      const cropText = cropResponse.text();
      
      // Extract JSON from the response
      const cropJsonMatch = cropText.match(/\[[\s\S]*\]/);
      if (cropJsonMatch) {
        const cropJSON = JSON.parse(cropJsonMatch[0]);
        setCropRecommendations(cropJSON);
      } else {
        throw new Error("Failed to parse crop recommendations");
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
    } finally {
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
                placeholder="Enter location (region, country)"
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
