import { EvolveApp } from '@/components/evolve-app-safe';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <EvolveApp />
    </Suspense>
  );
}
