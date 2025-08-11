import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 w-full">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <AlertTriangle className="mx-auto h-24 w-24 text-amber-400" />
        <h1 className="text-4xl font-bold text-slate-700">Oops!</h1>
        <h2 className="text-2xl font-semibold text-slate-600">Something went wrong</h2>
        <p className="text-slate-500">
          We're experiencing some technical difficulties. Our team has been notified and is working on the issue.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link to={"/"}>Go to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
