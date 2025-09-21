import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, error, label, description, ...props }, ref) => {
    return (
        <div className="w-full space-y-1">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                    {props.required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-destructive focus-visible:ring-destructive/50',
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export { Input };
