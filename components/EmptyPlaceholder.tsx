import { cn } from "./ui/utils";

export const EmptyPlaceholder = ({
  className,
  replaceText,
}: {
  className?: string;
  replaceText?: string;
}) => {
  return (
    <div
      className={cn(
        "px-10 top-0 left-0 w-full h-full flex justify-center items-center text-center",
        className
      )}
    >
      {replaceText ?? "Nothing yet."}
    </div>
  );
};
