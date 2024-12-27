import { dummyOrdinances } from '../data/dummyOrdinances';
import OrdinanceTable from '../components/OrdinanceTable';
import { useSession } from '@supabase/auth-helpers-react';

const Index = () => {
  const session = useSession();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">建築設計条例一覧</h1>
      </div>
      <OrdinanceTable ordinances={dummyOrdinances} />
    </div>
  );
};

export default Index;