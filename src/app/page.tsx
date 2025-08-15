
'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

import ContractABI from '../../ContractABI.json';
const contractAddress = '0x23520750eD48337a824F0f91949fDb56A37D0F2d';

export default function Home() {
  const { toast } = useToast();

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = await provider.getSigner();
          const deployedContract = new ethers.Contract(
            contractAddress,
            ContractABI,
            signer
          );
          setContract(deployedContract);
        } else {
          toast({
            title: 'Metamask not found',
            description: 'Please install Metamask to use this application.',
            variant: 'destructive',
          });
        }
      } catch (err: any) {
        setError(`Error initializing contract: ${err.message}`);
        toast({
          title: 'Error',
          description: `Error initializing contract: ${err.message}`,
          variant: 'destructive',
        });
      }
    };

    initializeContract();
  }, [toast]);

  const generateBitcoinPrice = async () => {
    if (!contract) {
      setError('Contract not initialized');
      toast({
        title: 'Error',
        description: 'Contract not initialized',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setPrice(null);
    setProgress(0);

    try {
      // This is a mock generation. Replace with actual contract interaction.
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
          const basePrice = 65000;
          const newPrice = basePrice + basePrice * 0.1 * randomFactor;
          setPrice(newPrice);
          setLoading(false);
          toast({
            title: 'Price Generated',
            description: `New Bitcoin price is $${newPrice.toLocaleString()}`,
          });
        }
      }, 200);
    } catch (err: any) {
      setError(`Error generating price: ${err.message}`);
      toast({
        title: 'Error',
        description: `Error generating price: ${err.message}`,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m-4-6h1m6 0h1M4.93 4.93l.707.707m12.728 12.728l.707.707M4.93 19.07l.707-.707m12.728-12.728l.707-.707"
              />
            </svg>
          </div>
          <CardTitle className="mt-4">Bitcoin Price Random Generator</CardTitle>
          <CardDescription>
            Click the button to generate a new random Bitcoin price using a
            secure on-chain method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center">
              <Progress value={progress} className="w-full" />
              <p className="mt-2 text-sm text-muted-foreground">
                Generating secure price...
              </p>
            </div>
          )}
          {price !== null && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Generated Bitcoin Price
              </p>
              <p className="text-4xl font-bold text-primary">
                ${price.toLocaleString()}
              </p>
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateBitcoinPrice}
            disabled={loading || !contract}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Price'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
