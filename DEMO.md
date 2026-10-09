# Namma City — Hackathon Demonstration Guide

## 🎬 3-Minute Live Presentation Walkthrough

Follow this step-by-step path to demonstrate the complete unified civic lifecycle:

### Step 1: Splash & Brand Experience
1. Open `http://localhost:3000/`.
2. Notice the authentic Vidhana Soudha and Bengaluru urban skyline SVG illustration.
3. Observe the progressive brand reveal: **"Cleaner • Safer • Better Together"**.
4. The application auto-advances to the Home screen (or click "Enter City Portal").

### Step 2: Unified Discovery & Home
1. Point out the top bar: **📍 Bengaluru** selector, notification badge, and avatar **Y**.
2. Contextual greeting: **"Good morning, Yashas"**.
3. View the 3×3 quick services grid matching the reference image.
4. Note the **Clean City Happy Citizens** informational banner.

### Step 3: Reporting an Issue (End-to-End)
1. Tap **Report Issue** (or the banner) to open Screen 4.
2. Select **Roads & Footpaths** from the 9-category grid.
3. Review the uploaded photo thumbnail and character count (0/500).
4. Tap **Next: Add Location →** to open Screen 5.
5. On the interactive map, show the draggable Civic Teal pin centered at Koramangala 5th Block.
6. Tap **Next: Review →** to open Screen 6.
7. Tap **Submit Request**.
8. Notice the instant generation of a unique public ID (e.g. `#REQ-XXXX`) and redirection to the tracking view!

### Step 4: Staff Lifecycle Updates & Real-Time Sync
1. On desktop, click **Staff Portal** (or switch role to **Staff**).
2. Open the newly submitted complaint.
3. Update the status from `SUBMITTED` to `IN_PROGRESS` or `RESOLVED` with an official note: *"Asphalt road repair completed by Ward 151 road crew."*
4. Click **Publish Official Status Update**.
5. Switch back to **Citizen** role and open the **Notifications** or **My Requests** view.
6. The updated status timeline and in-app notification are immediately visible!

### Step 5: Demonstration Utility Payment
1. From the bottom navigation or home grid, open **Pay Bills** (Screen 7).
2. Select **Electricity** (BESCOM) with consumer number `1234567890`.
3. Highlight the bill card: **₹ 1,240**, Due Date, and the red **Due in 5 days** alert badge.
4. Tap **Pay Now**.
5. Screen 8 appears with the green success checkmark and receipt summary card.
6. Tap **View Receipt** to display the official printable verification receipt.

### Step 6: Nearby Civic Amenities
1. Tap **Services** in bottom bar → **Nearby Municipal Offices** (Screen 11).
2. Filter between **Municipal Offices**, **Hospitals**, and **Police Stations**.
3. Point out approximate distances (0.8 km, 1.2 km) and **Open now** badges.

---

## 🔄 Quick Demo Reset Command
To reset all data back to the clean reference state:
```bash
npm run prisma:seed --workspace=@namma-city/database
```
