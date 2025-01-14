import { useKeyboard } from "../context/KeyboardContext"
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Keyboard from "./Keyboard";

export default function ExamSubmission() {
    const { _keyColors, handleBackToFiles } = useKeyboard();

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Congratulations, Exam Completed!</h2>
            <p className="text-gray-600 mb-4">
                Please select the keyboard, and submit the exam for a deeper analysis and personalized training program.
            </p>
            <Keyboard keyColors={_keyColors} />
            <Button
                className="mt-2"
                onClick={() => {
                    handleBackToFiles();
                }}
                variant="ghost"
            >
                Submit Exam
                <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
        </div>
    );
}