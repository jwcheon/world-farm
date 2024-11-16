import { cn } from "./ui/utils";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className="absolute px-10 top-0 left-0 w-full h-full flex justify-center items-center text-center animate-pulse">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
