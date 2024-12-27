import { dummyOrdinances } from '../data/dummyOrdinances';
import OrdinanceTable from '../components/OrdinanceTable';

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">建築設計条例一覧</h1>
      <OrdinanceTable ordinances={dummyOrdinances} />
    </div>
  );
};

export default Index;