import { dummyOrdinances } from '../data/dummyOrdinances';
import OrdinanceTable from '../components/OrdinanceTable';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useSession } from '@supabase/auth-helpers-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message !== "Session not found") {
          console.error('Logout error:', error);
          toast({
            variant: "destructive",
            title: "ログアウトエラー",
            description: "ログアウトに失敗しました。再度お試しください。",
          });
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">建築設計条例一覧</h1>
        {session ? (
          <Button onClick={handleLogout} variant="outline">
            ログアウト
          </Button>
        ) : (
          <Button onClick={() => navigate('/login')} variant="outline">
            ログイン
          </Button>
        )}
      </div>
      <OrdinanceTable ordinances={dummyOrdinances} />
    </div>
  );
};

export default Index;