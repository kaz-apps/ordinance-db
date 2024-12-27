import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

type Subscription = {
  id: string;
  plan: SubscriptionPlan;
  current_period_start: string | null;
  current_period_end: string | null;
};

interface SubscriptionCardProps {
  subscription: Subscription | null;
  onPlanChange: (plan: SubscriptionPlan) => void;
  onShowPaymentModal: () => void;
}

export const SubscriptionCard = ({
  subscription,
  onPlanChange,
  onShowPaymentModal,
}: SubscriptionCardProps) => {
  const handlePlanChange = (newPlan: SubscriptionPlan) => {
    if (newPlan === "premium") {
      onShowPaymentModal();
      return;
    }
    onPlanChange(newPlan);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>サブスクリプション</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium">現在のプラン</h3>
            <p className="mt-1">{subscription?.plan === "premium" ? "プレミアムプラン" : "無料プラン"}</p>
          </div>
          {subscription?.current_period_end && (
            <div>
              <h3 className="text-sm font-medium">次回更新日</h3>
              <p className="mt-1">{new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}</p>
            </div>
          )}
          <div className="flex gap-4">
            <Button
              variant={subscription?.plan === "free" ? "secondary" : "outline"}
              onClick={() => handlePlanChange("free")}
              disabled={subscription?.plan === "free"}
            >
              無料プラン
            </Button>
            <Button
              variant={subscription?.plan === "premium" ? "secondary" : "default"}
              onClick={() => handlePlanChange("premium")}
              disabled={subscription?.plan === "premium"}
            >
              プレミアムプラン（¥15,000/月）
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};