
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdwmhzfznuyrpmabudj.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // This should be replaced with your public anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User types
export type UserRole = 'farmer' | 'vendor';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  location?: string;
  created_at: string;
}

// Weather history
export interface WeatherHistory {
  id: string;
  user_id: string;
  location: string;
  temperature: number;
  humidity: number;
  description: string;
  created_at: string;
}

// Market prices
export interface MarketPrice {
  id: string;
  crop_name: string;
  price_per_kg: number;
  location: string;
  updated_by: string;
  updated_at: string;
}

// Soil data
export interface SoilData {
  id: string;
  location: string;
  soil_type: string;
  characteristics: string;
  suitable_crops: string[];
  created_at: string;
}

// Database functions
export const saveWeatherHistory = async (userId: string, weatherData: any) => {
  const { data, error } = await supabase
    .from('weather_history')
    .insert({
      user_id: userId,
      location: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
    });
  
  return { data, error };
};

export const saveSoilData = async (location: string, soilData: any) => {
  const { data, error } = await supabase
    .from('soil_data')
    .insert({
      location,
      soil_type: soilData.type,
      characteristics: soilData.characteristics,
      suitable_crops: soilData.suitableCrops,
    });
  
  return { data, error };
};

export const getMarketPrices = async (location: string) => {
  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .eq('location', location);
  
  return { data, error };
};

export const saveMarketPrice = async (marketPrice: Omit<MarketPrice, 'id' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('market_prices')
    .insert(marketPrice);
  
  return { data, error };
};
