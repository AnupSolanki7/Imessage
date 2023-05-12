import AuthForm from "./components/AuthForm";

export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-200">
        <img className="mx-auto" width="48px" height="48px" src="/images/logo.png" alt="logo" />
        <h2 className="text-2xl font-bold" >Sign in to your account</h2>
        <AuthForm/>
      </main>
    )
  }