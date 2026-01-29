import { useToast } from "./use-toast";
import {
    BsChatSquareText,
    BsDashCircleFill,
    BsCheckCircleFill,
    BsExclamationCircleFill
} from "react-icons/bs";
import React, { ReactNode, useCallback } from 'react';

export type ToastVariant = "info" | "destructive" | "success" | "warning" | "default";

export const useCustomToast = () => {
    const { toast } = useToast();

    const showCustomToast = useCallback((
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
            title: toastTitle,
            description: (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <SelectedIcon className="w-4 h-4" />
                        <span>
                            <span className="font-bold italic">{title}</span> has been {operation}.
                        </span>
                    </div>
                </div>
            ),
            variant: variantMode as any,
        });
    }, [toast]);

    const showErrorToast = useCallback((message: string, toastTitle: string = 'ERROR') => {
        toast({
            title: toastTitle,
            description: (
                <div className="flex items-center gap-2">
                    <BsDashCircleFill className="w-4 h-4" />
                    <span>{message}</span>
                </div>
            ),
            variant: "destructive",
        });
    }, [toast]);

    return { showCustomToast, showErrorToast };
};
