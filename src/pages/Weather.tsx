
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Cloud, Droplets, Wind, Thermometer, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_KEY = "72cb03ddb9cc38658bd51e4b865978ff";

  const fetchWeatherData = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to get weather data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Location not found. Please try another location.");
      }

      const data = await response.json();
      setWeatherData(data);
      localStorage.setItem("lastLocation", location);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lastLocation = localStorage.getItem("lastLocation");
    if (lastLocation) {
      setLocation(lastLocation);
      // Optionally auto-fetch for returning users
      // if (lastLocation) {
      //   fetchWeatherData();
      // }
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeatherData();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-white to-blue-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tighter mb-2 sm:text-4xl md:text-5xl">Weather Insights</h1>
            <p className="text-gray-500 md:text-xl">Get real-time weather updates for your farming decisions</p>
          </motion.div>

          <div className="w-full max-w-md mb-8">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter location (city, country)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={fetchWeatherData} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>

          {weatherData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="bg-primary text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">{weatherData.name}, {weatherData.sys.country}</CardTitle>
                      <CardDescription className="text-white/90 text-lg capitalize">
                        {weatherData.weather[0].description}
                      </CardDescription>
                    </div>
                    <div className="text-4xl font-bold">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <Thermometer className="h-8 w-8 text-primary mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Feels Like</p>
                        <p className="text-xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <Droplets className="h-8 w-8 text-primary mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Humidity</p>
                        <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <Wind className="h-8 w-8 text-primary mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Wind Speed</p>
                        <p className="text-xl font-semibold">{weatherData.wind.speed} m/s</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <h3 className="font-semibold flex items-center text-yellow-800">
                      <Cloud className="h-5 w-5 mr-2" />
                      Farming Weather Advisory
                    </h3>
                    <p className="text-gray-700 mt-2">
                      {weatherData.main.temp > 30
                        ? "High temperatures may affect crop growth. Consider additional irrigation and shade for sensitive crops."
                        : weatherData.main.temp < 10
                        ? "Low temperatures may affect frost-sensitive crops. Consider protective measures for overnight frost."
                        : "Current weather conditions are favorable for most farming activities."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
