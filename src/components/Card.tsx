import React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';
import { cn } from '../lib/utils'; // simplified cn with clsx only

// Card Container
const Card = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View
    ref={ref}
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm')}
    style={style}
    {...props}
  />
));
Card.displayName = 'Card';

// Card Header
const CardHeader = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-col space-y-1.5 p-6')} style={style} {...props} />
));
CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight')}
    style={style}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = React.forwardRef<Text, TextProps>(({ style, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-sm text-muted-foreground')}
    style={style}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} className={cn('p-6 pt-0')} style={style} {...props} />
));
CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} className={cn('flex items-center p-6 pt-0')} style={style} {...props} />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
