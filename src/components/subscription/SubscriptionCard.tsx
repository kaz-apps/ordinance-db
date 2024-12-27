import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type SubscriptionPlan = Database["public"]["Enums"]["subscription_plan"];

type Subscription = {
  id: string;
  plan: SubscriptionPlan;
  current_period_start: string | null;
  current_period_end: string | null;
};

type SubscriptionCardProps = {
  subscription: Subscription | null;
  onPlanChange: (plan: SubscriptionPlan) => void;
};

export const SubscriptionCard = ({
  subscription,
  onPlanChange,
}: SubscriptionCardProps) => {
  const navigate = useNavigate();
  const currentPlan = subscription?.plan || "free";

  const handleUpgrade = () => {
    navigate("/payment");
  };

  const handleDowngrade = () => {
    onPlanChange("free");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>サブスクリプション</CardTitle>
        <CardDescription>
          現在のプラン：{currentPlan === "premium" ? "プレミアム" : "無料"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>無料プラン</CardTitle>
                <CardDescription>¥0/月</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>基本機能の利用</li>
                  <li>広告表示あり</li>
                </ul>
                {currentPlan === "premium" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDowngrade}
                  >
                    ダウングレード
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>プレミアムプラン</CardTitle>
                <CardDescription>¥15,000/月</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>全機能の利用</li>
                  <li>広告表示なし</li>
                  <li>優先サポート</li>
                </ul>
                {currentPlan === "free" && (
                  <Button className="w-full" onClick={handleUpgrade}>
                    アップグレード
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
          {subscription?.current_period_end && (
            <p className="text-sm text-muted-foreground">
              次回更新日：
              {new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};