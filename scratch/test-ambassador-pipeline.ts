import { spawn, ChildProcess } from "child_process";
import fs from "fs";
import path from "path";
import { chromium, Page } from "playwright";
import { createClient } from "@supabase/supabase-js";

// Helper to manually load .env file
function loadEnv() {
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
    console.log("✅ Successfully loaded environment variables from .env file.");
  } else {
    console.warn("⚠️ Warning: .env file not found at path:", envPath);
  }
}

// Load environment variables
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_EMAIL = "e2e-ambassador@student.edu";
const TEST_NAME = "E2E Test Ambassador";
const TEST_COLLEGE = "VIT Vellore";
const TEST_DEGREE = "B.Tech Biotechnology";
const TEST_YEAR = "3rd Year";
const TEST_SOP = "I want to lead the chapter at my college and build bioinformatics research events.";
const TEST_LINKEDIN = "https://linkedin.com/in/e2e-ambassador";

// Helper to delay execution
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let browserInstance: any = null;
  let page: Page | null = null;

  try {
    console.log("🌐 Launching Playwright browser (headless mode)...");
    browserInstance = await chromium.launch({ headless: true });
    const context = await browserInstance.newContext({
      viewport: { width: 1440, height: 900 }
    });
    page = await context.newPage();

    // Attach console, error, and dialog listeners for debugging
    page.on("console", (msg) => {
      console.log(`[PAGE LOG]: ${msg.text()}`);
    });

    page.on("pageerror", (err) => {
      console.error(`[PAGE EXCEPTION]: ${err.message}`);
    });

    page.on("dialog", async (dialog) => {
      console.log(`[DIALOG OPENED]: type=${dialog.type()} | message=${dialog.message()}`);
      await dialog.dismiss();
    });

    page.on("request", (req) => {
      // Only log our local API or page requests to avoid clutter
      if (req.url().includes("localhost") || req.url().includes("supabase")) {
        console.log(`[NET REQ]: ${req.method()} ${req.url()}`);
      }
    });

    page.on("response", (res) => {
      if (res.url().includes("localhost") || res.url().includes("supabase")) {
        console.log(`[NET RES]: ${res.status()} ${res.url()}`);
      }
    });

    // Clean up database before starting the test in case a previous run failed
    console.log("🧹 Performing pre-test database cleanup for test user...");
    await cleanDb();

    // 1. Visit chapters page
    console.log("📖 Navigating to Chapters page...");
    await page.goto("http://localhost:3000/chapters");
    await page.waitForLoadState("networkidle");

    // 2. Click Apply Ambassador
    console.log("Clicking 'Apply Ambassador' button...");
    const applyButton = page.locator("button:has-text('Apply Ambassador')");
    await applyButton.waitFor({ state: "visible", timeout: 5000 });
    await applyButton.click();

    // 3. Fill the form in the modal
    console.log("Form modal visible. Filling in Ambassador details...");
    
    // Fill Full Name
    const nameField = page.locator("input[placeholder='e.g. Sneha Roy']");
    await nameField.waitFor({ state: "visible", timeout: 5000 });
    await nameField.fill(TEST_NAME);

    // Fill College Name
    await page.locator("input[placeholder='e.g. VIT Vellore']").fill(TEST_COLLEGE);
    // Fill Degree
    await page.locator("input[placeholder='e.g. B.Tech Biotechnology']").fill(TEST_DEGREE);
    // Select Year
    await page.locator("select").selectOption({ label: TEST_YEAR });
    // Fill Email
    await page.locator("input[placeholder='sneha.roy@student.edu']").fill(TEST_EMAIL);
    // Fill LinkedIn
    await page.locator("input[placeholder='https://linkedin.com/in/username']").fill(TEST_LINKEDIN);
    // Fill Statement of Purpose (SOP)
    await page.locator("textarea[placeholder*='Detail your leadership history']").fill(TEST_SOP);

    console.log("Submitting the ambassador application form...");
    // Give state handlers a moment to propagate, then click Submit
    await sleep(1000);
    await page.locator("button:has-text('Submit Application')").click();

    // Wait for submission request to finish and success card to be displayed
    console.log("Waiting for form submission success animation...");
    const successCard = page.locator("h4:has-text('Ambassador Profile Submitted!')");
    await successCard.waitFor({ state: "visible", timeout: 12000 });
    console.log("✅ Ambassador application submitted successfully via UI!");

    // 4. Verify in Supabase PostgreSQL database
    console.log("🔎 Verifying application existence in Supabase database...");
    const { data: dbApplications, error: dbError } = await supabase
      .from("ambassador_applications")
      .select("*")
      .eq("email", TEST_EMAIL);

    if (dbError) throw new Error("DB Error: " + dbError.message);
    if (!dbApplications || dbApplications.length === 0) {
      throw new Error("Failure: The ambassador application was not found in the database!");
    }

    const application = dbApplications[0];
    console.log("🎉 Application verified in DB! ID:", application.id, "| Status:", application.status);
    if (application.status !== "PENDING") {
      throw new Error(`Expected initial status PENDING, got ${application.status}`);
    }

    // 5. Verify notification was created for admin users
    console.log("🔎 Verifying admin notification was created in DB...");
    const { data: notifications, error: notifError } = await supabase
      .from("notifications")
      .select("*")
      .like("message", `%${TEST_NAME}%`);

    if (notifError) throw new Error("DB Error (notifications): " + notifError.message);
    console.log(`✅ Verified: Created ${notifications?.length || 0} admin notification(s).`);

    // 6. Navigate to Login Page
    console.log("🔐 Navigating to Researcher Portal Login...");
    await page.goto("http://localhost:3000/login");
    await page.waitForLoadState("networkidle");

    console.log("Entering Administrator credentials...");
    await page.locator("input[placeholder*='Enter email']").fill("admin@biolabsresearch-healix.com");
    await page.locator("input[placeholder*='secure password']").fill("admin2026");
    
    // Click Login
    console.log("Submitting login form...");
    await page.locator("form button[type='submit']").click();

    // Wait for redirect to /admin
    console.log("Waiting for redirection to /admin...");
    await page.waitForURL("**/admin", { timeout: 45000 });
    await page.waitForLoadState("networkidle");
    console.log("✅ Logged in successfully! Reached Admin Dashboard Client.");

    // 7. Click Ambassador Applications tab
    console.log("Navigating to 'Ambassador Applications' tab...");
    const tabButton = page.locator("button:has-text('Ambassador Applications')");
    await tabButton.waitFor({ state: "visible", timeout: 5000 });
    await tabButton.click();

    // 8. Confirm our applicant shows up in the tab
    console.log(`Checking if applicant '${TEST_NAME}' is present in the list...`);
    const applicantRow = page.locator(`h4:has-text('${TEST_NAME}')`);
    await applicantRow.waitFor({ state: "visible", timeout: 5000 });
    console.log("✅ Verified: Test Ambassador shows up in the Admin management list!");

    // 9. Verify PDF Download
    console.log("Testing PDF download button...");
    const pdfButton = page.locator("button:has-text('Download PDF')");
    await pdfButton.waitFor({ state: "visible", timeout: 5000 });
    
    // Verify total count on button
    const btnText = await pdfButton.innerText();
    console.log("Button text matches count:", btnText);

    // Capture the download event
    console.log("Clicking Download PDF button and waiting for output file...");
    const [downloadEvent] = await Promise.all([
      page.waitForEvent("download"),
      pdfButton.click()
    ]);
    
    const downloadPath = await downloadEvent.path();
    const fileName = downloadEvent.suggestedFilename();
    console.log(`✅ PDF Downloaded successfully!`);
    console.log(`   File Name: ${fileName}`);
    console.log(`   Temp Path: ${downloadPath}`);

    // Verify file exists and is not empty
    const stats = fs.statSync(downloadPath);
    console.log(`   File Size: ${stats.size} bytes`);
    if (stats.size < 500) {
      throw new Error("Downloaded PDF is suspiciously small, generation might have failed.");
    }

    // 10. Approve applicant
    console.log("Testing applicant approval resolution...");
    // Find Approve button specifically under our applicant's container
    // We navigate to the parent container of the applicant name and find the Approve button
    const approveBtn = page.locator(`div:has(h4:has-text('${TEST_NAME}'))`).locator("button:has-text('Approve')").first();
    await approveBtn.waitFor({ state: "visible", timeout: 5000 });
    await approveBtn.click();

    console.log("Waiting for status update and toast notice...");
    await sleep(3000); // Wait for resolution API call to roundtrip

    // 11. Verify status updated to APPROVED in DB
    console.log("🔎 Verifying updated status in database...");
    const { data: updatedApps, error: updateErr } = await supabase
      .from("ambassador_applications")
      .select("status")
      .eq("email", TEST_EMAIL);

    if (updateErr) throw new Error("DB Error: " + updateErr.message);
    const updatedStatus = updatedApps?.[0]?.status;
    console.log("Status resolved in DB:", updatedStatus);
    if (updatedStatus !== "APPROVED") {
      throw new Error(`Expected status APPROVED, got ${updatedStatus}`);
    }
    console.log("✅ Pipeline resolution works perfectly!");

    console.log("\n⭐️ ALL E2E PIPELINE CHECKS COMPLETED SUCCESSFULLY!");

  } catch (err: any) {
    console.error("\n❌ Test Failed:", err.message);
    if (page) {
      const screenshotPath = path.join(__dirname, "failure-screenshot.png");
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Failure screenshot saved to: ${screenshotPath}`);
    }
    process.exitCode = 1;
  } finally {
    // DB Clean Up
    console.log("\n🧹 Performing final database cleanup...");
    await cleanDb();

    if (browserInstance) {
      console.log("🛑 Closing browser...");
      await browserInstance.close();
    }
  }
}

async function cleanDb() {
  try {
    // Delete test application
    const { error: appErr } = await supabase
      .from("ambassador_applications")
      .delete()
      .eq("email", TEST_EMAIL);
    if (appErr) console.warn("Db Cleanup Warn (applications):", appErr.message);

    // Delete test notifications
    const { error: notifErr } = await supabase
      .from("notifications")
      .delete()
      .like("message", `%${TEST_NAME}%`);
    if (notifErr) console.warn("Db Cleanup Warn (notifications):", notifErr.message);

    // Delete test email logs
    const { error: mailErr } = await supabase
      .from("email_logs")
      .delete()
      .eq("to", TEST_EMAIL);
    if (mailErr) console.warn("Db Cleanup Warn (emails):", mailErr.message);

    console.log("🧹 Database cleanup finished.");
  } catch (e: any) {
    console.error("Failed to run DB cleanup:", e.message);
  }
}

main();
