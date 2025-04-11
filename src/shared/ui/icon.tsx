import { type VariantProps, cva } from "class-variance-authority";
import type { LucideProps } from "lucide-react";
import type React from "react";
import { cn } from "./cn";

const iconVariants = cva("", {
    variants: {
        size: {
            sm: "w-4.5 h-4.5",
            // md: "w-5 h-5",
            // lg: "w-6 h-6",
        },
        variant: {
            inherit: "text-inherit",
            // default: "text-neutral-100",
            // muted: "text-neutral-500",
        },
    },
    defaultVariants: {
        size: "sm",
        variant: "inherit",
    },
});

export type IconProps = React.SVGAttributes<SVGSVGElement> &
    LucideProps &
    VariantProps<typeof iconVariants> & {
        component: React.ComponentType<LucideProps>;
    };

export const Icon = ({
    component: Component,
    // size,
    // variant,
    // className,
    ...rest
}: IconProps) => {
    return (
        <Component
            className={cn(
                iconVariants({
                    /* size, variant */
                }),
                // className,
            )}
            {...rest}
        />
    );
};
