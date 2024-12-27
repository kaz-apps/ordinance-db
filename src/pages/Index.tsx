import { dummyOrdinances } from '../data/dummyOrdinances';
import OrdinanceTable from '../components/OrdinanceTable';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          variant: "destructive",
          title: "ログアウトエラー",
          description: "ログアウトに失敗しました。再度お試しください。",
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation to login page even if there's an error
      navigate('/login');
    }
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