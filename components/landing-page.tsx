import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LandingPagComponent() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">LegalTyper</CardTitle>
                    <CardDescription className="text-xl">
                        Improve your typing speed with official legal documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        type="text"
                        placeholder="Start typing here..."
                        className="w-full text-lg"
                    />
                </CardContent>
            </Card>

            <div className="flex justify-center space-x-4 mt-8">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    Speed
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    Accuracy
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    Consistency
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    Legal Terms
                </Badge>
            </div>

            <p className="text-center text-gray-600 mt-4 max-w-xl">
                Master the art of typing legal documents with our gamified platform designed specifically for German law students.
            </p>

            <Card className="mt-8 w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                        We're working hard to bring you the best typing experience for legal professionals. Stay tuned!
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button>Get Notified</Button>
                </CardFooter>
            </Card>
        </div>
    )
}