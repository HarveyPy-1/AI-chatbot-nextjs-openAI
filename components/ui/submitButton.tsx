import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

// We use 'type' instead of 'interface' because we want to extend it using a union (&) with other props
type LoadingButtonProps = {
  loading: boolean;
} & ButtonProps;

const SubmitButton = ({ children, loading, ...props }: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
export default SubmitButton;
