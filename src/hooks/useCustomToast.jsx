import { useToast } from "./use-toast";
import {
    BsChatSquareText,
    BsDashCircleFill,
    BsCheckCircleFill,
    BsExclamationCircleFill
} from "react-icons/bs";

export const useCustomToast = () => {
    const { toast } = useToast();

    const showCustomToast = (title, operation, variantMode, toastTitle = 'UPDATE') => {
        const validVariants = ["info", "destructive", "success", "warning", "default"];

        if (!validVariants.includes(variantMode)) {
            throw new Error(`Invalid variant: '${variantMode}'. Expected one of: ${validVariants.join(", ")}`);
        }

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
            ),
            description: (
                <span>
                    <span className="font-bold italic">{title}</span> has been{" "}
                    <span className="">{operation}</span>.
                </span>
            ),
            variant: variantMode,
        });
    };

    const showErrorToast = (message, toastTitle = 'ERROR') => {
        toast({
            title: (
                <div className="flex items-center justify-center gap-2">
                    <BsDashCircleFill className="w-5 h-5 text-white" />
                    <span>{toastTitle}</span>
                </div>
            ),
            description: <span>{message}</span>,
            variant: "destructive",
        });
    };

    return { showCustomToast, showErrorToast };
};
