import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type Profile = {
  id: string;
  username: string | null;
  created_at: string | null;
};

const MyPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "プロフィールの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>マイページ</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">ユーザー名</h3>
                <p>{profile.username || "未設定"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">登録日</h3>
                <p>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('ja-JP') : "不明"}</p>
              </div>
            </div>
          ) : (
            <p>プロフィール情報が見つかりません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPage;