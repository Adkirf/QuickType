import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { signInWithGoogle } from "@/lib/firebase/auth"
import { useAuth } from "./context/AuthProvider"
import { User } from "firebase/auth"

export default function LoginForm() {
    const { setUser, setUserProfile } = useAuth();

    const handleGuestLogin = () => {
        const guestUser = {
            id: "",
            email: "",
            username: "guest"
        }
        setUser(guestUser as unknown as User);
        setUserProfile(guestUser);
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-black text-white">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={signInWithGoogle} className="w-full bg-white text-black hover:bg-gray-200">
                    Sign In with Google
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-gray-500">Or continue </span>
                    </div>
                </div>
                <Button onClick={handleGuestLogin} className="w-full bg-white text-black hover:bg-gray-200">
                    As Guest
                </Button>
                <p className="text-center text-sm text-gray-500">
                    By clicking continue, you agree to our{" "}
                    <a href="#" className="underline hover:text-white">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-white">
                        Privacy Policy
                    </a>
                    .
                </p>
            </CardContent>
        </Card>
    )
}