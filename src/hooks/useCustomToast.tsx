import { useToast } from "./use-toast";
import {
    BsChatSquareText,
    BsDashCircleFill,
    BsCheckCircleFill,
    BsExclamationCircleFill
} from "react-icons/bs";
import React, { ReactNode } from 'react';

export type ToastVariant = "info" | "destructive" | "success" | "warning" | "default";

export const useCustomToast = () => {
    const { toast } = useToast();

    const showCustomToast = (
        title: string, 
        operation: string, 
        variantMode: ToastVariant, 
        toastTitle: string = 'UPDATE'
    ) => {
        const Icons = {
            info: BsChatSquareText,
            destructive: BsDashCircleFill,
            success: BsCheckCircleFill,
            warning: BsExclamationCircleFill,
            default: BsChatSquareText,
        };

        const SelectedIcon = Icons[variantMode];

        toast({
            title: (
                <div className="flex items-center justify-center gap-2">
                    <SelectedIcon className="w-5 h-5 text-white" />
                    <span>{toastTitle}</span>
                </div>
            ) as ReactNode,
            description: (
                <span>
                    <span className="font-bold italic">{title}</span> has been{" "}
                    <span className="">{operation}</span>.
                </span>
            ),
            variant: variantMode as any, // Cast to any because the shadcn toast variant might have different literal types
        });
    };

    const showErrorToast = (message: string, toastTitle: string = 'ERROR') => {
        toast({
            title: (
                <div className="flex items-center justify-center gap-2">
                    <BsDashCircleFill className="w-5 h-5 text-white" />
                    <span>{toastTitle}</span>
                </div>
            ) as ReactNode,
            description: <span>{message}</span>,
            variant: "destructive",
        });
    };

    return { showCustomToast, showErrorToast };
};
