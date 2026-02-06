import Link from "next/link";
import { ClipboardList, ShieldCheck } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Event Hiring Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Post requirements for event planners, performers, and crew — or
            manage submissions as an admin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/post" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-2 hover:border-primary/40">
              <CardHeader className="items-center text-center space-y-4 py-10">
                <div className="rounded-full bg-primary/10 p-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Post a Requirement</CardTitle>
                  <CardDescription>
                    Hire an event planner, performer, or crew for your upcoming
                    event.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin" className="group">
            <Card className="h-full transition-shadow hover:shadow-lg border-2 hover:border-primary/40">
              <CardHeader className="items-center text-center space-y-4 py-10">
                <div className="rounded-full bg-primary/10 p-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                  <CardDescription>
                    View and manage all submitted requirements.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
