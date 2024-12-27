import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = {
  id: string;
  username: string | null;
  created_at: string | null;
};

type Subscription = {
  id: string;
  plan: 'free' | 'premium';
  current_period_start: string | null;
  current_period_end: string | null;
};

const MyPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileAndSubscription();
  }, []);

  const fetchProfileAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;
      setSubscription(subscriptionData);

    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "データの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (newPlan: 'free' | 'premium') => {
    if (newPlan === 'premium') {
      setShowPaymentModal(true);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!subscription) {
        // Create new subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .insert([
            { 
              user_id: user.id,
              plan: newPlan,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;
        setSubscription(data);
      } else {
        // Update existing subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .update({ 
            plan: newPlan,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', subscription.id)
          .select()
          .single();

        if (error) throw error;
        setSubscription(data);
      }

      toast({
        title: "プラン変更完了",
        description: `${newPlan === 'premium' ? 'プレミアム' : '無料'}プランに変更されました`,
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "プラン変更に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleMockPayment = async () => {
    setProcessingPayment(true);
    // 決済処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!subscription) {
        // Create new subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .insert([
            { 
              user_id: user.id,
              plan: 'premium',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;
        setSubscription(data);
      } else {
        // Update existing subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .update({ 
            plan: 'premium',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', subscription.id)
          .select()
          .single();

        if (error) throw error;
        setSubscription(data);
      }

      toast({
        title: "決済完了",
        description: "プレミアムプランへの登録が完了しました",
      });
      setShowPaymentModal(false);
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "決済処理に失敗しました",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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

      <Card>
        <CardHeader>
          <CardTitle>サブスクリプション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium">現在のプラン</h3>
              <p className="mt-1">{subscription?.plan === 'premium' ? 'プレミアムプラン' : '無料プラン'}</p>
            </div>
            {subscription?.current_period_end && (
              <div>
                <h3 className="text-sm font-medium">次回更新日</h3>
                <p className="mt-1">{new Date(subscription.current_period_end).toLocaleDateString('ja-JP')}</p>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                variant={subscription?.plan === 'free' ? 'secondary' : 'outline'}
                onClick={() => handlePlanChange('free')}
                disabled={subscription?.plan === 'free'}
              >
                無料プラン
              </Button>
              <Button
                variant={subscription?.plan === 'premium' ? 'secondary' : 'default'}
                onClick={() => handlePlanChange('premium')}
                disabled={subscription?.plan === 'premium'}
              >
                プレミアムプラン（¥15,000/月）
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>プレミアムプランへのアップグレード</DialogTitle>
            <DialogDescription>
              クレジットカード情報を入力して、プレミアムプランにアップグレードしてください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">カード番号</Label>
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">有効期限</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">セキュリティコード</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                />
              </div>
            </div>
            <Button
              onClick={handleMockPayment}
              disabled={processingPayment}
            >
              {processingPayment ? "処理中..." : "¥15,000/月で登録する"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPage;