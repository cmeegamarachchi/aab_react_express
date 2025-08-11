import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

const Site404Page = () => {
  return (
    <div className="flex items-center justify-center bg-slate-100 w-full">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <WifiOff className="mx-auto h-24 w-24 text-slate-400" />
        <h1 className="text-4xl font-bold text-slate-700">404</h1>
        <h2 className="text-2xl font-semibold text-slate-600">Oops! You broke the internet!</h2>
        <p className="text-slate-500">
          Don't worry, it's not your fault. Maybe the page is on a coffee break or got lost in cyberspace.
        </p>
        <Button variant="outline" asChild className="mt-4">
          <Link to={"/"}>Take Me Back to Safety</Link>
        </Button>
      </div>
    </div>
  );
};

export default Site404Page;
