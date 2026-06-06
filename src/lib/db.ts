/**
 * Production-compatible database client for Healix BioLabs.
 * 
 * Uses Supabase PostgREST (HTTPS) instead of direct PostgreSQL TCP connections.
 * This solves the IPv4/IPv6 connectivity issue on Vercel serverless functions.
 * The Supabase direct DB host is IPv6-only; PostgREST works over IPv4 HTTPS.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let _adminClient: SupabaseClient | null = null;

function sb(): SupabaseClient {
  if (!_adminClient) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase URL or service role key is not configured.");
    }
    _adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _adminClient;
}

function err(e: any, ctx: string): never {
  throw new Error(`DB[${ctx}]: ${e?.message || e?.details || JSON.stringify(e)}`);
}

function uuid() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }

// ── User ─────────────────────────────────────────────────────────────────────

const user = {
  async findUnique(args: { where: { email?: string; id?: string }; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.researcher) select = "*, researcher:researchers(*)";
    if (args.include?.notifications) select = "*, notifications(*)";
    
    let q = sb().from("users").select(select as any);
    if (args.where.email) q = q.eq("email", args.where.email) as any;
    if (args.where.id) q = q.eq("id", args.where.id) as any;
    
    const { data, error } = await (q as any).maybeSingle();
    if (error) err(error, "user.findUnique");
    if (!data) return null;
    
    // Normalize embedded arrays to single items
    if (args.include?.researcher && Array.isArray(data.researcher)) {
      data.researcher = data.researcher[0] || null;
    }
    return data;
  },

  async findMany(args?: { where?: any; include?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let select = "*";
    if (args?.include?.researcher) select = "*, researcher:researchers(*)";
    
    let q: any = sb().from("users").select(select as any);
    if (args?.where?.role) q = q.eq("role", args.where.role);
    if (args?.where?.id) q = q.eq("id", args.where.id);
    if (args?.take) q = q.limit(args.take);
    if (args?.skip && args?.take) q = q.range(args.skip, args.skip + args.take - 1);
    
    const { data, error } = await q;
    if (error) err(error, "user.findMany");
    if (data && args?.include?.researcher) {
      for (const item of data) {
        if (Array.isArray(item.researcher)) {
          item.researcher = item.researcher[0] || null;
        }
      }
    }
    return data || [];
  },

  async create(args: { data: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.researcher) select = "*, researcher:researchers(*)";
    
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("users").insert(payload).select(select as any) as any).single();
    if (error) err(error, "user.create");
    if (args.include?.researcher && Array.isArray(data.researcher)) {
      data.researcher = data.researcher[0] || null;
    }
    return data;
  },

  async update(args: { where: any; data: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.researcher) select = "*, researcher:researchers(*)";
    
    const payload = { ...args.data, updatedAt: now() };
    let q: any = sb().from("users").update(payload).select(select as any);
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.email) q = q.eq("email", args.where.email);
    
    const { data, error } = await q.single();
    if (error) err(error, "user.update");
    if (args.include?.researcher && Array.isArray(data.researcher)) {
      data.researcher = data.researcher[0] || null;
    }
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("users").select("id", { count: "exact", head: true });
    if (args?.where?.role) q = q.eq("role", args.where.role);
    const { count, error } = await q;
    if (error) err(error, "user.count");
    return count || 0;
  },

  async delete(args: { where: any }): Promise<any> {
    let q: any = sb().from("users").delete().select("*");
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.email) q = q.eq("email", args.where.email);
    const { data, error } = await q.single();
    if (error) err(error, "user.delete");
    return data;
  },
};

// ── Researcher ────────────────────────────────────────────────────────────────

const researcher = {
  async findUnique(args: { where: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.user) select += ", user:users(*)";
    if (args.include?.publications) select += ", publications(*)";
    if (args.include?.projectsCreated) select += ", projectsCreated:projects(*)";
    if (args.include?.projectsJoined) select += ", projectsJoined:project_members(*, project:projects(*))";
    
    let q: any = sb().from("researchers").select(select as any);
    if (args.where.slug) q = q.eq("slug", args.where.slug);
    if (args.where.userId) q = q.eq("userId", args.where.userId);
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.researchId) q = q.eq("researchId", args.where.researchId);
    
    const { data, error } = await q.maybeSingle();
    if (error) err(error, "researcher.findUnique");
    if (!data) return null;
    if (args.include?.user && Array.isArray(data.user)) data.user = data.user[0] || null;
    return data;
  },

  async findFirst(args: { where?: any; include?: any; orderBy?: any }): Promise<any> {
    let select = "*";
    if (args.include?.user) select += ", user:users(*)";
    if (args.include?.publications) select += ", publications(*)";
    
    let q: any = sb().from("researchers").select(select as any);
    if (args.where?.userId) q = q.eq("userId", args.where.userId);
    if (args.where?.isVerified !== undefined) q = q.eq("isVerified", args.where.isVerified);
    q = q.limit(1);
    
    const { data, error } = await q.maybeSingle();
    if (error) err(error, "researcher.findFirst");
    if (!data) return null;
    if (args.include?.user && Array.isArray(data.user)) data.user = data.user[0] || null;
    return data;
  },

  async findMany(args?: { where?: any; include?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let select = "*";
    if (args?.include?.user) select += ", user:users(*)";
    if (args?.include?.publications !== undefined) {
      if (args.include.publications === true) select += ", publications(*)";
      else if (typeof args.include.publications === "object") {
        select += ", publications(*)";
      }
    }
    if (args?.include?.projectsCreated) select += ", projectsCreated:projects(*)";
    if (args?.include?.projectsJoined) select += ", projectsJoined:project_members(*, project:projects(*))";
    
    let q: any = sb().from("researchers").select(select as any);
    if (args?.where?.isVerified !== undefined) q = q.eq("isVerified", args.where.isVerified);
    if (args?.where?.userId) q = q.eq("userId", args.where.userId);
    if (args?.orderBy?.researchScore === "desc") q = q.order("researchScore", { ascending: false });
    if (args?.orderBy?.researchScore === "asc") q = q.order("researchScore", { ascending: true });
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    if (args?.skip && args?.take) q = q.range(args.skip, args.skip + args.take - 1);
    
    const { data, error } = await q;
    if (error) err(error, "researcher.findMany");
    if (data) {
      for (const item of data) {
        if (args?.include?.user && Array.isArray(item.user)) {
          item.user = item.user[0] || null;
        }
      }
    }
    return data || [];
  },

  async create(args: { data: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.user) select += ", user:users(*)";
    
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("researchers").insert(payload).select(select as any) as any).single();
    if (error) err(error, "researcher.create");
    if (args.include?.user && Array.isArray(data.user)) data.user = data.user[0] || null;
    return data;
  },

  async update(args: { where: any; data: any; include?: any }): Promise<any> {
    const payload = { ...args.data, updatedAt: now() };
    let q: any = sb().from("researchers").update(payload).select("*");
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.userId) q = q.eq("userId", args.where.userId);
    if (args.where.slug) q = q.eq("slug", args.where.slug);
    
    const { data, error } = await q.single();
    if (error) err(error, "researcher.update");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("researchers").select("id", { count: "exact", head: true });
    if (args?.where?.isVerified !== undefined) q = q.eq("isVerified", args.where.isVerified);
    const { count, error } = await q;
    if (error) err(error, "researcher.count");
    return count || 0;
  },

  async delete(args: { where: any }): Promise<any> {
    let q: any = sb().from("researchers").delete().select("*");
    if (args.where.id) q = q.eq("id", args.where.id);
    const { data, error } = await q.single();
    if (error) err(error, "researcher.delete");
    return data;
  },
};

// ── Publication ───────────────────────────────────────────────────────────────

const publication = {
  async findUnique(args: { where: any; include?: any }): Promise<any> {
    let select = "*";
    const incR = args.include?.researcher;
    if (incR) {
      const incU = typeof incR === "object" && incR?.include?.user;
      select += incU ? ", researcher:researchers(*, user:users(*))" : ", researcher:researchers(*)";
    }
    
    const { data, error } = await (sb().from("publications").select(select as any) as any).eq("id", args.where.id).maybeSingle();
    if (error) err(error, "publication.findUnique");
    if (!data) return null;
    if (incR && Array.isArray(data.researcher)) data.researcher = data.researcher[0] || null;
    if (data.researcher?.user && Array.isArray(data.researcher.user)) data.researcher.user = data.researcher.user[0] || null;
    return data;
  },

  async findMany(args?: { where?: any; include?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let select = "*";
    const incR = args?.include?.researcher;
    if (incR) {
      const incU = typeof incR === "object" && incR?.include?.user;
      select += incU ? ", researcher:researchers(*, user:users(*))" : ", researcher:researchers(*)";
    }
    
    let q: any = sb().from("publications").select(select as any);
    if (args?.where?.isApproved !== undefined) q = q.eq("isApproved", args.where.isApproved);
    if (args?.where?.researcherId) q = q.eq("researcherId", args.where.researcherId);
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.orderBy?.updatedAt) q = q.order("updatedAt", { ascending: args.orderBy.updatedAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    if (args?.skip && args?.take) q = q.range(args.skip, args.skip + args.take - 1);
    
    const { data, error } = await q;
    if (error) err(error, "publication.findMany");
    if (data && incR) {
      for (const item of data) {
        if (Array.isArray(item.researcher)) {
          item.researcher = item.researcher[0] || null;
        }
        if (item.researcher?.user && Array.isArray(item.researcher.user)) {
          item.researcher.user = item.researcher.user[0] || null;
        }
      }
    }
    return data || [];
  },

  async create(args: { data: any; include?: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("publications").insert(payload).select("*") as any).single();
    if (error) err(error, "publication.create");
    return data;
  },

  async update(args: { where: any; data: any }): Promise<any> {
    const { data, error } = await (sb().from("publications").update({ ...args.data, updatedAt: now() }).eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "publication.update");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("publications").select("id", { count: "exact", head: true });
    if (args?.where?.isApproved !== undefined) q = q.eq("isApproved", args.where.isApproved);
    const { count, error } = await q;
    if (error) err(error, "publication.count");
    return count || 0;
  },

  async delete(args: { where: any }): Promise<any> {
    const { data, error } = await (sb().from("publications").delete().eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "publication.delete");
    return data;
  },
};

// ── Project ───────────────────────────────────────────────────────────────────

const project = {
  async findUnique(args: { where: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.creator) select += ", creator:researchers(*, user:users(*))";
    if (args.include?.members) select += ", members:project_members(*, researcher:researchers(*, user:users(*)))";
    
    const { data, error } = await (sb().from("projects").select(select as any).eq("id", args.where.id) as any).maybeSingle();
    if (error) err(error, "project.findUnique");
    if (!data) return null;
    if (args.include?.creator && Array.isArray(data.creator)) data.creator = data.creator[0] || null;
    return data;
  },

  async findMany(args?: { where?: any; include?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let select = "*";
    if (args?.include?.creator) select += ", creator:researchers(*, user:users(*))";
    if (args?.include?.members) select += ", members:project_members(*, researcher:researchers(*))";
    
    let q: any = sb().from("projects").select(select as any);
    if (args?.where?.creatorId) q = q.eq("creatorId", args.where.creatorId);
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    if (args?.skip && args?.take) q = q.range(args.skip, args.skip + args.take - 1);
    
    const { data, error } = await q;
    if (error) err(error, "project.findMany");
    if (data && args?.include?.creator) {
      for (const item of data) {
        if (Array.isArray(item.creator)) {
          item.creator = item.creator[0] || null;
        }
      }
    }
    return data || [];
  },

  async create(args: { data: any; include?: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("projects").insert(payload).select("*") as any).single();
    if (error) err(error, "project.create");
    return data;
  },

  async update(args: { where: any; data: any; include?: any }): Promise<any> {
    const { data, error } = await (sb().from("projects").update({ ...args.data, updatedAt: now() }).eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "project.update");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("projects").select("id", { count: "exact", head: true });
    if (args?.where?.creatorId) q = q.eq("creatorId", args.where.creatorId);
    const { count, error } = await q;
    if (error) err(error, "project.count");
    return count || 0;
  },

  async delete(args: { where: any }): Promise<any> {
    const { data, error } = await (sb().from("projects").delete().eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "project.delete");
    return data;
  },
};

// ── ProjectMember ─────────────────────────────────────────────────────────────

const projectMember = {
  async findUnique(args: { where: any; include?: any }): Promise<any> {
    let select = "*";
    if (args.include?.researcher) select += ", researcher:researchers(*)";
    
    let q: any = sb().from("project_members").select(select as any);
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.projectId_researcherId) {
      q = q.eq("projectId", args.where.projectId_researcherId.projectId)
           .eq("researcherId", args.where.projectId_researcherId.researcherId);
    }
    
    const { data, error } = await q.maybeSingle();
    if (error) err(error, "projectMember.findUnique");
    return data || null;
  },

  async findMany(args?: { where?: any; include?: any }): Promise<any[]> {
    let select = "*";
    if (args?.include?.researcher) select += ", researcher:researchers(*, user:users(*))";
    if (args?.include?.project) select += ", project:projects(*)";
    
    let q: any = sb().from("project_members").select(select as any);
    if (args?.where?.researcherId) q = q.eq("researcherId", args.where.researcherId);
    if (args?.where?.projectId) q = q.eq("projectId", args.where.projectId);
    
    const { data, error } = await q;
    if (error) err(error, "projectMember.findMany");
    return data || [];
  },

  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), joinedAt: now() };
    const { data, error } = await (sb().from("project_members").insert(payload).select("*") as any).single();
    if (error) err(error, "projectMember.create");
    return data;
  },

  async delete(args: { where: any }): Promise<any> {
    let q: any = sb().from("project_members").delete().select("*");
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.projectId_researcherId) {
      q = q.eq("projectId", args.where.projectId_researcherId.projectId)
           .eq("researcherId", args.where.projectId_researcherId.researcherId);
    }
    const { data, error } = await q.single();
    if (error) err(error, "projectMember.delete");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("project_members").select("id", { count: "exact", head: true });
    if (args?.where?.projectId) q = q.eq("projectId", args.where.projectId);
    const { count, error } = await q;
    if (error) err(error, "projectMember.count");
    return count || 0;
  },
};

// ── FellowshipApplication ──────────────────────────────────────────────────────

const fellowshipApplication = {
  async findMany(args?: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let q: any = sb().from("fellowship_applications").select("*");
    if (args?.where?.status) q = q.eq("status", args.where.status);
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "fellowshipApplication.findMany");
    return data || [];
  },

  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("fellowship_applications").insert(payload).select("*") as any).single();
    if (error) err(error, "fellowshipApplication.create");
    return data;
  },

  async update(args: { where: any; data: any }): Promise<any> {
    const { data, error } = await (sb().from("fellowship_applications").update({ ...args.data, updatedAt: now() }).eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "fellowshipApplication.update");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("fellowship_applications").select("id", { count: "exact", head: true });
    if (args?.where?.status) q = q.eq("status", args.where.status);
    const { count, error } = await q;
    if (error) err(error, "fellowshipApplication.count");
    return count || 0;
  },
};

// ── AmbassadorApplication ─────────────────────────────────────────────────────

const ambassadorApplication = {
  async findMany(args?: { where?: any; orderBy?: any; skip?: number; take?: number }): Promise<any[]> {
    let q: any = sb().from("ambassador_applications").select("*");
    if (args?.where?.status) q = q.eq("status", args.where.status);
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "ambassadorApplication.findMany");
    return data || [];
  },

  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now(), updatedAt: now() };
    const { data, error } = await (sb().from("ambassador_applications").insert(payload).select("*") as any).single();
    if (error) err(error, "ambassadorApplication.create");
    return data;
  },

  async update(args: { where: any; data: any }): Promise<any> {
    const { data, error } = await (sb().from("ambassador_applications").update({ ...args.data, updatedAt: now() }).eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "ambassadorApplication.update");
    return data;
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("ambassador_applications").select("id", { count: "exact", head: true });
    if (args?.where?.status) q = q.eq("status", args.where.status);
    const { count, error } = await q;
    if (error) err(error, "ambassadorApplication.count");
    return count || 0;
  },
};

// ── Notification ──────────────────────────────────────────────────────────────

const notification = {
  async findMany(args?: { where?: any; orderBy?: any; take?: number }): Promise<any[]> {
    let q: any = sb().from("notifications").select("*");
    if (args?.where?.userId) q = q.eq("userId", args.where.userId);
    if (args?.where?.isRead !== undefined) q = q.eq("isRead", args.where.isRead);
    if (args?.orderBy?.createdAt) q = q.order("createdAt", { ascending: args.orderBy.createdAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "notification.findMany");
    return data || [];
  },

  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), createdAt: now() };
    const { data, error } = await (sb().from("notifications").insert(payload).select("*") as any).single();
    if (error) err(error, "notification.create");
    return data;
  },

  async updateMany(args: { where?: any; data: any }): Promise<{ count: number }> {
    let q: any = sb().from("notifications").update(args.data);
    if (args.where?.userId) q = q.eq("userId", args.where.userId);
    const { error, count } = await q;
    if (error) err(error, "notification.updateMany");
    return { count: count || 0 };
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("notifications").select("id", { count: "exact", head: true });
    if (args?.where?.userId) q = q.eq("userId", args.where.userId);
    if (args?.where?.isRead !== undefined) q = q.eq("isRead", args.where.isRead);
    const { count, error } = await q;
    if (error) err(error, "notification.count");
    return count || 0;
  },
};

// ── EmailLog ──────────────────────────────────────────────────────────────────

const emailLog = {
  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), sentAt: now() };
    const { data, error } = await (sb().from("email_logs").insert(payload).select("*") as any).single();
    if (error) err(error, "emailLog.create");
    return data;
  },

  async update(args: { where: any; data: any }): Promise<any> {
    const { data, error } = await (sb().from("email_logs").update(args.data).eq("id", args.where.id).select("*") as any).single();
    if (error) err(error, "emailLog.update");
    return data;
  },

  async findMany(args?: { orderBy?: any; take?: number }): Promise<any[]> {
    let q: any = sb().from("email_logs").select("*");
    if (args?.orderBy?.sentAt) q = q.order("sentAt", { ascending: args.orderBy.sentAt === "asc" });
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "emailLog.findMany");
    return data || [];
  },
};

// ── TrainingProgress ──────────────────────────────────────────────────────────

const trainingProgress = {
  async findUnique(args: { where: any }): Promise<any> {
    let q: any = sb().from("training_progress").select("*");
    if (args.where.id) q = q.eq("id", args.where.id);
    if (args.where.userId_moduleIndex) {
      q = q.eq("userId", args.where.userId_moduleIndex.userId)
           .eq("moduleIndex", args.where.userId_moduleIndex.moduleIndex);
    }
    const { data, error } = await q.maybeSingle();
    if (error) err(error, "trainingProgress.findUnique");
    return data || null;
  },

  async findMany(args?: { where?: any; orderBy?: any }): Promise<any[]> {
    let q: any = sb().from("training_progress").select("*");
    if (args?.where?.userId) q = q.eq("userId", args.where.userId);
    if (args?.where?.isCompleted !== undefined) q = q.eq("isCompleted", args.where.isCompleted);
    if (args?.orderBy?.moduleIndex) q = q.order("moduleIndex", { ascending: true });
    const { data, error } = await q;
    if (error) err(error, "trainingProgress.findMany");
    return data || [];
  },

  async upsert(args: { where: any; create: any; update: any }): Promise<any> {
    // Try to find existing
    const existing = await this.findUnique({ where: args.where });
    if (existing) {
      let q: any = sb().from("training_progress").update({ ...args.update, updatedAt: now() });
      if (args.where.userId_moduleIndex) {
        q = q.eq("userId", args.where.userId_moduleIndex.userId)
             .eq("moduleIndex", args.where.userId_moduleIndex.moduleIndex);
      }
      const { data, error } = await (q.select("*") as any).single();
      if (error) err(error, "trainingProgress.upsert.update");
      return data;
    } else {
      const payload = { ...args.create, id: uuid(), updatedAt: now() };
      const { data, error } = await (sb().from("training_progress").insert(payload).select("*") as any).single();
      if (error) err(error, "trainingProgress.upsert.create");
      return data;
    }
  },

  async count(args?: { where?: any }): Promise<number> {
    let q: any = sb().from("training_progress").select("id", { count: "exact", head: true });
    if (args?.where?.userId) q = q.eq("userId", args.where.userId);
    if (args?.where?.isCompleted !== undefined) q = q.eq("isCompleted", args.where.isCompleted);
    const { count, error } = await q;
    if (error) err(error, "trainingProgress.count");
    return count || 0;
  },
};

// ── Certificate ───────────────────────────────────────────────────────────────

const certificate = {
  async findUnique(args: { where: any }): Promise<any> {
    let q: any = sb().from("certificates").select("*");
    if (args.where.userId) q = q.eq("userId", args.where.userId);
    if (args.where.certHash) q = q.eq("certHash", args.where.certHash);
    if (args.where.id) q = q.eq("id", args.where.id);
    const { data, error } = await q.maybeSingle();
    if (error) err(error, "certificate.findUnique");
    return data || null;
  },

  async create(args: { data: any }): Promise<any> {
    const payload = { ...args.data, id: args.data.id || uuid(), issuedAt: now() };
    const { data, error } = await (sb().from("certificates").insert(payload).select("*") as any).single();
    if (error) err(error, "certificate.create");
    return data;
  },

  async findMany(args?: { orderBy?: any; take?: number }): Promise<any[]> {
    let q: any = sb().from("certificates").select("*");
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "certificate.findMany");
    return data || [];
  },

  async count(): Promise<number> {
    const { count, error } = await (sb().from("certificates").select("id", { count: "exact", head: true }) as any);
    if (error) err(error, "certificate.count");
    return count || 0;
  },
};

// ── Institution ───────────────────────────────────────────────────────────────

const institution = {
  async findMany(args?: { orderBy?: any; take?: number }): Promise<any[]> {
    let q: any = sb().from("institutions").select("*");
    if (args?.take) q = q.limit(args.take);
    const { data, error } = await q;
    if (error) err(error, "institution.findMany");
    return data || [];
  },

  async count(): Promise<number> {
    const { count, error } = await (sb().from("institutions").select("id", { count: "exact", head: true }) as any);
    if (error) err(error, "institution.count");
    return count || 0;
  },
};

// ── Main export ───────────────────────────────────────────────────────────────

export const db = {
  user,
  researcher,
  publication,
  project,
  projectMember,
  fellowshipApplication,
  ambassadorApplication,
  notification,
  emailLog,
  trainingProgress,
  certificate,
  institution,
};

// Backward-compatible alias (drop-in replacement for `import { prisma } from "@/lib/db"`)
export const prisma = db;
