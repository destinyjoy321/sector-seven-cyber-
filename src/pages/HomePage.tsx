import React from 'react';
import { Hero } from '../components/home/Hero';
import { InsuranceCrisis } from '../components/home/InsuranceCrisis';
import { Services } from '../components/home/Services';
import { Industries } from '../components/home/Industries';
import { HowItWorks } from '../components/home/HowItWorks';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <main className="min-h-screen">
      <Hero onNavigate={onNavigate} />
      <InsuranceCrisis onNavigate={onNavigate} />
      <Services onNavigate={onNavigate} />
      <Industries onNavigate={onNavigate} />
      <HowItWorks onNavigate={onNavigate} />
    </main>
  );
};

