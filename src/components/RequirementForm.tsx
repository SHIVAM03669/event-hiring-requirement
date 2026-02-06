"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Music,
  Wrench,
  ClipboardList,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HireType = "planner" | "performer" | "crew";

interface FormData {
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  hireType: HireType | "";
  // Planner
  plannerBudget: string;
  plannerServices: string[];
  plannerGuestCount: string;
  plannerNotes: string;
  // Performer
  performerGenre: string;
  performerType: string;
  performerDuration: string;
  performerEquipment: string;
  performerNotes: string;
  // Crew
  crewRoles: string[];
  crewCount: string;
  crewExperience: string;
  crewShiftDetails: string;
  crewNotes: string;
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes: string;
}

const initialFormData: FormData = {
  eventName: "",
  eventType: "",
  startDate: "",
  endDate: "",
  location: "",
  venue: "",
  hireType: "",
  plannerBudget: "",
  plannerServices: [],
  plannerGuestCount: "",
  plannerNotes: "",
  performerGenre: "",
  performerType: "",
  performerDuration: "",
  performerEquipment: "",
  performerNotes: "",
  crewRoles: [],
  crewCount: "",
  crewExperience: "",
  crewShiftDetails: "",
  crewNotes: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  additionalNotes: "",
};

const PLANNER_SERVICES = [
  "Full Event Planning",
  "Day-of Coordination",
  "Vendor Management",
  "Decor & Design",
  "Catering Coordination",
  "Guest Management",
];

const CREW_ROLES = [
  "Stage Hand",
  "Sound Technician",
  "Lighting Technician",
  "Camera Operator",
  "Event Security",
  "Setup/Teardown",
];

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Concert",
  "Festival",
  "Birthday Party",
  "Conference",
  "Product Launch",
  "Charity Gala",
  "Other",
];

const hireTypeConfig: Record<
  HireType,
  { label: string; icon: typeof ClipboardList; color: string; description: string }
> = {
  planner: {
    label: "Event Planner",
    icon: ClipboardList,
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    description: "Plan, coordinate, and manage your event end-to-end",
  },
  performer: {
    label: "Performer",
    icon: Music,
    color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
    description: "Musicians, DJs, dancers, comedians, and more",
  },
  crew: {
    label: "Crew",
    icon: Wrench,
    color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    description: "Technical staff, stagehands, security, and support",
  },
};

export default function RequirementForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  function update(fields: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  function toggleArrayItem(
    field: "plannerServices" | "crewRoles",
    item: string
  ) {
    setFormData((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!(
          formData.eventName &&
          formData.eventType &&
          formData.startDate &&
          formData.location
        );
      case 2:
        return !!formData.hireType;
      case 3:
        return true;
      case 4:
        return !!(formData.contactName && formData.contactEmail);
      default:
        return false;
    }
  }

  async function handleSubmit() {
    if (!canProceed()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSubmittedId(json.data.id);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFormData(initialFormData);
    setStep(1);
    setSubmitted(false);
    setSubmittedId("");
    setError("");
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">Requirement Submitted!</h2>
            <p className="text-muted-foreground">
              Your {formData.hireType} requirement for{" "}
              <strong>{formData.eventName}</strong> has been saved successfully.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {hireTypeConfig[formData.hireType as HireType]?.label}
              </Badge>
              <Badge variant="outline">{formData.eventType}</Badge>
              <Badge variant="outline">{formData.location}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Reference ID: {submittedId}
            </p>
            <Button onClick={handleReset} className="mt-2">
              Submit Another Requirement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Post a Requirement
          </h1>
          <p className="mt-1 text-muted-foreground">
            Tell us about your event and who you need to hire
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>
              {step === 1 && "Event Details"}
              {step === 2 && "Who to Hire"}
              {step === 3 &&
                (formData.hireType
                  ? `${hireTypeConfig[formData.hireType as HireType]?.label} Details`
                  : "Specific Details")}
              {step === 4 && "Contact & Review"}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Event Basics */}
            {step === 1 && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Event Details
                  </CardTitle>
                  <CardDescription>
                    Basic information about your event
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name *</Label>
                    <Input
                      id="eventName"
                      placeholder="e.g. Annual Company Gala"
                      value={formData.eventName}
                      onChange={(e) => update({ eventName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(v) => update({ eventType: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => update({ startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => update({ endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, NY"
                      value={formData.location}
                      onChange={(e) => update({ location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue (optional)</Label>
                    <Input
                      id="venue"
                      placeholder="e.g. Grand Ballroom, Hilton Hotel"
                      value={formData.venue}
                      onChange={(e) => update({ venue: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Hire Type Selection */}
            {step === 2 && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Who Do You Want to Hire?
                  </CardTitle>
                  <CardDescription>
                    Select the type of professional you need for your event
                  </CardDescription>
                </CardHeader>

                <div className="grid gap-3">
                  {(Object.keys(hireTypeConfig) as HireType[]).map((type) => {
                    const config = hireTypeConfig[type];
                    const Icon = config.icon;
                    const selected = formData.hireType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update({ hireType: type })}
                        className={cn(
                          "flex items-center gap-4 rounded-lg border-2 p-4 text-left transition-all",
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                            config.color
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{config.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {config.description}
                          </div>
                        </div>
                        {selected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Type-specific details */}
            {step === 3 && formData.hireType === "planner" && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Event Planner Requirements
                  </CardTitle>
                  <CardDescription>
                    Specify what you need from an event planner
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plannerBudget">Estimated Budget</Label>
                    <Select
                      value={formData.plannerBudget}
                      onValueChange={(v) => update({ plannerBudget: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $1,000">
                          Under $1,000
                        </SelectItem>
                        <SelectItem value="$1,000 - $5,000">
                          $1,000 - $5,000
                        </SelectItem>
                        <SelectItem value="$5,000 - $15,000">
                          $5,000 - $15,000
                        </SelectItem>
                        <SelectItem value="$15,000 - $50,000">
                          $15,000 - $50,000
                        </SelectItem>
                        <SelectItem value="$50,000+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Services Needed</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {PLANNER_SERVICES.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={formData.plannerServices.includes(service)}
                            onCheckedChange={() =>
                              toggleArrayItem("plannerServices", service)
                            }
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plannerGuestCount">
                      Expected Guest Count
                    </Label>
                    <Input
                      id="plannerGuestCount"
                      placeholder="e.g. 150"
                      value={formData.plannerGuestCount}
                      onChange={(e) =>
                        update({ plannerGuestCount: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plannerNotes">Additional Notes</Label>
                    <Textarea
                      id="plannerNotes"
                      placeholder="Any specific requirements or preferences..."
                      value={formData.plannerNotes}
                      onChange={(e) =>
                        update({ plannerNotes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && formData.hireType === "performer" && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Performer Requirements
                  </CardTitle>
                  <CardDescription>
                    Tell us about the performer you&apos;re looking for
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="performerType">Performer Type</Label>
                    <Select
                      value={formData.performerType}
                      onValueChange={(v) => update({ performerType: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select performer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Band">Band</SelectItem>
                        <SelectItem value="Solo Artist">Solo Artist</SelectItem>
                        <SelectItem value="DJ">DJ</SelectItem>
                        <SelectItem value="Dancer">Dancer</SelectItem>
                        <SelectItem value="Comedian">Comedian</SelectItem>
                        <SelectItem value="Magician">Magician</SelectItem>
                        <SelectItem value="MC/Host">MC / Host</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performerGenre">Genre / Style</Label>
                    <Input
                      id="performerGenre"
                      placeholder="e.g. Jazz, Rock, Classical, Stand-up"
                      value={formData.performerGenre}
                      onChange={(e) =>
                        update({ performerGenre: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performerDuration">
                      Performance Duration
                    </Label>
                    <Select
                      value={formData.performerDuration}
                      onValueChange={(v) => update({ performerDuration: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="3 hours">3 hours</SelectItem>
                        <SelectItem value="Full day">Full day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performerEquipment">
                      Equipment Provided?
                    </Label>
                    <RadioGroup
                      value={formData.performerEquipment}
                      onValueChange={(v) => update({ performerEquipment: v })}
                    >
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value="Venue provides" />
                          Venue provides
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value="Performer brings own" />
                          Performer brings own
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value="To be discussed" />
                          TBD
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performerNotes">Additional Notes</Label>
                    <Textarea
                      id="performerNotes"
                      placeholder="Song preferences, theme requirements, etc."
                      value={formData.performerNotes}
                      onChange={(e) =>
                        update({ performerNotes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && formData.hireType === "crew" && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Crew Requirements
                  </CardTitle>
                  <CardDescription>
                    Specify the crew and technical staff you need
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Roles Needed</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {CREW_ROLES.map((role) => (
                        <label
                          key={role}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={formData.crewRoles.includes(role)}
                            onCheckedChange={() =>
                              toggleArrayItem("crewRoles", role)
                            }
                          />
                          {role}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crewCount">Total Crew Members Needed</Label>
                    <Input
                      id="crewCount"
                      placeholder="e.g. 5"
                      value={formData.crewCount}
                      onChange={(e) => update({ crewCount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crewExperience">
                      Experience Level Preferred
                    </Label>
                    <Select
                      value={formData.crewExperience}
                      onValueChange={(v) => update({ crewExperience: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Experienced">Experienced</SelectItem>
                        <SelectItem value="Expert/Senior">
                          Expert / Senior
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crewShiftDetails">Shift Details</Label>
                    <Input
                      id="crewShiftDetails"
                      placeholder="e.g. 8am - 6pm, includes setup and teardown"
                      value={formData.crewShiftDetails}
                      onChange={(e) =>
                        update({ crewShiftDetails: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crewNotes">Additional Notes</Label>
                    <Textarea
                      id="crewNotes"
                      placeholder="Uniform requirements, special skills, etc."
                      value={formData.crewNotes}
                      onChange={(e) => update({ crewNotes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Review */}
            {step === 4 && (
              <div className="space-y-5">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information & Review
                  </CardTitle>
                  <CardDescription>
                    How should we reach you about this requirement?
                  </CardDescription>
                </CardHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contactName"
                      className="flex items-center gap-1"
                    >
                      <User className="h-3.5 w-3.5" />
                      Full Name *
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      value={formData.contactName}
                      onChange={(e) => update({ contactName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactEmail"
                      className="flex items-center gap-1"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Email Address *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => update({ contactEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contactPhone"
                      className="flex items-center gap-1"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Phone (optional)
                    </Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contactPhone}
                      onChange={(e) => update({ contactPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">
                      Additional Notes (optional)
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Anything else we should know..."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        update({ additionalNotes: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Review summary */}
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Summary</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Event</div>
                    <div>{formData.eventName}</div>
                    <div className="text-muted-foreground">Type</div>
                    <div>{formData.eventType}</div>
                    <div className="text-muted-foreground">Date</div>
                    <div>
                      {formData.startDate}
                      {formData.endDate ? ` to ${formData.endDate}` : ""}
                    </div>
                    <div className="text-muted-foreground">Location</div>
                    <div>
                      {formData.location}
                      {formData.venue ? ` (${formData.venue})` : ""}
                    </div>
                    <div className="text-muted-foreground">Hiring</div>
                    <div>
                      <Badge variant="secondary">
                        {formData.hireType &&
                          hireTypeConfig[formData.hireType as HireType]?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Requirement
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                s === step
                  ? "w-6 bg-primary"
                  : s < step
                    ? "bg-primary/60"
                    : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
