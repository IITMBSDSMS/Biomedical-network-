import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOtpEmail } from "@/lib/mail";

const OTP_SALT = "healix-biolabs-otp-salt-2026";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing email or name" }, { status: 400 });
    }

    // Generate 6-digit numeric OTP code
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Hash the OTP with salt for secure client validation
    const otpHash = crypto.createHash("sha256").update(otp + OTP_SALT).digest("hex");

    // Send the email
    const mailResult = await sendOtpEmail(email, name, otp);

    if (!mailResult.success) {
      console.log(`\n==================================================`);
      console.log(`[Resend Sandbox Fallback] OTP Email to ${email} failed.`);
      console.log(`Your generated OTP code is: ${otp}`);
      console.log(`==================================================\n`);

      return NextResponse.json({
        success: false,
        error: "Resend sandbox restrictions: only verified emails in the Resend account can receive emails in sandbox mode.",
        otpHash,
        devOtp: otp
      });
    }

    return NextResponse.json({ success: true, otpHash });
  } catch (error: any) {
    console.error("Failed to generate and send OTP:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
