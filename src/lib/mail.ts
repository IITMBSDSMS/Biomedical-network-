import { Resend } from "resend";
import { prisma } from "./db";

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailParams): Promise<{ success: boolean; logId?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const isResendEnabled = apiKey && apiKey !== "re_placeholder" && apiKey.trim() !== "";
  
  if (!isResendEnabled) {
    console.warn(`[DEV/MOCK EMAIL to ${to}] Subject: ${subject}`);
    let logId = "";
    try {
      const log = await prisma.emailLog.create({
        data: {
          to,
          subject,
          body,
          status: "LOGGED",
        },
      });
      logId = log.id;
    } catch (err) {
      console.error("Failed to write to database email_logs (mock):", err);
    }
    return { success: true, logId };
  }

  let logId = "";

  // 1. Log the transaction to the database
  try {
    const log = await prisma.emailLog.create({
      data: {
        to,
        subject,
        body,
        status: "PENDING",
      },
    });
    logId = log.id;
  } catch (err) {
    console.error("Failed to write to database email_logs:", err);
  }

  // 2. Dispatch via Resend
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "Healix BioLabs <no-reply@biolabsresearch-healix.com>", // Custom verified domain
      to,
      subject,
      html: body,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (logId) {
      await prisma.emailLog.update({
        where: { id: logId },
        data: { status: "SENT" },
      });
    }
    return { success: true, logId };
  } catch (err: any) {
    console.error("Resend API delivery failed:", err);
    if (logId) {
      await prisma.emailLog.update({
        where: { id: logId },
        data: { status: "FAILED" },
      });
    }
    return { success: false, logId };
  }
}

// Concrete email templates requested in specifications
export function getWelcomeTemplate(name: string, researchId?: string, slug?: string): string {
  const host = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const actionUrl = slug ? `${host}/researcher/${slug}` : `${host}/training`;
  const actionText = slug ? "Complete Your Profile" : "Explore Training Academy";

  return `
    <div style="background-color: #030712; padding: 32px 16px; font-family: sans-serif; color: #f3f4f6;">
      <div style="max-width: 580px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(90deg, #0052D4 0%, #4364F7 50%, #F1B018 100%); height: 6px; width: 100%;"></div>
        <div style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">Welcome to <span style="color: #F1B018;">Healix BioLabs</span></h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${name}</strong>,<br><br>
            Welcome to India's premier biomedical research network! Your account is now active and verified in our database.
          </p>
          ${researchId ? `
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 4px; font-weight: bold; tracking-wider;">Verified Research ID</span>
            <strong style="font-size: 18px; color: #ffffff; font-family: monospace; letter-spacing: 1px;">${researchId}</strong>
          </div>
          ` : ""}
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            You can now participate in our Research Training & Certification program, publish white papers, and collaborate on cutting-edge biomedical projects.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${actionUrl}" style="display: inline-block; background: #4364F7; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 6px rgba(67, 100, 247, 0.2); text-transform: uppercase; letter-spacing: 0.5px;">
              ${actionText}
            </a>
          </div>
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: #64748b;">
            Healix Technologies Pvt. Ltd., New Delhi, India.
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendWelcomeEmail(to: string, name: string, researchId?: string, slug?: string) {
  try {
    const body = getWelcomeTemplate(name, researchId, slug);
    return await sendEmail({
      to,
      subject: "Welcome to Healix BioLabs Academy",
      body,
    });
  } catch (error) {
    console.error("Welcome email trigger failed:", error);
    return { success: false };
  }
}

export function getOtpTemplate(name: string, otp: string): string {
  return `
    <div style="background-color: #030712; padding: 32px 16px; font-family: sans-serif; color: #f3f4f6;">
      <div style="max-width: 500px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(90deg, #0052D4 0%, #4364F7 50%, #F1B018 100%); height: 6px; width: 100%;"></div>
        <div style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 16px; text-align: center;">Verify Your Account</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; text-align: center;">
            Dear <strong>${name}</strong>,<br><br>
            Thank you for registering on Healix BioLabs. Please use the following one-time password (OTP) to complete your signup process. This code is valid for 10 minutes.
          </p>
          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <strong style="font-size: 32px; color: #F1B018; font-family: monospace; font-weight: 800; letter-spacing: 6px; padding-left: 6px;">${otp}</strong>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin-bottom: 0;">
            If you did not initiate this request, please ignore this email.
          </p>
          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: #64748b;">
            Healix Technologies Pvt. Ltd., New Delhi, India.
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendOtpEmail(to: string, name: string, otp: string) {
  try {
    const body = getOtpTemplate(name, otp);
    return await sendEmail({
      to,
      subject: `[Healix BioLabs] Account Verification Code: ${otp}`,
      body,
    });
  } catch (error) {
    console.error("OTP email trigger failed:", error);
    return { success: false };
  }
}



export function getPublicationApprovedTemplate(title: string, authorName: string, pubId: string): string {
  const host = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  return `
    <div style="font-family: sans-serif; padding: 24px; color: #ffffff; background-color: #0A0A0A; border-radius: 12px; border: 1px solid #1E293B; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
      </div>
      <h2 style="color: #F4B400; font-family: 'Space Grotesk', sans-serif; text-align: center; margin-top: 0;">Your Publication Has Been Approved</h2>
      <p style="color: #E2E8F0;">Dear ${authorName},</p>
      <p style="color: #E2E8F0;">Congratulations! Your research publication has been reviewed and approved by the Healix BioLabs administration team.</p>
      <div style="background-color: #1E293B; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563EB;">
        <span style="font-size: 14px; text-transform: uppercase; color: #94A3B8; display: block;">Approved Work</span>
        <strong style="font-size: 16px; color: #FFFFFF;">${title}</strong>
      </div>
      <p style="color: #E2E8F0;">Your publication is now public, searchable, and fully indexed across the Healix BioLabs network.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${host}/publications/${pubId}" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Publication</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 15px; text-align: center;">
        Healix Technologies Pvt. Ltd., New Delhi, India.
      </p>
    </div>
  `;
}

export function getFellowshipReceivedTemplate(studentName: string, course: string, institution: string): string {
  return `
    <div style="font-family: sans-serif; padding: 24px; color: #ffffff; background-color: #0A0A0A; border-radius: 12px; border: 1px solid #1E293B; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
      </div>
      <h2 style="color: #F4B400; font-family: 'Space Grotesk', sans-serif; text-align: center; margin-top: 0;">Application Successfully Received</h2>
      <p style="color: #E2E8F0;">Dear ${studentName},</p>
      <p style="color: #E2E8F0;">We have successfully received your application for the Healix Research Fellowship.</p>
      <div style="background-color: #1E293B; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563EB;">
        <p style="margin: 0; color: #E2E8F0; font-size: 14px;"><strong>Applied Course:</strong> ${course}</p>
        <p style="margin: 5px 0 0 0; color: #E2E8F0; font-size: 14px;"><strong>Institution:</strong> ${institution}</p>
      </div>
      <p style="color: #E2E8F0;"><strong>Review Timeline:</strong> Applications are reviewed on a rolling basis. Our academic review board will evaluate your statement of purpose and credentials. You can expect an update on your dashboard or email within 14 business days.</p>
      <p style="color: #E2E8F0;">Thank you for your interest in advancing biomedical research with Healix BioLabs.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 15px; text-align: center;">
        Healix Technologies Pvt. Ltd., New Delhi, India.
      </p>
    </div>
  `;
}

export function getIncompleteProfileReminderTemplate(name: string, slug: string): string {
  const host = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  return `
    <div style="font-family: sans-serif; padding: 24px; color: #ffffff; background-color: #0A0A0A; border-radius: 12px; border: 1px solid #1E293B; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
      </div>
      <h2 style="color: #F4B400; font-family: 'Space Grotesk', sans-serif; text-align: center; margin-top: 0;">Complete Your Healix BioLabs Profile</h2>
      <p style="color: #E2E8F0;">Hi ${name},</p>
      <p style="color: #E2E8F0;">It has been 3 days since you joined Healix BioLabs! We noticed that your profile is still incomplete.</p>
      <p style="color: #E2E8F0;">Adding your biography, research interests, and links to your publication index helps institutions and collaborators discover your expertise.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${host}/researcher/${slug}" style="display: inline-block; background-color: #F4B400; color: #0A0A0A; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to My Profile</a>
      </div>
      <p style="margin-top: 30px; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; padding-top: 15px; text-align: center;">
        Healix Technologies Pvt. Ltd., New Delhi, India.
      </p>
    </div>
  `;
}

export function getChapterRegistrationTemplate(
  proposerName: string,
  collegeName: string,
  department: string,
  location: string,
  proposedMentor?: string,
  plannedActivities?: string
): string {
  return `
    <div style="background-color: #030712; padding: 32px 16px; font-family: sans-serif; color: #f3f4f6;">
      <div style="max-width: 580px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); height: 6px; width: 100%;"></div>
        <div style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">Chapter Proposal Received</h2>
          <p style="color: #3b82f6; font-size: 12px; font-weight: bold; text-align: center; text-transform: uppercase; tracking-wider; margin-bottom: 24px;">Academic Division Application</p>
          
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${proposerName}</strong>,<br><br>
            Thank you for submitting a proposal to establish an official Healix BioLabs Chapter at your institution. We are excited about the prospect of collaborating with you to foster biomedical research and training.
          </p>

          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px; font-weight: bold;">Proposal Details</span>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>Institution:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${collegeName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Department:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${department}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Location:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${location}</td>
              </tr>
              ${proposedMentor ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Proposed Mentor:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${proposedMentor}</td>
              </tr>
              ` : ""}
            </table>
          </div>

          ${plannedActivities ? `
          <div style="background: #0a0f1d; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: left;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 6px; font-weight: bold;">Planned Activities</span>
            <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5;">${plannedActivities}</p>
          </div>
          ` : ""}

          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <strong>Next Steps:</strong> Our Academic Board will review your proposal, verify your institutional affiliation, and evaluate the suggested activities within 7 business days. We will contact you at your provided email to coordinate further.
          </p>

          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: #64748b;">
            Healix Technologies Pvt. Ltd., New Delhi, India.
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendChapterRegistrationEmail(
  to: string,
  proposerName: string,
  collegeName: string,
  department: string,
  location: string,
  proposedMentor?: string,
  plannedActivities?: string
) {
  try {
    const body = getChapterRegistrationTemplate(proposerName, collegeName, department, location, proposedMentor, plannedActivities);
    return await sendEmail({
      to,
      subject: `[Healix BioLabs] Chapter Proposal Received: ${collegeName}`,
      body,
    });
  } catch (error) {
    console.error("Chapter email trigger failed:", error);
    return { success: false };
  }
}

export function getAmbassadorApplicationTemplate(
  fullName: string,
  collegeName: string,
  degreeProgram?: string,
  yearOfStudy?: string,
  linkedin?: string,
  sop?: string
): string {
  return `
    <div style="background-color: #030712; padding: 32px 16px; font-family: sans-serif; color: #f3f4f6;">
      <div style="max-width: 580px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
        <div style="background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 50%, #10B981 100%); height: 6px; width: 100%;"></div>
        <div style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src="https://biolabsresearch-healix.com/logo.png" alt="Healix BioLabs" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #1e293b; background-color: #020617; padding: 2px; display: inline-block;" />
        </div>
        <div style="padding: 0 32px 32px 32px;">
          <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 8px; text-align: center;">Ambassador Application Received</h2>
          <p style="color: #a78bfa; font-size: 12px; font-weight: bold; text-align: center; text-transform: uppercase; tracking-wider; margin-bottom: 24px;">Campus Leader Candidacy</p>
          
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${fullName}</strong>,<br><br>
            Thank you for applying to represent Healix BioLabs as a Campus Ambassador. Campus Leaders play a critical role in bringing high-throughput bioinformatics, computational research, and community-driven hacking to universities.
          </p>

          <div style="background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 8px; font-weight: bold;">Applicant Profile</span>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>Institution:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${collegeName}</td>
              </tr>
              ${degreeProgram ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Degree Program:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${degreeProgram}</td>
              </tr>
              ` : ""}
              ${yearOfStudy ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Year of Study:</strong></td>
                <td style="padding: 6px 0; color: #ffffff;">${yearOfStudy}</td>
              </tr>
              ` : ""}
              ${linkedin ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>LinkedIn:</strong></td>
                <td style="padding: 6px 0; color: #ffffff; word-break: break-all;">${linkedin}</td>
              </tr>
              ` : ""}
            </table>
          </div>

          ${sop ? `
          <div style="background: #0a0f1d; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: left;">
            <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 6px; font-weight: bold;">Statement of Purpose Summary</span>
            <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.5; font-style: italic;">"${sop}"</p>
          </div>
          ` : ""}

          <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <strong>Next Steps:</strong> Our Community Coordination Team will evaluate your application materials. Outstanding applicants will be invited to a brief video interview to discuss club structure.
          </p>

          <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 11px; color: #64748b;">
            Healix Technologies Pvt. Ltd., New Delhi, India.
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function sendAmbassadorApplicationEmail(
  to: string,
  fullName: string,
  collegeName: string,
  degreeProgram?: string,
  yearOfStudy?: string,
  linkedin?: string,
  sop?: string
) {
  try {
    const body = getAmbassadorApplicationTemplate(fullName, collegeName, degreeProgram, yearOfStudy, linkedin, sop);
    return await sendEmail({
      to,
      subject: `[Healix BioLabs] Ambassador Application Received: ${fullName}`,
      body,
    });
  } catch (error) {
    console.error("Ambassador email trigger failed:", error);
    return { success: false };
  }
}

