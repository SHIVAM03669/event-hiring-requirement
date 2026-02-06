import Link from "next/link";
import { getAll, type Requirement } from "@/lib/db";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  User,
  Mail,
  Phone,
  ClipboardList,
  Music,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const hireTypeConfig: Record<
  string,
  { label: string; icon: typeof ClipboardList; badgeClass: string }
> = {
  planner: {
    label: "Event Planner",
    icon: ClipboardList,
    badgeClass: "bg-blue-100 text-blue-800",
  },
  performer: {
    label: "Performer",
    icon: Music,
    badgeClass: "bg-purple-100 text-purple-800",
  },
  crew: {
    label: "Crew",
    icon: Wrench,
    badgeClass: "bg-amber-100 text-amber-800",
  },
};

function DetailRow({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground shrink-0 w-36">{label}</span>
      <span>{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}

function RequirementCard({ req }: { req: Requirement }) {
  const config = hireTypeConfig[req.hireType];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{req.eventName}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {req.startDate}
                {req.endDate ? ` — ${req.endDate}` : ""}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {req.location}
                {req.venue ? ` (${req.venue})` : ""}
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={config.badgeClass}>{config.label}</Badge>
            <Badge variant="outline">{req.eventType}</Badge>
            <Badge variant="secondary">{req.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type-specific details */}
        {req.hireType === "planner" && (
          <div className="space-y-1">
            <DetailRow label="Budget" value={req.plannerBudget} />
            <DetailRow label="Services" value={req.plannerServices} />
            <DetailRow label="Guest Count" value={req.plannerGuestCount} />
            <DetailRow label="Planner Notes" value={req.plannerNotes} />
          </div>
        )}
        {req.hireType === "performer" && (
          <div className="space-y-1">
            <DetailRow label="Performer Type" value={req.performerType} />
            <DetailRow label="Genre" value={req.performerGenre} />
            <DetailRow label="Duration" value={req.performerDuration} />
            <DetailRow label="Equipment" value={req.performerEquipment} />
            <DetailRow label="Performer Notes" value={req.performerNotes} />
          </div>
        )}
        {req.hireType === "crew" && (
          <div className="space-y-1">
            <DetailRow label="Roles" value={req.crewRoles} />
            <DetailRow label="Crew Count" value={req.crewCount} />
            <DetailRow label="Experience" value={req.crewExperience} />
            <DetailRow label="Shift Details" value={req.crewShiftDetails} />
            <DetailRow label="Crew Notes" value={req.crewNotes} />
          </div>
        )}

        {req.additionalNotes && (
          <DetailRow label="Additional Notes" value={req.additionalNotes} />
        )}

        {/* Contact info */}
        <div className="border-t pt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {req.contactName}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            {req.contactEmail}
          </span>
          {req.contactPhone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {req.contactPhone}
            </span>
          )}
          <span className="ml-auto text-xs">
            {new Date(req.createdAt).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminPage() {
  const requirements = await getAll();

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin — Submissions
            </h1>
          <p className="text-muted-foreground mt-1">
            {requirements.length} requirement{requirements.length !== 1 ? "s" : ""} submitted
          </p>
        </div>

        {requirements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No submissions yet. Requirements will appear here once submitted.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requirements.map((req) => (
              <RequirementCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
