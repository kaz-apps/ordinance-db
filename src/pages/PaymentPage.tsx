import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const PaymentPage = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    setProcessingPayment(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("ログインが必要です");
      }

      // Update or create subscription record
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (existingSubscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'premium',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('id', existingSubscription.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert([
            {
              user_id: session.user.id,
              plan: 'premium',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]);

        if (error) throw error;
      }

      // Invalidate queries to refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['subscription'] });

      toast({
        title: "決済完了",
        description: "プレミアムプランへの登録が完了しました",
      });
      navigate("/mypage");
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "エラーが発生しました",
        description: error.message || "決済処理に失敗しました",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">プレミアムプラン登録</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>お支払い情報</CardTitle>
            <CardDescription>安全な決済処理を行います</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">カード番号</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                disabled={processingPayment}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">有効期限</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  disabled={processingPayment}
                />
              </div>
              <div>
                <Label htmlFor="cvc">セキュリティコード</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  disabled={processingPayment}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span>プレミアムプラン（月額）</span>
              <span className="font-semibold">¥15,000</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ※これはテスト用の決済画面です。実際の決済は行われません。
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/mypage")}
            disabled={processingPayment}
          >
            キャンセル
          </Button>
          <Button
            className="flex-1"
            onClick={handlePayment}
            disabled={processingPayment}
          >
            {processingPayment ? "処理中..." : "支払う"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;