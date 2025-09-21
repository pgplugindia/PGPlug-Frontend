import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, Users, Wifi, Droplets, Utensils, Dumbbell } from 'lucide-react';

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md',
            className
        )}
        {...props}
    />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

const PGCard = ({ pg, className, ...props }) => {
    const {
        _id,
        name,
        location,
        price,
        rating,
        images = [],
        amenities = [],
        roomType,
        gender,
        distance,
    } = pg;

    const defaultImage = '/placeholder-pg.jpg';
    const imageUrl = images[0]?.url || defaultImage;

    const renderAmenityIcon = (amenity) => {
        const icons = {
            wifi: <Wifi className="h-4 w-4" />,
            food: <Utensils className="h-4 w-4" />,
            ac: <Droplets className="h-4 w-4" />,
            gym: <Dumbbell className="h-4 w-4" />,
        };
        return icons[amenity] || null;
    };

    return (
        <Card className={cn('flex flex-col h-full', className)} {...props}>
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                </Button>
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                        <Link href={`/pg/${_id}`} className="hover:underline">
                            {name}
                        </Link>
                    </CardTitle>
                    <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                        <Star className="h-4 w-4 fill-primary mr-1" />
                        {rating || 'N/A'}
                    </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {location?.address || 'Location not specified'}
                    {distance && <span className="ml-2 text-xs">• {distance} km away</span>}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                    {amenities.slice(0, 4).map((amenity, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md"
                            title={amenity}
                        >
                            {renderAmenityIcon(amenity) || '•'}
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </span>
                    ))}
                    {amenities.length > 4 && (
                        <span className="text-xs text-muted-foreground self-center">
                            +{amenities.length - 4} more
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="mt-auto border-t pt-4">
                <div className="w-full flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold">₹{price?.toLocaleString('en-IN')}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                        <div className="text-xs text-muted-foreground">
                            {roomType} • {gender || 'Co-living'}
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/pg/${_id}`}>View Details</Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, PGCard };
