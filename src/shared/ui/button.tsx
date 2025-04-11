import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { cn } from "./cn";

const buttonVariants = cva(
    "flex items-center justify-center border-0 font-medium transition-[background,color,opacity] duration-100 cursor-pointer rounded-xl ring-offset-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2 active:opacity-80 select-none",
    {
        variants: {
            size: {
                lg: "h-11 px-3 gap-1.75 text-base",
                // sm: "h-7 px-1.5 gap-1 text-sm",
                // md: "h-9 px-2.5 gap-1.75 text-sm",
            },
            variant: {
                default:
                    "bg-neutral-100 text-neutral-900 shadow-md hover:opacity-90",
                ghost: "bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100",
                // muted: "bg-neutral-700 text-neutral-100 shadow-md hover:bg-neutral-600",
                // outlined:
                //     "bg-transparent text-neutral-300 border border-solid border-neutral-700 shadow-md hover:bg-neutral-800",
                // transparent:
                //     "bg-transparent text-neutral-300 hover:text-neutral-100",
            },
            // disabled: {
            //     false: null,
            //     true: "text-monochrome-secondary shadow-none pointer-events-none",
            // },
        },
        defaultVariants: {
            size: "lg",
            variant: "default",
            // disabled: false,
        },
        // compoundVariants: [
        //     {
        //         variant: ["default", "muted"],
        //         disabled: true,
        //         class: "bg-neutral-800",
        //     },
        //     {
        //         variant: ["outlined"],
        //         disabled: true,
        //         class: "border-neutral-800",
        //     },
        // ],
    },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        leftIcon?: React.ElementType;
        rightIcon?: React.ElementType;
    };

export function Button({
    variant,
    leftIcon: LeftIcon,
    children,
    // className,
    // size,
    // rightIcon: RightIcon,
    // disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            type="button"
            {...rest}
            className={cn(
                buttonVariants({ variant /* size, disabled */ }),
                // className,
            )}
            // disabled={disabled}
        >
            {LeftIcon && <LeftIcon />}
            {children && (
                <div
                    className={cn(
                        "pb-0.25",
                        {
                            "px-1": true /* !size || size === "lg" || size === "md" */,
                            // "px-0.5": size === "sm",
                        },
                        {
                            "pl-0": LeftIcon,
                            // "pr-0": RightIcon,
                        },
                    )}
                >
                    {children}
                </div>
            )}
            {/* {RightIcon && <RightIcon />} */}
        </button>
    );
}
