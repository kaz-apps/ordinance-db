import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const PaymentPage = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async () => {
    setProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      toast({
        title: "決済完了",
        description: "プレミアムプランへの登録が完了しました",
      });
      navigate("/mypage");
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

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">プレミアムプラン登録</h1>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">お支払い情報</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                カード番号
              </label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                disabled={processingPayment}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                  有効期限
                </label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  disabled={processingPayment}
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium mb-1">
                  セキュリティコード
                </label>
                <Input
                  id="cvc"
                  placeholder="123"
                  disabled={processingPayment}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>プレミアムプラン（月額）</span>
            <span className="font-semibold">¥15,000</span>
          </div>
          <p className="text-sm text-muted-foreground">
            ※これはテスト用の決済画面です。実際の決済は行われません。
          </p>
        </div>

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