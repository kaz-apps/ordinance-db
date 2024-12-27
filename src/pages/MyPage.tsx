import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { PaymentModal } from "@/components/payment/PaymentModal";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

type Profile = {
  id: string;
  username: string | null;
  created_at: string | null;
};

type Subscription = {
  id: string;
  plan: SubscriptionPlan;
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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
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

  const handlePlanChange = async (newPlan: SubscriptionPlan) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!subscription) {
        const { data, error } = await supabase
          .from("subscriptions")
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
        const { data, error } = await supabase
          .from("subscriptions")
          .update({ 
            plan: newPlan,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq("id", subscription.id)
          .select()
          .single();

        if (error) throw error;
        setSubscription(data);
      }

      toast({
        title: "プラン変更完了",
        description: `${newPlan === "premium" ? "プレミアム" : "無料"}プランに変更されました`,
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await handlePlanChange("premium");
      setShowPaymentModal(false);
      toast({
        title: "決済完了",
        description: "プレミアムプランへの登録が完了しました",
      });
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
      <ProfileCard profile={profile} />
      <SubscriptionCard
        subscription={subscription}
        onPlanChange={handlePlanChange}
        onShowPaymentModal={() => setShowPaymentModal(true)}
      />
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onPayment={handleMockPayment}
        processingPayment={processingPayment}
      />
    </div>
  );
};

export default MyPage;