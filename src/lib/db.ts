import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface Requirement {
  id: string;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  hireType: "planner" | "performer" | "crew";
  plannerBudget?: string;
  plannerServices?: string[];
  plannerGuestCount?: string;
  plannerNotes?: string;
  performerGenre?: string;
  performerType?: string;
  performerDuration?: string;
  performerEquipment?: string;
  performerNotes?: string;
  crewRoles?: string[];
  crewCount?: string;
  crewExperience?: string;
  crewShiftDetails?: string;
  crewNotes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
}

// Map camelCase form fields to snake_case DB columns
function toDbRow(input: Omit<Requirement, "id" | "status" | "createdAt">) {
  return {
    event_name: input.eventName,
    event_type: input.eventType,
    start_date: input.startDate,
    end_date: input.endDate || null,
    location: input.location,
    venue: input.venue || null,
    hire_type: input.hireType,
    planner_budget: input.plannerBudget || null,
    planner_services: input.plannerServices?.length ? input.plannerServices : null,
    planner_guest_count: input.plannerGuestCount || null,
    planner_notes: input.plannerNotes || null,
    performer_genre: input.performerGenre || null,
    performer_type: input.performerType || null,
    performer_duration: input.performerDuration || null,
    performer_equipment: input.performerEquipment || null,
    performer_notes: input.performerNotes || null,
    crew_roles: input.crewRoles?.length ? input.crewRoles : null,
    crew_count: input.crewCount || null,
    crew_experience: input.crewExperience || null,
    crew_shift_details: input.crewShiftDetails || null,
    crew_notes: input.crewNotes || null,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone || null,
    additional_notes: input.additionalNotes || null,
  };
}

// Map snake_case DB row to camelCase Requirement
function fromDbRow(row: Record<string, unknown>): Requirement {
  return {
    id: row.id as string,
    eventName: row.event_name as string,
    eventType: row.event_type as string,
    startDate: row.start_date as string,
    endDate: (row.end_date as string) || undefined,
    location: row.location as string,
    venue: (row.venue as string) || undefined,
    hireType: row.hire_type as "planner" | "performer" | "crew",
    plannerBudget: (row.planner_budget as string) || undefined,
    plannerServices: (row.planner_services as string[]) || undefined,
    plannerGuestCount: (row.planner_guest_count as string) || undefined,
    plannerNotes: (row.planner_notes as string) || undefined,
    performerGenre: (row.performer_genre as string) || undefined,
    performerType: (row.performer_type as string) || undefined,
    performerDuration: (row.performer_duration as string) || undefined,
    performerEquipment: (row.performer_equipment as string) || undefined,
    performerNotes: (row.performer_notes as string) || undefined,
    crewRoles: (row.crew_roles as string[]) || undefined,
    crewCount: (row.crew_count as string) || undefined,
    crewExperience: (row.crew_experience as string) || undefined,
    crewShiftDetails: (row.crew_shift_details as string) || undefined,
    crewNotes: (row.crew_notes as string) || undefined,
    contactName: row.contact_name as string,
    contactEmail: row.contact_email as string,
    contactPhone: (row.contact_phone as string) || undefined,
    additionalNotes: (row.additional_notes as string) || undefined,
    status: row.status as string,
    createdAt: row.created_at as string,
  };
}

export async function getAll(hireType?: string): Promise<Requirement[]> {
  let query = supabase
    .from("requirements")
    .select("*")
    .order("created_at", { ascending: false });

  if (hireType) {
    query = query.eq("hire_type", hireType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(fromDbRow);
}

export async function getById(id: string): Promise<Requirement | undefined> {
  const { data, error } = await supabase
    .from("requirements")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return undefined;
  return fromDbRow(data);
}

export async function create(
  input: Omit<Requirement, "id" | "status" | "createdAt">
): Promise<Requirement> {
  const { data, error } = await supabase
    .from("requirements")
    .insert(toDbRow(input))
    .select()
    .single();

  if (error) throw error;
  return fromDbRow(data);
}
