
"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  Flame,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HardhatIcon } from "@/components/icons";

type PriceData = {
  name: string;
  price: number;
};

export default function Home() {
  const [prediction, setPrediction] = React.useState<number | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [chartData, setChartData] = React.useState<PriceData[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setPrediction(null);
    setTimeout(() => {
      const newPrediction = Math.floor(Math.random() * 100);
      setPrediction(newPrediction);
      setChartData([{ name: 'BTC', price: newPrediction }]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="flex items-center gap-3 mb-4">
            <HardhatIcon className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline">
                Hardhat Dev Kit
              </h1>
              <p className="text-sm text-muted-foreground">
                Bitcoin Price Random Generator
              </p>
            </div>
        </div>

      <Card className="w-full max-w-2xl transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Bitcoin Price Random Generator</CardTitle>
          <CardDescription className="text-center">
            Click the button to generate a new random value, simulating a price prediction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Bar dataKey="price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {prediction !== null && (
              <div className="text-center p-4 bg-muted/50 rounded-md w-full">
                <p className="text-sm text-muted-foreground">
                  Predicted Value
                </p>
                <p className="text-5xl font-bold font-code text-primary">
                  {prediction}
                </p>
              </div>
            )}
          
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            size="lg"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Flame className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
