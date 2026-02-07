'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Laptop } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    const handleSave = () => {
        toast.success('Settings saved successfully');
    };

    return (
        <div className="container py-8 max-w-2xl space-y-8">
            <DashboardHeader
                title="Settings"
                subtitle="Manage your application preferences"
                backHref="/"
                backLabel="Home"
                showHome={false}
            />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <div className="flex gap-4">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="w-1/3 flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-6 w-6" />
                                    <span>Light</span>
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="w-1/3 flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-6 w-6" />
                                    <span>Dark</span>
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    className="w-1/3 flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme('system')}
                                >
                                    <Laptop className="h-6 w-6" />
                                    <span>System</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Language</CardTitle>
                        <CardDescription>Select your preferred language.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">Display Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger id="language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">French (Français)</SelectItem>
                                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} size="lg">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
