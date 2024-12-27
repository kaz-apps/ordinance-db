import { dummyOrdinances } from '../data/dummyOrdinances';
import OrdinanceTable from '../components/OrdinanceTable';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">建築設計条例一覧</h1>
        <Button onClick={handleLogout} variant="outline">
          ログアウト
        </Button>
      </div>
      <OrdinanceTable ordinances={dummyOrdinances} />
    </div>
  );
};

export default Index;