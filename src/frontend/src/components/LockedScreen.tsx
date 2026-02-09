import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthButton from './AuthButton';

export default function LockedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md diary-page animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif">Unsaid Echoe</CardTitle>
            <CardDescription className="text-base">
              Your private thoughts, securely locked
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>This diary is protected and requires authentication.</p>
            <p>Sign in to access your personal entries.</p>
          </div>
          <AuthButton />
        </CardContent>
      </Card>
    </div>
  );
}
