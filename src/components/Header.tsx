
import { FilePenLine } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-resume-primary text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FilePenLine size={28} />
          <h1 className="text-2xl font-display font-bold">FluentCV</h1>
        </div>
        <div className="text-sm">AI-Powered Resume Builder</div>
      </div>
    </header>
  );
};

export default Header;
