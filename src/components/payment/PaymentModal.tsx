import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: () => void;
  processingPayment: boolean;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  onPayment,
  processingPayment,
}: PaymentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Input id="card-number" placeholder="4242 4242 4242 4242" className="font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">有効期限</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">セキュリティコード</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
          <Button onClick={onPayment} disabled={processingPayment}>
            {processingPayment ? "処理中..." : "¥15,000/月で登録する"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};