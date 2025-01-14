import { useKeyboard } from "../context/KeyboardContext"
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function FileSelection() {
    const { _files, handleFileSelect } = useKeyboard();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Available Documents</CardTitle>
            </CardHeader>
            <CardContent>
                {_files.map((file) => (
                    <Button
                        key={file.name}
                        onClick={() => {
                            handleFileSelect(file);
                        }}
                        className="w-full mb-2"
                        variant="outline"
                    >
                        {file.name}
                    </Button>
                ))}
            </CardContent>
        </Card>
    );
}