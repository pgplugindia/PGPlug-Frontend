import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Blog', href: '/blog' },
                { name: 'Press', href: '/press' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Safety Information', href: '/safety' },
                { name: 'Cancellation Options', href: '/cancellation' },
                { name: 'Report an Issue', href: '/report' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Sitemap', href: '/sitemap' },
            ],
        },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/pgplug' },
        { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/pgplug' },
        { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/pgplug' },
    ];

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            PGPlug
                        </h3>
                        <p className="text-muted-foreground">
                            Find your perfect PG accommodation with ease. We connect students and professionals with the best paying guest options across India.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <Button key={social.name} variant="ghost" size="icon" asChild>
                                    <Link href={social.href} target="_blank" rel="noopener noreferrer">
                                        <social.icon className="h-5 w-5" />
                                        <span className="sr-only">{social.name}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                                {section.title}
                            </h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground text-sm">
                                    123 PG Street, Bangalore
                                    <br />
                                    Karnataka, India - 560001
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                                <a
                                    href="mailto:hello@pgplug.com"
                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                >
                                    hello@pgplug.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                                <a
                                    href="tel:+919876543210"
                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                >
                                    +91 98765 43210
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        &copy; {currentYear} PGPlug. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
