type LoadingSkeletonProps = {
  variant?: 'full' | 'inline'
  className?: string
}

export default function LoadingSkeleton({
  variant = 'full',
  className = '',
}: LoadingSkeletonProps) {
  const wrapperClassName =
    variant === 'inline'
      ? `flex w-full items-center justify-center ${className}`
      : `flex h-screen w-full items-center justify-center bg-background ${className}`

  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-lg text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
}
