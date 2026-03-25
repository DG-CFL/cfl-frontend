import { Link } from '@tanstack/react-router'
import checkEmailIllustration from '@/assets/f8d056c6f473eacb3909366c8b70735165d428ae.png'

export default function ResetPasswordEmail() {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-10 px-4 py-10 sm:px-8 lg:flex-row lg:items-center lg:gap-14 xl:gap-20">
      <div className="flex w-full shrink-0 justify-center lg:w-[min(52%,680px)] lg:max-w-[680px] lg:justify-end">
        <img
          src={checkEmailIllustration}
          alt=""
          className="h-auto w-full max-w-[min(92vw,560px)] object-contain sm:max-w-[600px] lg:max-w-none lg:w-full"
          decoding="async"
        />
      </div>
      <div className="flex w-full max-w-md flex-col gap-5 text-left lg:max-w-lg lg:flex-1 lg:justify-center">
        <h1 className="text-pretty text-3xl! font-bold! tracking-tight text-foreground sm:text-4xl!">
          Check your email
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          If your account exists, an email including instructions on how to
          reset your password will be sent
        </p>
        <Link
          to="/login"
          className="w-fit text-base font-medium text-sky-600 underline underline-offset-4 hover:text-sky-700"
        >
          Back to Login Page
        </Link>
      </div>
    </div>
  )
}
