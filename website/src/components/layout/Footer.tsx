import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary">TrekBuddy</h3>
                        <p className="text-sm text-muted-foreground">
                            Your ultimate guide to exploring the beautiful city of Puducherry.
                            Discover beaches, heritage, and culture.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/dashboard/categories" className="hover:text-primary">Categories</Link></li>
                            <li><Link href="/dashboard/planner" className="hover:text-primary">Trip Planner</Link></li>
                            <li><Link href="/dashboard/bus-routes" className="hover:text-primary">Bus Routes</Link></li>
                            <li><Link href="/dashboard/map" className="hover:text-primary">Map View</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            {/* Social icons would go here, using anchors for external links is fine but href should be valid or use button */}
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                Twitter
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                Instagram
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary">
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} TrekBuddy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
