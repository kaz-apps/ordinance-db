import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  created_at: string | null;
};

interface ProfileCardProps {
  profile: Profile | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Update profile name
      if (profile?.id) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", profile.id);

        if (profileError) throw profileError;
      }

      // Update email if provided
      if (email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email,
        });
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        });
        if (passwordError) throw passwordError;
      }

      toast({
        title: "プロフィールを更新しました",
        description: "変更が保存されました",
      });
      setIsEditing(false);
      setPassword(""); // Clear password field after save
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>マイページ</CardTitle>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">名前</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="新しいメールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="新しいパスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave}>保存</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile.full_name || "");
                      setEmail("");
                      setPassword("");
                    }}
                  >
                    キャンセル
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium">名前</h3>
                  <p>{profile.full_name || "未設定"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">ユーザー名</h3>
                  <p>{profile.username || "未設定"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">登録日</h3>
                  <p>
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString("ja-JP")
                      : "不明"}
                  </p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-4">
                  編集
                </Button>
              </>
            )}
          </div>
        ) : (
          <p>プロフィール情報が見つかりません</p>
        )}
      </CardContent>
    </Card>
  );
};