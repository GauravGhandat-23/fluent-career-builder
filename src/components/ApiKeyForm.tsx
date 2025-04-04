
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Key } from "lucide-react";

interface ApiKeyFormProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyForm = ({ apiKey, setApiKey }: ApiKeyFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(inputKey);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Key size={16} />
        {apiKey ? "Change API Key" : "Set GROQ API Key"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GROQ API Key</DialogTitle>
            <DialogDescription>
              Enter your GROQ API key to use AI features. Your key is stored
              locally in your browser and never sent to our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="api-key" className="text-left">
                API Key
              </Label>
              <Input
                id="api-key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="groq_api_key_..."
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>
                To get a GROQ API key, sign up at{" "}
                <a
                  href="https://console.groq.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://console.groq.com/
                </a>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyForm;
