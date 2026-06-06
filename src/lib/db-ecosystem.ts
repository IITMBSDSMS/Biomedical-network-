/**
 * Supabase PostgREST wrapper for the Student ↔ Researcher Ecosystem tables.
 *   - student_connections (calls, messages)
 *   - doubts
 *   - thesis_updates
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let _client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!_client) {
    if (!supabaseUrl || !supabaseServiceKey)
      throw new Error("Supabase not configured.");
    _client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}

function errMsg(e: any, ctx: string): never {
  throw new Error(`ECO[${ctx}]: ${e?.message || e?.details || JSON.stringify(e)}`);
}
function uuid() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }

// ── StudentConnection ─────────────────────────────────────────────────────────

export const ecoConnection = {
  async create(args: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    researcherId: string;
    type: "CALL" | "MESSAGE";
    subject?: string;
    message?: string;
    scheduledAt?: string;
  }) {
    const payload = {
      id: uuid(),
      studentId: args.studentId,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      researcherId: args.researcherId,
      type: args.type,
      status: "PENDING",
      subject: args.subject || null,
      message: args.message || null,
      scheduledAt: args.scheduledAt || null,
      createdAt: now(),
      updatedAt: now(),
    };
    const { data, error } = await (sb()
      .from("student_connections")
      .insert(payload)
      .select("*") as any).single();
    if (error) errMsg(error, "connection.create");
    return data;
  },

  async findManyForResearcher(researcherId: string) {
    const { data, error } = await sb()
      .from("student_connections")
      .select("*")
      .eq("researcherId", researcherId)
      .order("createdAt", { ascending: false });
    if (error) errMsg(error, "connection.findMany");
    return data || [];
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await (sb()
      .from("student_connections")
      .update({ status, updatedAt: now() })
      .eq("id", id)
      .select("*") as any).single();
    if (error) errMsg(error, "connection.updateStatus");
    return data;
  },
};

// ── Doubt ─────────────────────────────────────────────────────────────────────

export const ecoDoubt = {
  async create(args: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    researcherId: string;
    title: string;
    description: string;
  }) {
    const payload = {
      id: uuid(),
      studentId: args.studentId,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      researcherId: args.researcherId,
      title: args.title,
      description: args.description,
      status: "OPEN",
      answer: null,
      createdAt: now(),
      updatedAt: now(),
    };
    const { data, error } = await (sb()
      .from("doubts")
      .insert(payload)
      .select("*") as any).single();
    if (error) errMsg(error, "doubt.create");
    return data;
  },

  async findManyForResearcher(researcherId: string) {
    const { data, error } = await sb()
      .from("doubts")
      .select("*")
      .eq("researcherId", researcherId)
      .order("createdAt", { ascending: false });
    if (error) errMsg(error, "doubt.findMany");
    return data || [];
  },

  async answer(id: string, answer: string) {
    const { data, error } = await (sb()
      .from("doubts")
      .update({ answer, status: "ANSWERED", updatedAt: now() })
      .eq("id", id)
      .select("*") as any).single();
    if (error) errMsg(error, "doubt.answer");
    return data;
  },
};

// ── ThesisUpdate ──────────────────────────────────────────────────────────────

export const ecoThesis = {
  async create(args: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    researcherId: string;
    title: string;
    description?: string;
    chapter?: string;
    fileUrl?: string;
  }) {
    const payload = {
      id: uuid(),
      studentId: args.studentId,
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      researcherId: args.researcherId,
      title: args.title,
      description: args.description || null,
      chapter: args.chapter || null,
      fileUrl: args.fileUrl || null,
      status: "PENDING",
      feedback: null,
      createdAt: now(),
      updatedAt: now(),
    };
    const { data, error } = await (sb()
      .from("thesis_updates")
      .insert(payload)
      .select("*") as any).single();
    if (error) errMsg(error, "thesis.create");
    return data;
  },

  async findManyForResearcher(researcherId: string) {
    const { data, error } = await sb()
      .from("thesis_updates")
      .select("*")
      .eq("researcherId", researcherId)
      .order("createdAt", { ascending: false });
    if (error) errMsg(error, "thesis.findMany");
    return data || [];
  },

  async review(id: string, status: string, feedback: string) {
    const { data, error } = await (sb()
      .from("thesis_updates")
      .update({ status, feedback, updatedAt: now() })
      .eq("id", id)
      .select("*") as any).single();
    if (error) errMsg(error, "thesis.review");
    return data;
  },
};
