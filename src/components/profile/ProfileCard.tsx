import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Profile = {
  id: string;
  username: string | null;
  created_at: string | null;
};

interface ProfileCardProps {
  profile: Profile | null;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
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
              <p>{profile.created_at ? new Date(profile.created_at).toLocaleDateString("ja-JP") : "不明"}</p>
            </div>
          </div>
        ) : (
          <p>プロフィール情報が見つかりません</p>
        )}
      </CardContent>
    </Card>
  );
};