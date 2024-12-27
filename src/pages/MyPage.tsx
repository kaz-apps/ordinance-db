import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/navigation/MainNav";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchProfileAndSubscription();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
  };

  const fetchProfileAndSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;
      setSubscription(subscriptionData);

    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (newPlan: SubscriptionPlan) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      if (!subscription) {
        const { data, error } = await supabase
          .from("subscriptions")
          .insert([
            { 
              user_id: session.user.id,
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
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ProfileCard profile={profile} />
        <SubscriptionCard
          subscription={subscription}
          onPlanChange={handlePlanChange}
        />
      </div>
    </div>
  );
};

export default MyPage;