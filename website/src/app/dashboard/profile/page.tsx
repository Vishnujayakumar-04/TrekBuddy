'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Settings as SettingsIcon, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    const handleUpdateProfile = () => {
        // Implement update profile logic with Firebase
        toast.success('Profile updated successfully');
    };

    if (!user) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                <p className="mb-4 text-muted-foreground">You need to be logged in to view your profile.</p>
                <Button asChild><Link href="/login">Login</Link></Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <DashboardHeader
                title="My Profile"
                subtitle="Manage your personal information and preferences"
                backHref="/"
                backLabel="Home"
                showHome={false}
            />
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card>
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="relative inline-block">
                                <Avatar className="w-24 h-24 mx-auto">
                                    <AvatarImage src={user.photoURL || ''} />
                                    <AvatarFallback className="text-2xl">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background">
                                    <SettingsIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{user.displayName}</h2>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Button variant="outline" className="w-full" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" /> Log Out
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Language</span>
                                <span className="font-medium">English</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Theme</span>
                                <span className="font-medium">System</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <Tabs defaultValue="saved" className="w-full">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="saved" className="gap-2"><Heart className="w-4 h-4" /> Saved Places</TabsTrigger>
                            <TabsTrigger value="trips" className="gap-2"><MapPin className="w-4 h-4" /> My Trips</TabsTrigger>
                            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Edit Profile</TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Saved Places</CardTitle>
                                    <CardDescription>Destinations you&apos;ve bookmarked for later.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-10 text-muted-foreground">
                                        <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>You haven&apos;t saved any places yet.</p>
                                        <Button variant="link" asChild><Link href="/dashboard/categories">Explore Places</Link></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="trips" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Trips</CardTitle>
                                    <CardDescription>Your planned itineraries.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-10 text-muted-foreground">
                                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No upcoming trips.</p>
                                        <Button variant="link" asChild><Link href="/dashboard/planner">Plan a Trip</Link></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="profile" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" value={user.email || ''} disabled />
                                    </div>
                                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
