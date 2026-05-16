import { useState, useEffect, useRef } from "react";

const STORE_KEY = "clutch-launch-v1";

const DEFAULT_SETUP_CHECKLIST = [
  { category: "Facility & Space", items: [
    { id: "s1", text: "Keys / access codes distributed to team leads", done: false, note: "" },
    { id: "s2", text: "Signage installed (exterior + interior wayfinding)", done: false, note: "" },
    { id: "s3", text: "Customer parking clearly marked", done: false, note: "" },
    { id: "s4", text: "Delivery / vehicle staging area defined", done: false, note: "" },
    { id: "s5", text: "Washrooms stocked & operational", done: false, note: "" },
    { id: "s6", text: "HVAC / lighting tested and working", done: false, note: "" },
    { id: "s7", text: "Cleaning supplies & garbage bins in place", done: false, note: "" },
  ]},
  { category: "Technology & Systems", items: [
    { id: "t1", text: "Wi-Fi operational (staff + customer networks)", done: false, note: "" },
    { id: "t2", text: "POS / payment terminal tested with live transaction", done: false, note: "" },
    { id: "t3", text: "Staff devices (tablets/laptops) provisioned & logged in", done: false, note: "" },
    { id: "t4", text: "Phone system / IVR routing configured", done: false, note: "" },
    { id: "t5", text: "Scheduling tool access granted to all team members", done: false, note: "" },
    { id: "t6", text: "CRM / appointment system live and accepting bookings", done: false, note: "" },
    { id: "t7", text: "Security cameras operational & recording", done: false, note: "" },
  ]},
  { category: "Inventory & Vehicles", items: [
    { id: "v1", text: "Opening vehicle inventory delivered and staged", done: false, note: "" },
    { id: "v2", text: "Vehicle detail / wash bay set up", done: false, note: "" },
    { id: "v3", text: "Key management system in place (lockbox / tracker)", done: false, note: "" },
    { id: "v4", text: "Vehicle inspection checklists printed / accessible", done: false, note: "" },
    { id: "v5", text: "Test drive route mapped and documented", done: false, note: "" },
  ]},
  { category: "Compliance & Safety", items: [
    { id: "c1", text: "Business license displayed", done: false, note: "" },
    { id: "c2", text: "Fire extinguishers inspected & accessible", done: false, note: "" },
    { id: "c3", text: "First aid kit stocked and visible", done: false, note: "" },
    { id: "c4", text: "Emergency exits marked and unobstructed", done: false, note: "" },
    { id: "c5", text: "AODA / accessibility requirements met", done: false, note: "" },
  ]},
  { category: "Customer Experience", items: [
    { id: "x1", text: "Welcome / waiting area set up (seating, water, chargers)", done: false, note: "" },
    { id: "x2", text: "Delivery bay / handover area staged and photo-ready", done: false, note: "" },
    { id: "x3", text: "Branded materials available (business cards, brochures)", done: false, note: "" },
    { id: "x4", text: "Google Business Profile live with correct hours & photos", done: false, note: "" },
    { id: "x5", text: "Review generation flow tested (QR code / NFC tap)", done: false, note: "" },
  ]},
  { category: "Store Supplies", items: [
    { id: "nso1", text: "Coffee machine (espresso) — 1 unit", done: false, note: "Order with Miller & Bean or equivalent · ~$5,000" },
    { id: "nso2", text: "Coffee beans — 1 case (20)", done: false, note: "Order with Miller & Bean or equivalent · ~$430" },
    { id: "nso3", text: "Tea — 1-2 boxes each flavour", done: false, note: "Order with Miller & Bean or equivalent · ~$126" },
    { id: "nso4", text: "Sugar & sweetener — 1-2 boxes", done: false, note: "Order with Miller & Bean or equivalent · ~$45" },
    { id: "nso5", text: "Stir sticks — 1 box", done: false, note: "Order with Miller & Bean or equivalent · ~$13" },
    { id: "nso6", text: "Customer snacks — 1-2 boxes each snack", done: false, note: "Order from Costco or equivalent · ~$160" },
    { id: "nso7", text: "Fridge — 1 unit", done: false, note: "Amazon · ~$400" },
    { id: "nso8", text: "Long expiration milk — 2 cases (6 each)", done: false, note: "Order with Miller & Bean or equivalent · ~$65" },
    { id: "nso9", text: "Milk system cleaner — 2 units", done: false, note: "Order with Miller & Bean or equivalent · ~$64" },
    { id: "nso10", text: "Tea organizer — 1 unit", done: false, note: "Amazon · ~$34" },
    { id: "nso11", text: "Snack containers — 1 per snack type", done: false, note: "Ikea or similar · ~$20" },
    { id: "nso12", text: "Garbage bin — 1 unit", done: false, note: "Amazon · ~$210" },
  ]},
  { category: "STC (Sell-to-Clutch)", items: [
    { id: "stc1", text: "STC intake area designated and set up", done: false, note: "" },
    { id: "stc2", text: "STC inspection process documented and printed", done: false, note: "" },
    { id: "stc3", text: "STC pricing tools configured and tested", done: false, note: "" },
    { id: "stc4", text: "STC appointment slots open in booking system", done: false, note: "" },
    { id: "stc5", text: "STC signage visible to walk-in customers", done: false, note: "" },
    { id: "stc6", text: "STC paperwork / contract templates ready", done: false, note: "" },
    { id: "stc7", text: "Team trained on STC intake flow (CLUTCH steps)", done: false, note: "" },
    { id: "stc8", text: "STC vehicle staging / hold area identified", done: false, note: "" },
  ]},
  { category: "Retail Sales", items: [
    { id: "rs1", text: "Lead capture process set up and tested", done: false, note: "Name, email, phone, consent, notes" },
    { id: "rs2", text: "Walk-in greeting flow documented", done: false, note: "" },
    { id: "rs3", text: "Financing information sheets / FAQ printed", done: false, note: "" },
    { id: "rs4", text: "Delivery / handover process documented", done: false, note: "" },
    { id: "rs5", text: "Appointment scheduling live and tested", done: false, note: "" },
    { id: "rs6", text: "Test drive process & waiver forms ready", done: false, note: "" },
    { id: "rs7", text: "Point Guard scheduling system configured", done: false, note: "" },
    { id: "rs8", text: "Sales KPI targets set for opening week", done: false, note: "Lead Capture, Activity Rate, Google Reviews" },
  ]},
  { category: "Clutch Brand", items: [
    { id: "cb1", text: "All exterior signage matches Clutch brand guidelines", done: false, note: "Logo, Big C, Clutch Red" },
    { id: "cb2", text: "Interior branding consistent (wall decals, posters, screens)", done: false, note: "" },
    { id: "cb3", text: "Uniforms distributed to all team members", done: false, note: "Red polo/sweater for FS, lanyard required" },
    { id: "cb4", text: "Lanyards and badges issued — no alterations", done: false, note: "" },
    { id: "cb5", text: "Clutch fleet vehicles clean, branded, and staged", done: false, note: "Flatbed always Clutch Red, always sharp" },
    { id: "cb6", text: "Digital screens showing Clutch content / inventory", done: false, note: "" },
    { id: "cb7", text: "Brand training completed by all team members", done: false, note: "Bamboo quiz — 85% or higher to pass" },
    { id: "cb8", text: "Professional conduct standards reviewed", done: false, note: "No hoodies, no earbuds, no gum during interactions" },
    { id: "cb9", text: "Credo (Vision, Mission, Promise, Values) posted", done: false, note: "" },
  ]},
];

const DEFAULT_TRAINING_PLAN = [
  { day: 1, theme: "Culture & Foundations", blocks: [
    { id: "tr1", time: "9:00–10:30", title: "Welcome & Clutch Culture", description: "Mission, values, what makes Clutch different. Set expectations for the opening period.", done: false },
    { id: "tr2", time: "10:30–12:00", title: "Store Tour & Systems Orientation", description: "Walk the space, show every system, login to every tool. Hands-on, not slides.", done: false },
    { id: "tr3", time: "1:00–2:30", title: "Customer Journey Walkthrough", description: "Walk through the full customer experience from booking to delivery. Role-play each handoff.", done: false },
    { id: "tr4", time: "2:30–4:00", title: "Role Clarity & Daily Rhythm", description: "Who does what, when. Introduce the daily structure and KPIs that matter.", done: false },
  ]},
  { day: 2, theme: "Skills & Scenarios", blocks: [
    { id: "tr5", time: "9:00–10:30", title: "Appointment & Walk-in Flow", description: "How to greet, qualify, and manage customer flow. Practice the first 60 seconds.", done: false },
    { id: "tr6", time: "10:30–12:00", title: "Vehicle Presentation & Test Drives", description: "How to present a car with confidence. Test drive safety and route. Live practice with real vehicles.", done: false },
    { id: "tr7", time: "1:00–2:30", title: "Objection Handling & Tough Scenarios", description: "Price concerns, trade-in disputes, warranty questions. Role-play with real scripts.", done: false },
    { id: "tr8", time: "2:30–4:00", title: "Delivery Excellence", description: "The handover moment. How to make it memorable. Practice the full delivery flow end to end.", done: false },
  ]},
  { day: 3, theme: "Dress Rehearsal", blocks: [
    { id: "tr9", time: "9:00–10:30", title: "Full Simulation — Morning Rush", description: "Simulate a busy morning: walk-ins, appointments, phone calls. Team runs it, leads observe.", done: false },
    { id: "tr10", time: "10:30–12:00", title: "Debrief & Gap Review", description: "What worked, what didn't. Identify the 2–3 biggest risks before opening.", done: false },
    { id: "tr11", time: "1:00–2:30", title: "Fix & Refine", description: "Address gaps from the morning sim. Re-run any weak areas. Final system checks.", done: false },
    { id: "tr12", time: "2:30–4:00", title: "Confidence Check & Launch Brief", description: "Each team member shares one thing they're confident about and one concern. Leader addresses all.", done: false },
  ]},
];

const DEFAULT_DAILY_STRUCTURE = [
  { id: "d1", time: "8:30", label: "Store open / systems on", description: "Lights, music, devices on. Check overnight messages and appointments for the day.", type: "setup" },
  { id: "d2", time: "8:45", label: "Team huddle (15 min)", description: "Yesterday's wins, today's appointments, one focus area. Keep it tight and energizing.", type: "huddle" },
  { id: "d3", time: "9:00", label: "Doors open", description: "First appointments and walk-ins. All team members in position.", type: "active" },
  { id: "d4", time: "12:00", label: "Midday pulse check", description: "Quick sync: How's the morning going? Any blockers? Adjust coverage if needed.", type: "huddle" },
  { id: "d5", time: "12:30", label: "Staggered lunches", description: "Never leave the floor uncovered. Rotate breaks.", type: "break" },
  { id: "d6", time: "3:00", label: "Afternoon push", description: "Follow up on morning test drives. Prep for any late-day deliveries.", type: "active" },
  { id: "d7", time: "5:30", label: "End-of-day debrief (15 min)", description: "What happened today? Any customer issues? What do we do differently tomorrow?", type: "huddle" },
  { id: "d8", time: "6:00", label: "Close-out", description: "Lock vehicles, secure keys, set alarm, update CRM with day's notes.", type: "setup" },
];

const AI_COACH_SCENARIOS = [
  { id: "ac1", label: "Customer arrives for pickup but their car isn't ready yet", category: "Customer", context: "CLUTCH step C-Connect: Greet warmly despite the issue. Then use AAA: Acknowledge the frustration, Align with their feelings ('I know your time is valuable'), Assure with a clear next step ('Let me check with production and update you in the next few minutes'). Step T-Take Action: Own the solution, don't pass blame." },
  { id: "ac2", label: "Customer notices a scratch or issue on their vehicle at pickup", category: "Customer", context: "Use AAA escalation: Acknowledge ('I'm sorry about that, I understand why you're disappointed'), Align ('I'd feel the same way discovering something unexpected'), Assure ('Let's document this together and I'll alert our service team immediately'). Step T-Take Action: Own it, don't deflect. Step C-Confirm: Make sure they know what happens next." },
  { id: "ac3", label: "Customer is confused about paperwork or charges they see", category: "Customer", context: "Use AAA: Acknowledge ('I understand your concern'), Align ('It's important everything is clear and correct'), Assure ('Let's review the documents together right now'). Step U-Understand: Guide with confidence, set clear expectations. Step C-Confirm: Ensure they leave feeling clear, confident, and in control." },
  { id: "ac4", label: "Walk-in customer seems hesitant and unsure why they're here", category: "Customer", context: "Step C-Connect: Greet with warmth and energy. Personalize — ask their name. Acknowledge their reason for visiting. Create comfort, not pressure. Remember: Great Experience means making customers feel right, creating connection, demonstrating empathy, and exceeding expectations. Don't jump to process." },
  { id: "ac5", label: "Customer dropping off a car is anxious about the process", category: "Customer", context: "Step C-Connect: Acknowledge their purpose warmly. Step L-Listen: Be attentive, let them share concerns fully. Step U-Understand: Guide them through each step, clarify what happens, set clear expectations ('I'll do a quick ID check, then we'll walk through the handover — about 10 minutes'). Remove friction before it arises." },
  { id: "ac6", label: "Customer asks about pricing, financing, or trade-in values", category: "Customer", context: "Your team does NOT sell or negotiate on pricing or values. Your role is creating a memorable customer experience. Step L-Listen: Hear them out fully. Step T-Take Action: Own the moment — don't dodge it. Explain clearly that your Pre-Sales specialists handle pricing and you'll connect them. Step C-Confirm: Make sure they know when to expect follow-up." },
  { id: "ac7", label: "Customer is upset and raising their voice in the store", category: "Customer", context: "Use AAA: Acknowledge (actively listen, show empathy), Align (express understanding, validate their feelings), Assure (provide a clear path forward). Remember: this approach ensures the customer feels heard and supported while guiding toward a positive resolution. It doesn't just solve the issue — it strengthens the relationship. Stay calm, don't match their energy." },
  { id: "ac8", label: "Customer picking up is excited — how to make this moment memorable", category: "Customer", context: "This is about Great Experience, not just Great Service. Great Service meets expectations; Great Experience exceeds them. The goal: 'They made me feel welcome and valued', 'I left smiling, not just satisfied'. Step H-Humanize: End with a personal farewell, use their name, reference something specific. Invite them back — for referrals, support, their next purchase. Make this a moment they share." },
  { id: "ac9", label: "Customer had a bad online experience and is skeptical in person", category: "Customer", context: "Step C-Connect: Warmth matters more here than anywhere. Step L-Listen: Let them share fully — tune into tone and body language. Are they frustrated? Guarded? Step U-Understand: Clarify, don't assume. AAA applies: Acknowledge their past experience, Align with their frustration, Assure them the in-person experience will be different. Our Promise: A car-buying and selling experience built entirely around the customer." },
  { id: "ac10", label: "Customer is happy but you forgot to check satisfaction before they leave", category: "Customer", context: "Step C-Confirm: Don't assume satisfaction — check for it. Ask: 'Did everything go as you expected today?' or 'Is there anything we could've done better?' Provide clear next steps. Step H-Humanize: End with a personal farewell. Thank them with sincerity. Confidence comes from clarity — make sure they leave knowing they're supported." },
  { id: "ac11", label: "Team member rushes through the greeting and skips personalization", category: "Team", context: "Step C-Connect requires warmth, energy, and personalization. First impressions set the stage. Body language, smile, tone matter. Moving past the script to use their name and make it feel individual is the difference between Great Service and Great Experience." },
  { id: "ac12", label: "New hire feels awkward during the handover process", category: "Team", context: "Step U-Understand: Guide with confidence. Walk through each step calmly. Even if things are complex behind the scenes, the delivery should feel smooth and effortless. Practice the CLUTCH steps until they become natural." },
  { id: "ac13", label: "Team member is being efficient but not creating connection", category: "Team", context: "Great Service = doing things right, accuracy, efficiency. Great Experience = making customers feel right, creating connection, empathy, exceeding expectations. You can have great service without great experience. The goal: customers leave saying 'they really care about me' not just 'that was fast'." },
  { id: "ac14", label: "Staff morale is dropping after day 3", category: "Team" },
  { id: "ac15", label: "Multiple cars aren't ready on time for scheduled pickups", category: "Operations", context: "Use AAA with each affected customer. Step T-Take Action: Own it, keep customers informed at every step. Step C-Confirm: Clear next steps for each person. Internally — debrief what went wrong and fix the handoff with production." },
  { id: "ac16", label: "Lead capture form/system goes down during a busy period", category: "Operations" },
  { id: "ac17", label: "Opening week foot traffic is lower than expected", category: "Strategy" },
  { id: "ac18", label: "Google reviews are coming in negative after opening", category: "Strategy", context: "Review what's being said. Are we delivering Great Experience or just Great Service? Great Experience is difficult to replicate and drives loyalty. Check: are we setting the energy? Are we humanizing the farewell? Are we confirming satisfaction before they leave?" },
  { id: "ac19", label: "Team member wearing hoodie or non-compliant clothing", category: "Brand", context: "Clutch uniform standards are strict: no hoodies, no sportswear, no shorts, no heavily branded clothing. The uniform signals we're a tech-forward team that delivers top-tier service. Clutch Red polo or sweater is primary for FS. T-shirts only for layering. Address privately, reference brand training standards." },
  { id: "ac20", label: "Staff member has AirPods in or is on phone in customer area", category: "Brand", context: "Professional conduct rules: no earbuds or phones except business-related. Be focused and fully engaged. No texting in customer areas. Remove AirPods/headphones before interactions. This is about presence — customers need to feel they have your full attention." },
  { id: "ac21", label: "Team member skips lanyard or has modified their badge", category: "Brand", context: "The lanyard and badge must be worn at all times and visible to customers — it's an instant trust signal. Bold Clutch red, clear wordmark, staff name. Must NOT be altered (no stickers, charms, pendants). It tells the world you're part of the Clutch crew." },
  { id: "ac22", label: "Store space doesn't feel 'on brand' — messy or unpolished", category: "Brand", context: "The brand is the sum of all ways we're perceived. Every touchpoint matters. 'Does this hold up to our standards?' Go above and beyond, bring 110%. The Clutch truck is always clean, always sharp — the store must match. Check the Glovebox value: sweat the details others miss." },
  { id: "ac23", label: "New hire doesn't know the Clutch values or credo", category: "Brand", context: "The credo is foundational: Vision (make complicated transactions delightfully simple), Mission (experience so exceptional customers share it), Promise (built entirely around the customer). Values: Deliver Wow, Refuse to Settle, Experiment Relentlessly, Check the Glovebox, Take Extreme Ownership, Win Together. These define culture and guide behaviour." },
];

const COACH_SYSTEM_PROMPT = `You are a Clutch retail store operations coach. You help team leads handle real situations during the first weeks of a new store launch. Clutch is a Canadian company that buys and sells used cars online — customers come to retail locations to pick up a car or drop off a car. The retail team does NOT sell, negotiate on pricing, or discuss trade-in values. Their role is entirely focused on creating a memorable customer experience.

CLUTCH IDENTITY:
- Vision: Make life's most complicated transactions delightfully simple.
- Mission: Deliver a car buying and selling experience so exceptional, our customers can't help but share it.
- Promise: A car-buying and selling experience built entirely around the customer.
- Identity: We are a tech company (that buys and sells cars). We dream big. We always deliver.
- All cars are referred to as "Clutch Certified" — the highest quality used cars trusted for quality and transparency.

GREAT SERVICE vs GREAT EXPERIENCE (this distinction is critical):
- Great Service: Doing things right, accuracy, efficiency, meeting customer needs. Driven by systems and procedures. Result: "That was fast and accurate." Easy to replicate.
- Great Experience: Making customers feel right, creating connection, demonstrating empathy, exceeding expectations. Driven by empathy and personalization. Result: "Wow, they really care about me." Difficult to replicate. Highly likely to build loyalty.
- You can have great service without great experience, but great experiences almost always include great service and go beyond it — adding empathy, personalization, and emotional resonance.
- Great Service feels like: "They answered my question", "They smiled", "They were very helpful", "They didn't make me wait."
- Great Experience feels like: "They made me feel welcome and valued", "I left smiling not just satisfied", "They remembered my name", "They made me feel heard."

CLUTCH STEPS OF SERVICE (the C-L-U-T-C-H framework):
Every customer interaction should flow through these steps:

C - CONNECT: Greet every customer with warmth and energy. Personalize — use their name whenever possible. Acknowledge their purpose for visiting (pickup, drop-off, browsing). First impressions matter: body language, smile, and tone set the stage. Move past the script and make the interaction feel individual.

L - LISTEN: Be attentive — allow the customer to share their needs fully. Ask key questions to confirm expectations. Show genuine interest in their story or situation. Tune in fully: pay attention to tone, body language, and emotions. Clarify, don't assume. Confirm their needs with thoughtful questions.

U - UNDERSTAND: Guide the customer through a seamless process. Clarify what happens at each step. Anticipate and remove friction before it arises. Guide with confidence — even if things are complex behind the scenes, make the experience feel smooth and effortless. Set clear expectations about what will happen, how long it will take, and what you need from them.

T - TAKE ACTION: Own the solution — address questions and concerns head-on. Provide clear answers or commit to finding them. Execute efficiently, keeping the customer informed at every step. Build confidence before they leave by checking in to ensure all questions were addressed. Don't shy away from questions — lean into them.

C - CONFIRM: Double-check satisfaction before closing the interaction. Provide clear next steps (documents, delivery, follow-up). Reinforce trust with transparency. Don't assume satisfaction — check for it. Ask: "Did everything go as you expected today?" Clarity eliminates confusion.

H - HUMANIZE: End with a thoughtful, personal farewell. Express appreciation for their time and trust. Invite them back — for their next purchase, referral, or support. Use their name, reference something specific from the interaction. These moments create emotional connection and long-term loyalty.

LEAD CAPTURE (for walk-ins and browsers — a subset of CLUTCH):
When capturing leads, the same CLUTCH steps apply with specific focus:
1. Connect: Warm welcome, create comfort not pressure.
2. Listen: Transition smoothly to capture Name, Email, Phone, Consent. Use casual conversation to fill Notes: buying/selling/trading? What type of car? Budget? Financing or outright? Timeline? Frame as helpful, not transactional.
3. Understand: Repeat back what you heard briefly to validate. Reassure that Pre-Sales will follow up with best options.

AAA ESCALATION MODEL (for concerns and complaints):
When a customer has a concern, use Acknowledge, Align, Assure:
- ACKNOWLEDGE: Recognize their concern by actively listening and showing empathy.
- ALIGN: Express understanding and align with their feelings. ("I would feel the same way.")
- ASSURE: Provide a clear path forward, reassuring them you'll help resolve the issue.
This approach ensures the customer feels truly heard and supported, builds trust, and guides toward a positive resolution. It doesn't just solve the issue — it strengthens the relationship.

STANDARDS:
- "Are we setting the energy?" — Buying or selling a car is a huge chapter in someone's life. Bring the energy and make sure they have a positive experience every time.
- "Does this hold up to our standards?" — Go above and beyond, bring 110% every day. Be proud of our work and confident to stand behind it.

CLUTCH BRAND & VALUES (from official Brand Training):
Our Credo — guiding beliefs and principles present in everything we do:
- Vision: Make life's most complicated transactions delightfully simple.
- Mission: Deliver a car buying and selling experience so exceptional, our customers can't help but share it.
- Promise: A car-buying and selling experience built entirely around the customer.

Our Values:
1. Deliver Wow — exceed expectations at every touchpoint
2. Refuse to Settle — always push for better
3. Experiment Relentlessly — try new things, learn fast
4. Check the Glovebox — sweat the details others miss
5. Take Extreme Ownership — own the outcome, not just the task
6. Win Together — collaborate across teams, celebrate collectively

Why this matters: The credo defines culture, enhances customer service, guides employee behaviour, motivates employees, promotes unity and collaboration, and creates structure during organizational change.

A brand is NOT just a logo — it's the sum of all the ways a company is perceived and experienced. Every interaction, every uniform, every phone call, every email IS the brand.

CLUTCH BRAND EXPRESSION:
- The "Big C" is our signature mark — like the Nike Swoosh or McDonald's M. It transforms a used car into a "Clutch Certified" car. See the C, feel the quality.
- Clutch Red is the spark — used for energy, boldness, and big moments. It's our primary identity colour.
- The Clutch truck/flatbed is our MVP — a moving billboard. Always clean, always sharp, always Clutch Red. It's trust on wheels.

UNIFORM & APPEARANCE STANDARDS:
The Clutch uniform signals what we stand for at a glance: a tech-forward team that knows cars and delivers top-tier service. Modern and streamlined, professional enough for a driveway handoff, comfortable enough for a day on the move. It unifies us, projects confidence, and assures customers they're dealing with experts.

Required at all times:
- Lanyard and badge must be worn and visible to customers at all times — it's an instant trust signal
- The lanyard/badge must NOT be altered (no stickers, charms, or pendants)

Field Specialists (Customer Facing):
- Primary: Clutch Red collared polo or sweater
- T-shirts only for layering under jacket or sweater — never worn alone
- Hi-vis jacket when required

Managers (Customer Facing):
- Primary: Polo or sweater
- T-shirts only for layering

Trousers: Smart fit, structured, stretchable/breathable (like Lululemon ABC pants). Primary colours: Navy, Black/Soft Black. Secondary: Light Grey. No sportswear.

Footwear: Clean, minimal sneakers or trainers. Neutral colours (black, white, grey). Low-profile, minimal branding, well-maintained. Winter: weather-appropriate boots in black/dark brown/grey, simple and structured.

Colour system:
- Clutch Red: Customer-facing uniform — the spark, energy, boldness
- Soft Black: Stability and balance
- Plum: Swag only, NOT uniform. Premium warmth for the brand

STRICTLY NOT PERMITTED (harms brand image):
- Hoodies
- Yoga/athletic tight pants
- Shorts
- Sweatpants/joggers (sportswear)
- Open-toed shoes/sandals
- Dirty or muddy footwear
- Creased clothing
- Heavily branded clothing

PROFESSIONAL CONDUCT DURING INTERACTIONS:
- No hats or hoods up — hides the face, breaks trust. Visibility = approachability. (FS may wear hats outside in harsh weather, but remove before customer interaction)
- No gum, food, or beverages while interacting — stay present, polished, distraction-free
- No sunglasses during interactions — eye contact = human connection. Remove eyewear before engaging
- No earbuds or phones (except business-related) — be focused and fully engaged. No texting in customer areas, remove AirPods/headphones before interactions

RULES:
- Reference the specific CLUTCH step(s) by letter and name
- For complaints, use AAA with specific language
- The team does NOT sell, negotiate pricing, or discuss values
- Push toward Great Experience over Great Service
- Give actual scripts/phrases
- For brand/uniform issues, reference specific brand training standards
- Always tie back to values (Deliver Wow, Check the Glovebox, Take Extreme Ownership, etc.) when relevant
- For conduct issues, coach privately and constructively — frame as protecting the brand, not punishing

BE CONCISE. Use this short format:
**Situation** — 1-2 sentences on what's happening (name the CLUTCH step)
**Do This** — 2-3 bullet actions
**Say This** — 1-2 ready-to-use phrases
**Prevent It** — 1 sentence

No preamble. No filler. Direct and real.`;

// ─── Utilities ───────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const deepClone = o => JSON.parse(JSON.stringify(o));
const loadState = async () => { try { const r = await window.storage.get(STORE_KEY); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const saveState = async s => { try { await window.storage.set(STORE_KEY, JSON.stringify(s)); } catch {} };

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const I = {
  check: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  checklist: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  training: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  daily: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  coach: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  debrief: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  close: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  up: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>,
  down: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  pin: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  reset: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  chevron: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  gear: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  upload: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  file: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  back: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  people: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  risk: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  bell: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  gantt: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="7" y="10" width="14" height="4" rx="1"/><rect x="5" y="16" width="10" height="4" rx="1"/></svg>,
};

const S = {
  input: { width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #DCE3EB", background:"#FFFFFF", color:"#1A2332", fontSize:13, fontFamily:"'Inter', sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color .2s" },
  textarea: { width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #DCE3EB", background:"#FFFFFF", color:"#1A2332", fontSize:13, fontFamily:"'Inter', sans-serif", resize:"vertical", outline:"none", boxSizing:"border-box", minHeight:48, transition:"border-color .2s" },
  label: { fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#8B97A8", display:"block", marginBottom:5 },
  btnPrimary: { padding:"9px 18px", borderRadius:10, background:"#E53935", color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Inter', sans-serif", letterSpacing:"0.02em", transition:"all .15s", boxShadow:"0 2px 8px rgba(229,57,53,.25)" },
  btnSecondary: { padding:"9px 18px", borderRadius:10, background:"#E4EAF0", color:"#5B6B7D", border:"1.5px solid #DCE3EB", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Inter', sans-serif", transition:"all .15s" },
  btnGhost: { background:"none", border:"none", cursor:"pointer", color:"#8B97A8", padding:5, display:"inline-flex", alignItems:"center", borderRadius:6, transition:"all .15s" },
  editToggle: a => ({ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Inter', sans-serif", letterSpacing:"0.03em", transition:"all .2s", background: a ? "rgba(229,57,53,0.06)" : "#E4EAF0", color: a ? "#E53935" : "#8B97A8", border: a ? "1.5px solid #E53935" : "1.5px solid #DCE3EB" }),
  addForm: { padding:16, borderRadius:14, background:"#E4EAF0", border:"1.5px dashed #C5CDD8", marginBottom:12 },
  addBtn: { display:"flex", alignItems:"center", gap:7, padding:"13px 18px", fontSize:13, fontWeight:700, color:"#E53935", background:"rgba(229,57,53,0.06)", border:"1.5px dashed #E53935", borderRadius:12, cursor:"pointer", fontFamily:"'Inter', sans-serif", width:"100%", transition:"all .2s" },
  addBtnSmall: { display:"flex", alignItems:"center", gap:6, padding:"9px 14px", fontSize:12, fontWeight:600, color:"#E53935", background:"none", border:"1.5px dashed #C5CDD8", borderRadius:10, cursor:"pointer", fontFamily:"'Inter', sans-serif", width:"100%", marginTop:6 },
};

function ProgressRing({ pct, size = 64, stroke = 5, color = "#E53935" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, offset = c - (pct / 100) * c;
  return (<svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#DCE3EB" strokeWidth={stroke} /><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)" }} /></svg>);
}

// ─── NOTE: Components below are identical to the running artifact ────────────
// ─── SetupChecklist, TrainingPlan, DailyStructure, AICoach, Debrief ─────────
// ─── See the live artifact (clutch-launch-system) for the full interactive version.
// ─── This file is provided as the complete source code for download/deployment.

function SetupSettings({ categories, attachments, setAttachments, onBack, setupData, setSetupData }) {
  const fileRef = useRef(null);
  const catFileRef = useRef(null);
  const [uploadingCat, setUploadingCat] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [catParsing, setCatParsing] = useState(false);
  const [parsedItems, setParsedItems] = useState([]);
  const [catResult, setCatResult] = useState(null);

  const parseFile = async (file) => {
    const items = [];
    try {
      if (file.name.endsWith('.csv') || file.name.endsWith('.tsv') || file.type === 'text/csv') {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const header = lines[0]?.toLowerCase() || '';
        const startIdx = header.includes('item') || header.includes('name') || header.includes('product') ? 1 : 0;
        for (let i = startIdx; i < Math.min(lines.length, 200); i++) {
          const cols = lines[i].split(',');
          const item = cols[0]?.trim().replace(/^"(.*)"$/, '$1');
          if (item && item.length > 1) {
            const amount = cols[1]?.trim().replace(/^"(.*)"$/, '$1') || '';
            const source = cols[2]?.trim().replace(/^"(.*)"$/, '$1') || '';
            const cost = cols[3]?.trim().replace(/^"(.*)"$/, '$1') || '';
            items.push({ item, amount, source, cost });
          }
        }
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const startIdx = rows[0]?.[0]?.toString().toLowerCase().includes('item') ? 1 : 0;
        for (let i = startIdx; i < Math.min(rows.length, 200); i++) {
          const r = rows[i];
          if (!r || !r[0]) continue;
          const item = String(r[0]).trim();
          if (item.length > 1) {
            items.push({ item, amount: String(r[1] || '').trim(), source: String(r[2] || '').trim(), cost: String(r[3] || '').trim() });
          }
        }
      }
    } catch (err) { console.error('Parse error:', err); }
    return items;
  };

  const handleGlobalUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCatParsing(true);
    setCatResult(null);
    const items = await parseFile(file);
    setParsedItems(items);
    if (catFileRef.current) catFileRef.current.value = '';

    if (items.length === 0) { setCatParsing(false); return; }

    // AI categorize
    try {
      const catNames = categories.join(', ');
      const itemList = items.map(i => `${i.item}${i.amount ? ' ('+i.amount+')' : ''}${i.cost ? ' — '+i.cost : ''}${i.source ? ' ['+i.source+']' : ''}`).join('\n');
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You categorize store opening items into setup categories. The existing categories are: ${catNames}. If an item doesn't fit any existing category, suggest a new category name. Respond ONLY in JSON, no markdown, no backticks: {"categories": {"Category Name": [{"text": "Item description — quantity", "note": "Source · cost"}]}}`,
          messages: [{ role: "user", content: `Categorize these items:\n${itemList}` }],
        }),
      });
      const d = await res.json();
      const text = d.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCatResult(parsed.categories || parsed);
    } catch (err) {
      console.error('AI categorize error:', err);
      setCatResult(null);
    }
    setCatParsing(false);
  };

  const applyCategories = () => {
    if (!catResult) return;
    const next = deepClone(setupData);
    Object.entries(catResult).forEach(([catName, items]) => {
      let cat = next.find(c => c.category.toLowerCase() === catName.toLowerCase());
      if (!cat) {
        cat = { category: catName, items: [] };
        next.push(cat);
      }
      items.forEach(item => {
        const text = typeof item === 'string' ? item : item.text || item.item || '';
        const note = typeof item === 'string' ? '' : item.note || item.source || '';
        if (text && !cat.items.some(i => i.text.toLowerCase() === text.toLowerCase())) {
          cat.items.push({ id: uid(), text, done: false, note });
        }
      });
    });
    setSetupData(next);
    setCatResult(null);
    setParsedItems([]);
  };

  const handleCatUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || uploadingCat === null) return;
    setParsing(true);
    const catName = categories[uploadingCat];
    const fileInfo = { id: uid(), name: file.name, size: file.size, type: file.type || file.name.split('.').pop(), uploadedAt: new Date().toISOString(), items: [] };
    const items = await parseFile(file);
    fileInfo.items = items.map(i => `${i.item}${i.amount ? ' ('+i.amount+')' : ''}${i.cost ? ' — '+i.cost : ''}`);
    const next = { ...attachments };
    if (!next[catName]) next[catName] = [];
    next[catName] = [...next[catName], fileInfo];
    setAttachments(next);
    setParsing(false);
    setUploadingCat(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeFile = (catName, fileId) => {
    const next = { ...attachments };
    next[catName] = (next[catName] || []).filter(f => f.id !== fileId);
    if (next[catName].length === 0) delete next[catName];
    setAttachments(next);
  };

  const formatSize = (bytes) => bytes < 1024 ? bytes + ' B' : bytes < 1048576 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / 1048576).toFixed(1) + ' MB';
  const getFileIcon = (name) => name.match(/\.(xlsx?|csv|tsv)$/i) ? '📊' : name.match(/\.pdf$/i) ? '📄' : '📎';

  const sparkIcon = <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/></svg>;

  return (
    <div>
      <input ref={fileRef} type="file" accept=".csv,.tsv,.xlsx,.xls,.pdf,.doc,.docx" onChange={handleCatUpload} style={{ display: 'none' }} />
      <input ref={catFileRef} type="file" accept=".csv,.tsv,.xlsx,.xls" onChange={handleGlobalUpload} style={{ display: 'none' }} />

      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", fontSize:13, fontWeight:600, color:"#E53935", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif", marginBottom:20 }}>
        {I.back} Back to Checklist
      </button>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:18, fontWeight:800, color:"#1A2332", marginBottom:6 }}>Documents & Uploads</div>
        <div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.55, fontWeight:500 }}>
          Upload order lists or inventory sheets. AI will auto-categorize items into your setup checklist.
        </div>
      </div>

      {/* ═══ AI Auto-Categorize Upload ═══ */}
      <div style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:24, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1A2332", marginBottom:6 }}>Upload & Auto-Categorize</div>
        <div style={{ fontSize:12, color:"#5B6B7D", lineHeight:1.5, marginBottom:14 }}>Upload a CSV or Excel file with your item list. AI will read the items and sort them into the right setup categories automatically.</div>
        <button onClick={() => catFileRef.current?.click()} disabled={catParsing} style={{
          display:"flex", alignItems:"center", gap:8, padding:"11px 20px", borderRadius:10,
          background: catParsing ? "#E4EAF0" : "linear-gradient(135deg, #E53935, #EF5350)",
          color: catParsing ? "#8B97A8" : "#fff", border:"none", fontSize:13, fontWeight:700,
          cursor: catParsing ? "default" : "pointer", fontFamily:"'Inter', sans-serif",
          boxShadow: catParsing ? "none" : "0 2px 8px rgba(229,57,53,.25)",
        }}>
          {catParsing ? (
            <><div style={{ width:14, height:14, border:"2px solid #C5CDD8", borderTopColor:"#8B97A8", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> Processing & categorizing...</>
          ) : (
            <>{sparkIcon} Upload Item List (CSV / Excel)</>
          )}
        </button>

        {catResult && (
          <div style={{ marginTop:16 }} className="fade-up">
            <div style={{ fontSize:13, fontWeight:700, color:"#1A2332", marginBottom:10 }}>AI Categorization Preview:</div>
            {Object.entries(catResult).map(([catName, items]) => (
              <div key={catName} style={{ marginBottom:12, padding:14, borderRadius:12, background:"#EEF2F7", border:"1.5px solid #DCE3EB" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#E53935", marginBottom:6 }}>{catName} <span style={{ fontWeight:500, color:"#8B97A8" }}>({Array.isArray(items) ? items.length : 0} items)</span></div>
                {Array.isArray(items) && items.map((item, i) => {
                  const text = typeof item === 'string' ? item : item.text || item.item || '';
                  const note = typeof item === 'string' ? '' : item.note || '';
                  return (
                    <div key={i} style={{ fontSize:12, color:"#1A2332", padding:"4px 0", borderBottom: i < items.length - 1 ? "1px solid #DCE3EB" : "none" }}>
                      {text}{note && <span style={{ color:"#8B97A8", marginLeft:8 }}>({note})</span>}
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button onClick={applyCategories} style={{ ...S.btnPrimary, display:"flex", alignItems:"center", gap:6 }}>
                {I.check} Add to Checklist
              </button>
              <button onClick={() => { setCatResult(null); setParsedItems([]); }} style={S.btnSecondary}>Discard</button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Per-Category File Attachments ═══ */}
      <div style={{ fontSize:15, fontWeight:800, color:"#1A2332", marginBottom:14 }}>Category Documents</div>

      {categories.map((catName, ci) => {
        const files = attachments[catName] || [];
        return (
          <div key={ci} style={{ marginBottom:16, padding:18, borderRadius:14, background:"#FFFFFF", border:"1.5px solid #DCE3EB", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: files.length > 0 ? 14 : 0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1A2332" }}>{catName}</div>
              <button onClick={() => { setUploadingCat(ci); setTimeout(() => fileRef.current?.click(), 50); }} style={{
                display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:8, fontSize:11, fontWeight:700,
                color:"#E53935", background:"rgba(229,57,53,0.06)", border:"1.5px solid rgba(229,57,53,0.2)",
                cursor:"pointer", fontFamily:"'Inter', sans-serif",
              }}>
                {I.upload} Upload
              </button>
            </div>
            {parsing && uploadingCat === ci && <div style={{ padding:12, textAlign:"center", color:"#8B97A8", fontSize:12 }}>Processing...</div>}
            {files.map(f => (
              <div key={f.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", borderRadius:10, background:"#EEF2F7", marginBottom:6 }}>
                <div style={{ fontSize:20, lineHeight:1, marginTop:2 }}>{getFileIcon(f.name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1A2332", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"#8B97A8", marginTop:2 }}>{formatSize(f.size)} {f.items?.length > 0 && <span>· {f.items.length} items</span>} · {new Date(f.uploadedAt).toLocaleDateString()}</div>
                  {f.items?.length > 0 && (
                    <details style={{ marginTop:8 }}>
                      <summary style={{ fontSize:11, fontWeight:600, color:"#E53935", cursor:"pointer" }}>Preview ({f.items.length})</summary>
                      <div style={{ marginTop:6, maxHeight:140, overflowY:"auto", fontSize:12, color:"#5B6B7D", lineHeight:1.6 }}>
                        {f.items.slice(0, 30).map((item, i) => <div key={i} style={{ padding:"3px 0", borderBottom:"1px solid #DCE3EB" }}>{typeof item === 'string' ? item : item.item || JSON.stringify(item)}</div>)}
                      </div>
                    </details>
                  )}
                </div>
                <button onClick={() => removeFile(catName, f.id)} style={{ ...S.btnGhost, color:"#D32F2F" }}>{I.trash}</button>
              </div>
            ))}
            {files.length === 0 && !parsing && <div style={{ fontSize:12, color:"#8B97A8", fontStyle:"italic", marginTop:8 }}>No files uploaded</div>}
          </div>
        );
      })}
    </div>
  );
}

function SetupChecklist({ data, setData, teamRoster }) {
  const [expandedCat, setExpandedCat] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingItemCat, setAddingItemCat] = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editItemText, setEditItemText] = useState("");
  const [editingCatName, setEditingCatName] = useState(null);
  const [editCatText, setEditCatText] = useState("");
  const [showRestore, setShowRestore] = useState(false);

  const restoreDefaults = () => {
    const merged = deepClone(data);
    DEFAULT_SETUP_CHECKLIST.forEach(defaultCat => {
      const existing = merged.find(c => c.category.toLowerCase() === defaultCat.category.toLowerCase());
      if (!existing) {
        merged.push(deepClone(defaultCat));
      }
    });
    setData(merged);
    setShowRestore(false);
  };
  const total = data.reduce((a,c) => a+c.items.length, 0), done = data.reduce((a,c) => a+c.items.filter(i=>i.done).length, 0), pct = total ? Math.round((done/total)*100) : 0;
  const toggle = (ci,id) => { const n=deepClone(data); n[ci].items.find(i=>i.id===id).done^=true; setData(n); };
  const updateNote = (ci,id,note) => { const n=deepClone(data); n[ci].items.find(i=>i.id===id).note=note; setData(n); };
  const updateAssignee = (ci,id,assignee) => { const n=deepClone(data); n[ci].items.find(i=>i.id===id).assignee=assignee; setData(n); };
  const addCategory = () => { if(!newCatName.trim()) return; setData([...data,{category:newCatName.trim(),items:[]}]); setNewCatName(""); setAddingCat(false); };
  const deleteCategory = ci => { const n=deepClone(data); n.splice(ci,1); setData(n); if(expandedCat===ci) setExpandedCat(null); };
  const renameCat = ci => { if(!editCatText.trim()) return; const n=deepClone(data); n[ci].category=editCatText.trim(); setData(n); setEditingCatName(null); };
  const addItem = ci => { if(!newItemText.trim()) return; const n=deepClone(data); n[ci].items.push({id:uid(),text:newItemText.trim(),done:false,note:"",assignee:""}); setData(n); setNewItemText(""); setAddingItemCat(null); };
  const deleteItem = (ci,id) => { const n=deepClone(data); n[ci].items=n[ci].items.filter(i=>i.id!==id); setData(n); };
  const renameItem = (ci,id) => { if(!editItemText.trim()) return; const n=deepClone(data); n[ci].items.find(i=>i.id===id).text=editItemText.trim(); setData(n); setEditingItem(null); };
  const moveCategory = (ci,d) => { const n=deepClone(data); const t=ci+d; if(t<0||t>=n.length) return; [n[ci],n[t]]=[n[t],n[ci]]; setData(n); if(expandedCat===ci) setExpandedCat(t); else if(expandedCat===t) setExpandedCat(ci); };

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28, padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:4, background: pct===100?"#1A8F38":"linear-gradient(180deg, #E53935, #EF5350)" }} />
        <div style={{ position:"relative", marginLeft:8 }}><ProgressRing pct={pct} size={72} stroke={6} color={pct===100?"#1A8F38":"#E53935"} /><div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, fontFamily:"'Inter', sans-serif", color: pct===100?"#1A8F38":"#E53935" }}>{pct}</div></div>
        <div style={{ flex:1 }}><div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#E53935", marginBottom:4 }}>Setup Progress</div><div style={{ fontSize:14, fontWeight:600, color:"#1A2332" }}>{done} of {total} items complete</div><div style={{ height:4, borderRadius:2, background:"#DCE3EB", marginTop:10, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, borderRadius:2, background: pct===100?"#1A8F38":"linear-gradient(135deg, #E53935, #EF5350)", transition:"width .5s cubic-bezier(.4,0,.2,1)" }} /></div></div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <button onClick={() => setShowRestore(!showRestore)} style={{ fontSize:11, fontWeight:600, color:"#8B97A8", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif", padding:"6px 0" }}>+ Restore default categories</button>
        <button onClick={() => setEditMode(!editMode)} style={S.editToggle(editMode)}>{I.edit} {editMode ? "Done" : "Edit"}</button>
      </div>
      {showRestore && (
        <div className="fade-up" style={{ padding:14, background:"rgba(229,57,53,0.04)", borderRadius:12, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center", border:"1.5px solid rgba(229,57,53,0.12)", flexWrap:"wrap", gap:10 }}>
          <span style={{ fontSize:13, color:"#1A2332", fontWeight:600 }}>Add any missing default categories? Your existing data won't be changed.</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setShowRestore(false)} style={S.btnSecondary}>Cancel</button>
            <button onClick={restoreDefaults} style={S.btnPrimary}>Restore</button>
          </div>
        </div>
      )}
      {data.map((cat,ci) => { const cd = cat.items.filter(i=>i.done).length, ct = cat.items.length, open = expandedCat===ci; return (
        <div key={ci} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", gap:5, alignItems:"center" }}>
            {editMode && <div style={{ display:"flex", flexDirection:"column", gap:1 }}><button onClick={()=>moveCategory(ci,-1)} style={S.btnGhost}>{I.up}</button><button onClick={()=>moveCategory(ci,1)} style={S.btnGhost}>{I.down}</button></div>}
            <button onClick={() => setExpandedCat(open?null:ci)} style={{ flex:1, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 18px", background: open?"rgba(229,57,53,0.03)":"#FFFFFF", border: open?"1.5px solid rgba(229,57,53,0.2)":"1.5px solid #DCE3EB", borderLeft: open?"3px solid #E53935":"1.5px solid #DCE3EB", borderRadius:14, cursor:"pointer", color:"#1A2332", fontSize:14, fontWeight:700, fontFamily:"'Inter', sans-serif", boxShadow: open?"0 2px 8px rgba(229,57,53,0.08)":"0 1px 4px rgba(0,0,0,0.06)", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ transform: open?"rotate(90deg)":"rotate(0)", transition:"transform .2s", display:"inline-flex", color: open?"#E53935":"#8B97A8" }}>{I.chevron}</span><span>{cat.category}</span></div>
              <span style={{ fontSize:11, fontWeight:700, fontFamily:"'Inter', sans-serif", color: cd===ct&&ct>0?"#1A8F38":"#8B97A8", background: cd===ct&&ct>0?"rgba(26,143,56,0.06)":"#E4EAF0", padding:"4px 12px", borderRadius:20 }}>{cd}/{ct}</span>
            </button>
            {editMode && <div style={{ display:"flex", gap:2 }}><button onClick={()=>{setEditingCatName(ci);setEditCatText(cat.category);}} style={S.btnGhost}>{I.edit}</button><button onClick={()=>deleteCategory(ci)} style={{...S.btnGhost,color:"#D32F2F"}}>{I.trash}</button></div>}
          </div>
          {editingCatName===ci && (<div style={{...S.addForm, marginTop:8, display:"flex", gap:8, alignItems:"center"}}><input autoFocus value={editCatText} onChange={e=>setEditCatText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&renameCat(ci)} style={{...S.input, flex:1}} /><button onClick={()=>renameCat(ci)} style={S.btnPrimary}>Save</button><button onClick={()=>setEditingCatName(null)} style={S.btnSecondary}>Cancel</button></div>)}
          {open && (<div style={{ padding:"10px 0 0 0" }}>
            {cat.items.map(item => (<div key={item.id} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"11px 14px", borderRadius:10, marginBottom:3, background: item.done?"rgba(26,143,56,0.06)":"transparent" }}>
              <button onClick={()=>toggle(ci,item.id)} style={{ width:24, height:24, minWidth:24, borderRadius:8, border: item.done?"none":"2px solid #C5CDD8", background: item.done?"#1A8F38":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", marginTop:1, color:"#fff", padding:0 }}>{item.done && I.check}</button>
              <div style={{ flex:1 }}>
                {editingItem===item.id ? (<div style={{ display:"flex", gap:8, alignItems:"center" }}><input autoFocus value={editItemText} onChange={e=>setEditItemText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&renameItem(ci,item.id)} style={{...S.input, flex:1}} /><button onClick={()=>renameItem(ci,item.id)} style={S.btnPrimary}>Save</button><button onClick={()=>setEditingItem(null)} style={S.btnSecondary}>Cancel</button></div>) : (<>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ flex:1, fontSize:13.5, fontWeight:500, color: item.done?"#8B97A8":"#1A2332", textDecoration: item.done?"line-through":"none", lineHeight:1.45 }}>{item.text}</span>{editMode && <div style={{ display:"flex", gap:2 }}><button onClick={e=>{e.stopPropagation();setEditingItem(item.id);setEditItemText(item.text);}} style={S.btnGhost}>{I.edit}</button><button onClick={e=>{e.stopPropagation();deleteItem(ci,item.id);}} style={{...S.btnGhost,color:"#D32F2F"}}>{I.trash}</button></div>}</div>
                  {/* Assignee + Note row */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4, flexWrap:"wrap" }}>
                    {teamRoster && teamRoster.length > 0 ? (
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        {item.assignee ? (
                          <button onClick={() => updateAssignee(ci, item.id, "")} style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px 2px 2px", borderRadius:14, background:"#2D6CC0", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>
                            <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:9, fontWeight:800 }}>{getInitials(item.assignee)}</div>
                            <span style={{ fontSize:11, fontWeight:600, color:"#fff" }}>{item.assignee.split(' ')[0]}</span>
                            <span style={{ fontSize:9, color:"rgba(255,255,255,0.7)", marginLeft:2 }}>✕</span>
                          </button>
                        ) : (
                          <select value="" onChange={e => updateAssignee(ci, item.id, e.target.value)} style={{ padding:"3px 6px", borderRadius:6, border:"1px solid #DCE3EB", fontSize:10, fontWeight:500, color:"#8B97A8", background:"#FFFFFF", cursor:"pointer", fontFamily:"'Inter', sans-serif", outline:"none" }}>
                            <option value="">Assign →</option>
                            {teamRoster.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                          </select>
                        )}
                      </div>
                    ) : null}
                    {editingNote===item.id ? (<textarea autoFocus value={item.note} onChange={e=>updateNote(ci,item.id,e.target.value)} onBlur={()=>setEditingNote(null)} placeholder="Add a note..." style={{...S.textarea, marginTop:4, width:"100%"}} />) : (<button onClick={()=>setEditingNote(item.id)} style={{ fontSize:11, fontWeight:500, color: item.note?"#E53935":"#8B97A8", background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>{item.note || "+ Note"}</button>)}
                  </div>
                </>)}
              </div>
            </div>))}
            {editMode && addingItemCat===ci ? (<div style={{...S.addForm, display:"flex", gap:8, alignItems:"center"}}><input autoFocus value={newItemText} onChange={e=>setNewItemText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem(ci)} placeholder="New checklist item..." style={{...S.input, flex:1}} /><button onClick={()=>addItem(ci)} style={S.btnPrimary}>Add</button><button onClick={()=>{setAddingItemCat(null);setNewItemText("");}} style={S.btnSecondary}>Cancel</button></div>) : editMode && (<button onClick={()=>{setAddingItemCat(ci);setNewItemText("");}} style={S.addBtnSmall}>{I.plus} Add item</button>)}
          </div>)}
        </div>); })}
      {editMode && (addingCat ? (<div style={{...S.addForm, display:"flex", gap:8, alignItems:"center", marginTop:10}}><input autoFocus value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} placeholder="New category name..." style={{...S.input, flex:1}} /><button onClick={addCategory} style={S.btnPrimary}>Add</button><button onClick={()=>{setAddingCat(false);setNewCatName("");}} style={S.btnSecondary}>Cancel</button></div>) : (<button onClick={()=>setAddingCat(true)} style={{...S.addBtn, marginTop:10}}>{I.plus} Add Category</button>))}
    </div>
  );
}

function TrainingPlan({ data, setData }) {
  const [activeDay, setActiveDay] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [addingDay, setAddingDay] = useState(false);
  const [newDayTheme, setNewDayTheme] = useState("");
  const [addingBlock, setAddingBlock] = useState(false);
  const [newBlock, setNewBlock] = useState({time:"",title:"",description:""});
  const [editingBlock, setEditingBlock] = useState(null);
  const [editBlock, setEditBlock] = useState({time:"",title:"",description:""});
  const [editingDayTheme, setEditingDayTheme] = useState(false);
  const [editDayThemeText, setEditDayThemeText] = useState("");
  const totalBlocks = data.reduce((a,d)=>a+d.blocks.length,0), doneBlocks = data.reduce((a,d)=>a+d.blocks.filter(b=>b.done).length,0);
  const toggleBlock = (di,id) => { const n=deepClone(data); n[di].blocks.find(b=>b.id===id).done^=true; setData(n); };
  const addDay = () => { if(!newDayTheme.trim()) return; setData([...data,{day:data.length+1,theme:newDayTheme.trim(),blocks:[]}]); setNewDayTheme(""); setAddingDay(false); setActiveDay(data.length); };
  const deleteDay = di => { const n=deepClone(data); n.splice(di,1); n.forEach((d,i)=>d.day=i+1); setData(n); if(activeDay>=n.length) setActiveDay(Math.max(0,n.length-1)); };
  const renameDayTheme = () => { if(!editDayThemeText.trim()) return; const n=deepClone(data); n[activeDay].theme=editDayThemeText.trim(); setData(n); setEditingDayTheme(false); };
  const addBlockToDay = () => { if(!newBlock.title.trim()) return; const n=deepClone(data); n[activeDay].blocks.push({id:uid(),time:newBlock.time,title:newBlock.title.trim(),description:newBlock.description,done:false}); setData(n); setNewBlock({time:"",title:"",description:""}); setAddingBlock(false); };
  const deleteBlock = id => { const n=deepClone(data); n[activeDay].blocks=n[activeDay].blocks.filter(b=>b.id!==id); setData(n); };
  const saveEditBlock = id => { if(!editBlock.title.trim()) return; const n=deepClone(data); const b=n[activeDay].blocks.find(b=>b.id===id); b.time=editBlock.time; b.title=editBlock.title.trim(); b.description=editBlock.description; setData(n); setEditingBlock(null); };
  const moveBlock = (bi,d) => { const n=deepClone(data); const a=n[activeDay].blocks; const t=bi+d; if(t<0||t>=a.length) return; [a[bi],a[t]]=[a[t],a[bi]]; setData(n); };
  if(!data.length) return (<div style={{ textAlign:"center", padding:48 }}><div style={{ fontSize:15, color:"#8B97A8", marginBottom:20 }}>No training days yet</div>{addingDay ? (<div style={{...S.addForm, textAlign:"left", maxWidth:360, margin:"0 auto"}}><label style={S.label}>Day Theme</label><input autoFocus value={newDayTheme} onChange={e=>setNewDayTheme(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDay()} placeholder="e.g. Culture & Foundations" style={S.input} /><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={addDay} style={S.btnPrimary}>Add Day</button><button onClick={()=>setAddingDay(false)} style={S.btnSecondary}>Cancel</button></div></div>) : <button onClick={()=>setAddingDay(true)} style={S.btnPrimary}>Add First Day</button>}</div>);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}><button onClick={()=>setEditMode(!editMode)} style={S.editToggle(editMode)}>{I.edit} {editMode?"Done":"Edit"}</button></div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {data.map((d,i) => { const dd=d.blocks.filter(b=>b.done).length, dt=d.blocks.length; return (<div key={i} style={{ flex:"1 0 80px", position:"relative" }}><button onClick={()=>setActiveDay(i)} style={{ width:"100%", padding:"14px 10px", borderRadius:14, border: activeDay===i?"2px solid #E53935":"1.5px solid #DCE3EB", background: activeDay===i?"rgba(229,57,53,0.06)":"#FFFFFF", cursor:"pointer", color:"#1A2332", fontFamily:"'Inter', sans-serif", textAlign:"center", boxShadow: activeDay===i?"0 4px 16px rgba(229,57,53,0.12)":"0 1px 4px rgba(0,0,0,0.06)" }}><div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8B97A8", marginBottom:4 }}>Day {d.day}</div><div style={{ fontSize:13, fontWeight:700, fontFamily:"'Inter', sans-serif", color: dd===dt&&dt>0?"#1A8F38":"#E53935" }}>{dd}/{dt}</div></button>{editMode && <button onClick={()=>deleteDay(i)} style={{ position:"absolute", top:-7, right:-7, width:22, height:22, borderRadius:"50%", background:"#D32F2F", color:"#fff", border:"2px solid #EEF2F7", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>{I.close}</button>}</div>); })}
        {editMode && <button onClick={()=>setAddingDay(true)} style={{ flex:"1 0 80px", padding:"14px 10px", borderRadius:14, border:"1.5px dashed #E53935", background:"rgba(229,57,53,0.06)", cursor:"pointer", color:"#E53935", fontFamily:"'Inter', sans-serif", textAlign:"center", fontSize:12, fontWeight:700 }}>{I.plus} Day</button>}
      </div>
      {addingDay && (<div style={{...S.addForm, marginBottom:20}}><label style={S.label}>Day Theme</label><input autoFocus value={newDayTheme} onChange={e=>setNewDayTheme(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addDay()} placeholder="e.g. Advanced Skills" style={S.input} /><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={addDay} style={S.btnPrimary}>Add Day</button><button onClick={()=>{setAddingDay(false);setNewDayTheme("");}} style={S.btnSecondary}>Cancel</button></div></div>)}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        {editingDayTheme ? (<div style={{ display:"flex", gap:8, alignItems:"center", flex:1 }}><input autoFocus value={editDayThemeText} onChange={e=>setEditDayThemeText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&renameDayTheme()} style={{...S.input, flex:1, fontSize:16, fontWeight:700}} /><button onClick={renameDayTheme} style={S.btnPrimary}>Save</button><button onClick={()=>setEditingDayTheme(false)} style={S.btnSecondary}>Cancel</button></div>) : (<><div style={{ width:4, height:22, borderRadius:2, background:"linear-gradient(135deg, #E53935, #EF5350)" }} /><span style={{ fontSize:16, fontWeight:800, color:"#1A2332" }}>Day {data[activeDay].day}: {data[activeDay].theme}</span>{editMode && <button onClick={()=>{setEditingDayTheme(true);setEditDayThemeText(data[activeDay].theme);}} style={S.btnGhost}>{I.edit}</button>}</>)}
      </div>
      {data[activeDay].blocks.map((block,bi) => (editingBlock===block.id ? (<div key={block.id} style={{...S.addForm, marginBottom:10}}><div style={{ display:"grid", gridTemplateColumns:"130px 1fr", gap:10, marginBottom:10 }}><div><label style={S.label}>Time</label><input value={editBlock.time} onChange={e=>setEditBlock({...editBlock,time:e.target.value})} style={S.input} /></div><div><label style={S.label}>Title</label><input value={editBlock.title} onChange={e=>setEditBlock({...editBlock,title:e.target.value})} style={S.input} /></div></div><label style={S.label}>Description</label><textarea value={editBlock.description} onChange={e=>setEditBlock({...editBlock,description:e.target.value})} rows={2} style={S.textarea} /><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={()=>saveEditBlock(block.id)} style={S.btnPrimary}>Save</button><button onClick={()=>setEditingBlock(null)} style={S.btnSecondary}>Cancel</button></div></div>) : (<div key={block.id} style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>{editMode && <div style={{ display:"flex", flexDirection:"column", gap:2, paddingTop:14 }}><button onClick={()=>moveBlock(bi,-1)} style={S.btnGhost}>{I.up}</button><button onClick={()=>moveBlock(bi,1)} style={S.btnGhost}>{I.down}</button></div>}<div onClick={()=>!editMode&&toggleBlock(activeDay,block.id)} style={{ flex:1, display:"flex", gap:14, padding:"16px 18px", borderRadius:14, border:"1.5px solid #DCE3EB", background: block.done?"rgba(26,143,56,0.06)":"#FFFFFF", cursor: editMode?"default":"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}><div style={{ width:24, height:24, minWidth:24, borderRadius:8, border: block.done?"none":"2px solid #C5CDD8", background: block.done?"#1A8F38":"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", marginTop:2 }}>{block.done && I.check}</div><div style={{ flex:1 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}><span style={{ fontSize:14, fontWeight:700, color: block.done?"#8B97A8":"#1A2332" }}>{block.title}</span><span style={{ fontSize:11, fontFamily:"'Inter', sans-serif", color:"#8B97A8", fontWeight:600, background:"#E4EAF0", padding:"3px 10px", borderRadius:6 }}>{block.time}</span></div><div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.55 }}>{block.description}</div></div></div>{editMode && <div style={{ display:"flex", flexDirection:"column", gap:4, paddingTop:14 }}><button onClick={()=>{setEditingBlock(block.id);setEditBlock({time:block.time,title:block.title,description:block.description});}} style={S.btnGhost}>{I.edit}</button><button onClick={()=>deleteBlock(block.id)} style={{...S.btnGhost,color:"#D32F2F"}}>{I.trash}</button></div>}</div>)))}
      {editMode && (addingBlock ? (<div style={S.addForm}><div style={{ display:"grid", gridTemplateColumns:"130px 1fr", gap:10, marginBottom:10 }}><div><label style={S.label}>Time</label><input autoFocus value={newBlock.time} onChange={e=>setNewBlock({...newBlock,time:e.target.value})} placeholder="e.g. 9:00–10:30" style={S.input} /></div><div><label style={S.label}>Title</label><input value={newBlock.title} onChange={e=>setNewBlock({...newBlock,title:e.target.value})} placeholder="Block title" style={S.input} /></div></div><label style={S.label}>Description</label><textarea value={newBlock.description} onChange={e=>setNewBlock({...newBlock,description:e.target.value})} placeholder="What happens in this block?" rows={2} style={S.textarea} /><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={addBlockToDay} style={S.btnPrimary}>Add Block</button><button onClick={()=>{setAddingBlock(false);setNewBlock({time:"",title:"",description:""});}} style={S.btnSecondary}>Cancel</button></div></div>) : (<button onClick={()=>setAddingBlock(true)} style={S.addBtn}>{I.plus} Add Training Block</button>))}
      <div style={{ marginTop:20, padding:"14px 18px", borderRadius:12, background:"#E4EAF0", fontSize:12, color:"#5B6B7D", lineHeight:1.5, fontWeight:500, border:"1.5px solid #DCE3EB" }}><strong style={{ color:"#1A2332" }}>Training progress:</strong> {doneBlocks} of {totalBlocks} blocks complete across all days.</div>
    </div>
  );
}

function DailyStructure({ data, setData }) {
  const [editMode, setEditMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({time:"",label:"",description:"",type:"active"});
  const [editingItem, setEditingItem] = useState(null);
  const [editItem, setEditItem] = useState({time:"",label:"",description:"",type:"active"});
  const tc = { setup:{bg:"rgba(45,108,192,0.06)",color:"#2D6CC0",label:"Setup"}, huddle:{bg:"rgba(192,123,6,0.06)",color:"#C07B06",label:"Huddle"}, active:{bg:"rgba(26,143,56,0.06)",color:"#1A8F38",label:"Active"}, break:{bg:"#E4EAF0",color:"#8B97A8",label:"Break"} };
  const types = ["setup","huddle","active","break"];
  const addDI = () => { if(!newItem.label.trim()) return; const n=[...data,{id:uid(),time:newItem.time,label:newItem.label.trim(),description:newItem.description,type:newItem.type}]; n.sort((a,b)=>a.time.localeCompare(b.time)); setData(n); setNewItem({time:"",label:"",description:"",type:"active"}); setAdding(false); };
  const delDI = id => setData(data.filter(d=>d.id!==id));
  const saveDI = id => { if(!editItem.label.trim()) return; const n=deepClone(data); const i=n.find(d=>d.id===id); i.time=editItem.time; i.label=editItem.label.trim(); i.description=editItem.description; i.type=editItem.type; n.sort((a,b)=>a.time.localeCompare(b.time)); setData(n); setEditingItem(null); };
  const moveDI = (i,d) => { const n=deepClone(data); const t=i+d; if(t<0||t>=n.length) return; [n[i],n[t]]=[n[t],n[i]]; setData(n); };
  const TypePicker = ({value,onChange}) => (<div style={{ display:"flex", gap:5 }}>{types.map(t => { const c=tc[t]; return (<button key={t} onClick={()=>onChange(t)} style={{ padding:"5px 12px", borderRadius:8, fontSize:10, fontWeight:700, textTransform:"uppercase", background: value===t?c.color:"#E4EAF0", color: value===t?"#fff":"#8B97A8", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>{c.label}</button>); })}</div>);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}><div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.5, flex:1, fontWeight:500 }}>Recommended daily rhythm for the first two weeks.</div><button onClick={()=>setEditMode(!editMode)} style={{...S.editToggle(editMode), marginLeft:16}}>{I.edit} {editMode?"Done":"Edit"}</button></div>
      <div style={{ position:"relative" }}><div style={{ position:"absolute", left: editMode?68:48, top:0, bottom:0, width:2, background:"#DCE3EB", zIndex:0 }} />
        {data.map((item,i) => { const c = tc[item.type]||tc.active; if(editingItem===item.id) return (<div key={item.id} style={{...S.addForm, marginBottom:14, marginLeft: editMode?86:66, position:"relative", zIndex:1}}><div style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:10, marginBottom:10 }}><div><label style={S.label}>Time</label><input value={editItem.time} onChange={e=>setEditItem({...editItem,time:e.target.value})} style={S.input} /></div><div><label style={S.label}>Label</label><input value={editItem.label} onChange={e=>setEditItem({...editItem,label:e.target.value})} style={S.input} /></div></div><label style={S.label}>Description</label><textarea value={editItem.description} onChange={e=>setEditItem({...editItem,description:e.target.value})} rows={2} style={S.textarea} /><div style={{ marginTop:10 }}><label style={S.label}>Type</label><TypePicker value={editItem.type} onChange={t=>setEditItem({...editItem,type:t})} /></div><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={()=>saveDI(item.id)} style={S.btnPrimary}>Save</button><button onClick={()=>setEditingItem(null)} style={S.btnSecondary}>Cancel</button></div></div>);
          return (<div key={item.id} style={{ display:"flex", gap:10, marginBottom:22, position:"relative", zIndex:1, alignItems:"flex-start" }}>{editMode && <div style={{ display:"flex", flexDirection:"column", gap:2, paddingTop:8 }}><button onClick={()=>moveDI(i,-1)} style={S.btnGhost}>{I.up}</button><button onClick={()=>moveDI(i,1)} style={S.btnGhost}>{I.down}</button></div>}<div style={{ width:54, textAlign:"center", paddingTop:3, flexShrink:0 }}><div style={{ fontSize:14, fontWeight:800, fontFamily:"'Inter', sans-serif", color:"#1A2332" }}>{item.time}</div><div style={{ width:12, height:12, borderRadius:"50%", background:c.color, margin:"10px auto 0", border:"3px solid #EEF2F7", boxShadow:`0 0 0 2px ${c.color}33` }} /></div><div style={{ flex:1, padding:"14px 18px", borderRadius:14, background:"#FFFFFF", border:"1.5px solid #DCE3EB", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}><span style={{ fontSize:14, fontWeight:700, color:"#1A2332" }}>{item.label}</span><span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", padding:"3px 10px", borderRadius:8, background:c.bg, color:c.color }}>{c.label}</span></div><div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.55 }}>{item.description}</div></div>{editMode && <div style={{ display:"flex", flexDirection:"column", gap:4, paddingTop:12 }}><button onClick={()=>{setEditingItem(item.id);setEditItem({time:item.time,label:item.label,description:item.description,type:item.type});}} style={S.btnGhost}>{I.edit}</button><button onClick={()=>delDI(item.id)} style={{...S.btnGhost,color:"#D32F2F"}}>{I.trash}</button></div>}</div>); })}
      </div>
      {editMode && (adding ? (<div style={S.addForm}><div style={{ display:"grid", gridTemplateColumns:"90px 1fr", gap:10, marginBottom:10 }}><div><label style={S.label}>Time</label><input autoFocus value={newItem.time} onChange={e=>setNewItem({...newItem,time:e.target.value})} placeholder="e.g. 10:00" style={S.input} /></div><div><label style={S.label}>Label</label><input value={newItem.label} onChange={e=>setNewItem({...newItem,label:e.target.value})} placeholder="Block name" style={S.input} /></div></div><label style={S.label}>Description</label><textarea value={newItem.description} onChange={e=>setNewItem({...newItem,description:e.target.value})} placeholder="What happens?" rows={2} style={S.textarea} /><div style={{ marginTop:10 }}><label style={S.label}>Type</label><TypePicker value={newItem.type} onChange={t=>setNewItem({...newItem,type:t})} /></div><div style={{ display:"flex", gap:8, marginTop:12 }}><button onClick={addDI} style={S.btnPrimary}>Add Block</button><button onClick={()=>{setAdding(false);setNewItem({time:"",label:"",description:"",type:"active"});}} style={S.btnSecondary}>Cancel</button></div></div>) : (<button onClick={()=>setAdding(true)} style={{...S.addBtn, marginTop:10}}>{I.plus} Add Daily Block</button>))}
    </div>
  );
}

function AICoach() {
  const [sel, setSel] = useState(null);
  const [custom, setCustom] = useState("");
  const [resp, setResp] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(AI_COACH_SCENARIOS.map(s=>s.category))];
  const filtered = filter==="All"?AI_COACH_SCENARIOS:AI_COACH_SCENARIOS.filter(s=>s.category===filter);
  const ask = async (sc, ctx) => {
  setLoading(true); setResp("");
  const contextBlock = ctx ? `\n\nRelevant CLUTCH Steps of Service context for this scenario:\n${ctx}` : "";
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: COACH_SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Scenario: ${sc}${contextBlock}\n\nHow should I handle this? Be concise.` }]
      })
    });
    const d = await r.json();
    if (!r.ok) {
      // Anthropic returned an error — show the actual message
      setResp(`API error ${r.status}: ${d.error?.message || JSON.stringify(d)}`);
    } else {
      setResp(d.content?.map(i => i.text || "").join("\n") || "No response received.");
    }
  } catch (err) {
    setResp(`Network error: ${err.message}`);
  }
  setLoading(false);
};
  return (
    <div>
      <div style={{ fontSize:13, color:"#5B6B7D", marginBottom:20, lineHeight:1.55, fontWeight:500 }}>Select a scenario or describe your own. The AI coach gives guidance grounded in the Clutch Steps of Service (C-L-U-T-C-H) and AAA escalation framework.</div>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>{cats.map(c => (<button key={c} onClick={()=>setFilter(c)} style={{ padding:"6px 14px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border: filter===c?"none":"1.5px solid #DCE3EB", background: filter===c?"#E53935":"#FFFFFF", color: filter===c?"#fff":"#5B6B7D", fontFamily:"'Inter', sans-serif" }}>{c}</button>))}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>{filtered.map(s => (<button key={s.id} onClick={()=>{setSel(s.label);ask(s.label, s.context);}} style={{ padding:"12px 14px", borderRadius:12, fontSize:13, fontWeight:600, textAlign:"left", border: sel===s.label?"2px solid #E53935":"1.5px solid #DCE3EB", background: sel===s.label?"rgba(229,57,53,0.06)":"#FFFFFF", color:"#1A2332", cursor:"pointer", fontFamily:"'Inter', sans-serif", lineHeight:1.4, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>{s.label}</button>))}</div>
      <div style={{ display:"flex", gap:10, marginBottom:24 }}><input value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&custom.trim()){setSel(custom);ask(custom, null);}}} placeholder="Or describe your own scenario..." style={{...S.input, flex:1, background:"#FFFFFF"}} /><button onClick={()=>{if(custom.trim()){setSel(custom);ask(custom, null);}}} style={{...S.btnPrimary, padding:"10px 20px", fontSize:13, whiteSpace:"nowrap" }}>Ask Coach</button></div>
      {loading && (<div style={{ padding:40, textAlign:"center" }}><div style={{ display:"inline-block", width:30, height:30, border:"3px solid #DCE3EB", borderTopColor:"#E53935", borderRadius:"50%", animation:"spin .7s linear infinite" }} /><div style={{ fontSize:13, color:"#8B97A8", marginTop:14 }}>Thinking through this scenario...</div><style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style></div>)}
      {resp && !loading && (<div style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", fontSize:13.5, color:"#1A2332", lineHeight:1.75, whiteSpace:"pre-wrap", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{resp.split(/\*\*(.*?)\*\*/g).map((p,i) => i%2===1 ? <strong key={i} style={{ color:"#E53935", fontWeight:800 }}>{p}</strong> : <span key={i}>{p}</span>)}</div>)}
    </div>
  );
}

function Debrief({ data, setData }) {
  const [ne, setNe] = useState({day:"",wins:"",challenges:"",lessons:"",risks:""});
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [duration, setDuration] = useState(0);
  const [connStatus, setConnStatus] = useState("idle");
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef("");
  const timerRef = useRef(null);

  const startTimer = () => { setDuration(0); timerRef.current = setInterval(() => setDuration(d => d + 1), 1000); };
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  // ── Free: Web Speech API ──
  const startFree = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition is not supported in this browser. Try Chrome or Edge."); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-CA";
    fullTranscriptRef.current = transcript;
    recognition.onresult = (event) => {
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t + " "; else interim = t;
      }
      if (final) fullTranscriptRef.current += final;
      setTranscript(fullTranscriptRef.current);
      setLiveText(interim);
    };
    recognition.onerror = (e) => { if (e.error !== "no-speech") stopRecordingAll(); };
    recognition.onend = () => { if (recognitionRef.current) { try { recognition.start(); } catch {} } };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setConnStatus("connected");
    startTimer();
  };

  const stopRecordingAll = () => {
    stopTimer();
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setRecording(false); setLiveText(""); setConnStatus("idle");
  };

  const startRecording = () => startFree();

  const summarizeTranscript = async () => {
    if (!transcript.trim()) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 600,
          system: `You summarize store launch debrief conversations into exactly 4 categories. Extract the key points from the transcript and organize them.\n\nRespond ONLY in this exact JSON format, no markdown, no backticks, no preamble:\n{"wins":"...","challenges":"...","lessons":"...","risks":"..."}\n\n- wins: What went well, positive outcomes, things to celebrate\n- challenges: What was harder than expected, friction points, things that didn't work\n- lessons: What the team would do differently next time, key takeaways\n- risks: Gaps identified, risks to flag, things that need attention tomorrow\n\nBe concise. Use bullet-style phrases separated by semicolons. If a category has no relevant content, use an empty string.`,
          messages: [{ role: "user", content: `Here is the debrief conversation transcript:\n\n${transcript}` }],
        }),
      });
      const d = await res.json();
      const text = d.content?.map(i => i.text || "").join("") || "";
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setNe(prev => ({ ...prev, wins: parsed.wins || "", challenges: parsed.challenges || "", lessons: parsed.lessons || "", risks: parsed.risks || "" }));
      } catch { setNe(prev => ({ ...prev, wins: text })); }
    } catch {}
    setSummarizing(false);
  };

  const add = () => {
    if (!ne.day) return;
    setData([...data, { ...ne, id: uid(), timestamp: new Date().toISOString(), transcript: transcript || undefined }]);
    setNe({ day:"", wins:"", challenges:"", lessons:"", risks:"" });
    setTranscript(""); fullTranscriptRef.current = "";
  };
  const del = id => setData(data.filter(e => e.id !== id));

  const micIcon = <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
  const stopIcon = <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>;
  const sparkIcon = <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"/></svg>;

  return (
    <div>
      <div style={{ fontSize:13, color:"#5B6B7D", marginBottom:24, lineHeight:1.55, fontWeight:500 }}>Record your debrief conversation and AI will summarize it into wins, challenges, lessons, and risks.</div>

      <div style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:28, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#1A2332", marginBottom:18 }}>New Debrief Entry</div>

        <div style={{ marginBottom:14 }}>
          <label style={S.label}>Day / Date</label>
          <input value={ne.day} onChange={e => setNe({ ...ne, day: e.target.value })} placeholder="e.g. Day 1, March 29" style={S.input} />
        </div>

        {/* Voice Recording */}
        <div style={{ marginBottom:18, padding:16, borderRadius:12, background:"#EEF2F7", border:"1.5px solid #DCE3EB" }}>

          {/* Voice Recording Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <label style={{ ...S.label, marginBottom:0 }}>Voice Recording</label>
            {recording && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#E53935", animation:"pulse 1.5s ease infinite" }} />
                <span style={{ fontSize:14, fontWeight:700, color:"#E53935" }}>{formatTime(duration)}</span>
              </div>
            )}
          </div>

          {!recording && !transcript && (
            <div style={{ fontSize:12, color:"#8B97A8", marginBottom:10, lineHeight:1.5 }}>Tap record and start talking. Your conversation will be transcribed in real-time and AI will summarize it.</div>
          )}

          {/* Record / Stop */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {!recording ? (
              <button onClick={startRecording} style={{
                display:"flex", alignItems:"center", gap:6, padding:"10px 20px", borderRadius:10,
                background:"#E53935", color:"#fff",
                border:"none", fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"'Inter', sans-serif", boxShadow:"0 2px 8px rgba(229,57,53,.25)",
              }}>
                {micIcon} Start Recording
              </button>
            ) : (
              <button onClick={stopRecordingAll} style={{
                display:"flex", alignItems:"center", gap:6, padding:"10px 20px", borderRadius:10,
                background:"#D32F2F", color:"#fff", border:"none", fontSize:13, fontWeight:700,
                cursor:"pointer", fontFamily:"'Inter', sans-serif", animation:"pulse 1.5s ease infinite",
              }}>
                {stopIcon} Stop Recording
              </button>
            )}
          </div>

          {/* Live interim text */}
          {recording && liveText && (
            <div style={{ marginTop:10, padding:10, borderRadius:8, background:"rgba(229,57,53,0.04)", border:"1px solid rgba(229,57,53,0.1)" }}>
              <span style={{ fontSize:12, color:"#5B6B7D", fontStyle:"italic" }}>{liveText}</span>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#5B6B7D", marginBottom:6 }}>Transcript:</div>
              <div style={{ fontSize:12.5, color:"#1A2332", lineHeight:1.6, maxHeight:180, overflowY:"auto", padding:12, borderRadius:8, background:"#FFFFFF", border:"1px solid #DCE3EB" }}>
                {transcript}
              </div>
              <button onClick={summarizeTranscript} disabled={summarizing || recording} style={{
                display:"flex", alignItems:"center", gap:6, marginTop:10, padding:"9px 18px", borderRadius:10,
                background: (summarizing||recording) ? "#E4EAF0" : "linear-gradient(135deg, #E53935, #EF5350)",
                color: (summarizing||recording) ? "#8B97A8" : "#fff", border:"none", fontSize:12, fontWeight:700,
                cursor: (summarizing||recording) ? "default" : "pointer", fontFamily:"'Inter', sans-serif",
                boxShadow: (summarizing||recording) ? "none" : "0 2px 8px rgba(229,57,53,.25)",
              }}>
                {summarizing ? (
                  <><div style={{ width:14, height:14, border:"2px solid #C5CDD8", borderTopColor:"#8B97A8", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> Summarizing...</>
                ) : (
                  <>{sparkIcon} Summarize with AI</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Manual fields */}
        {[
          { k: "wins", l: "Wins", p: "What went well today?" },
          { k: "challenges", l: "Challenges", p: "What was harder than expected?" },
          { k: "lessons", l: "Lessons Learned", p: "What would you do differently?" },
          { k: "risks", l: "Risks / Gaps Identified", p: "Any risks to flag for tomorrow?" },
        ].map(f => (
          <div key={f.k} style={{ marginBottom:14 }}>
            <label style={S.label}>{f.l}</label>
            <textarea value={ne[f.k]} onChange={e => setNe({ ...ne, [f.k]: e.target.value })} placeholder={f.p} rows={2} style={S.textarea} />
          </div>
        ))}

        <button onClick={add} disabled={!ne.day} style={{
          ...S.btnPrimary, background: ne.day ? "#E53935" : "#E4EAF0",
          color: ne.day ? "#fff" : "#8B97A8", cursor: ne.day ? "pointer" : "default",
          boxShadow: ne.day ? "0 2px 8px rgba(229,57,53,.25)" : "none",
        }}>Save Debrief</button>
      </div>

      {data.length > 0 && (
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:"#1A2332", marginBottom:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>Previous Debriefs</div>
          {[...data].reverse().map(e => (
            <div key={e.id} style={{ padding:18, borderRadius:14, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:15, fontWeight:800, color:"#E53935" }}>{e.day}</span>
                <button onClick={() => del(e.id)} style={S.btnGhost}>{I.trash}</button>
              </div>
              {[
                { k: "wins", l: "Wins", c: "#1A8F38" },
                { k: "challenges", l: "Challenges", c: "#C07B06" },
                { k: "lessons", l: "Lessons", c: "#2D6CC0" },
                { k: "risks", l: "Risks", c: "#D32F2F" },
              ].filter(f => e[f.k]).map(f => (
                <div key={f.k} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", color:f.c, marginBottom:4 }}>{f.l}</div>
                  <div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.55 }}>{e[f.k]}</div>
                </div>
              ))}
              {e.transcript && (
                <details style={{ marginTop:8 }}>
                  <summary style={{ fontSize:11, fontWeight:600, color:"#8B97A8", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>View transcript</summary>
                  <div style={{ marginTop:8, padding:12, borderRadius:8, background:"#EEF2F7", fontSize:12, color:"#5B6B7D", lineHeight:1.6, maxHeight:160, overflowY:"auto" }}>{e.transcript}</div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamRoster({ data, setData, trainingData, setupData }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", role:"", department:"", email:"", notes:"" });

  const totalTrainingBlocks = trainingData.reduce((a,d) => a + d.blocks.length, 0);

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setData(data.map(m => m.id === editing ? { ...m, ...form, name: form.name.trim() } : m));
      setEditing(null);
    } else {
      setData([...data, { id: uid(), ...form, name: form.name.trim(), trainingDone: 0 }]);
    }
    setForm({ name:"", role:"", department:"", email:"", notes:"" });
    setAdding(false);
  };

  const del = (id) => setData(data.filter(m => m.id !== id));
  const startEdit = (m) => { setEditing(m.id); setForm({ name: m.name, role: m.role || "", department: m.department || "", email: m.email || "", notes: m.notes || "" }); setAdding(true); };

  const updateTraining = (id, val) => {
    const num = Math.max(0, Math.min(totalTrainingBlocks, parseInt(val) || 0));
    setData(data.map(m => m.id === id ? { ...m, trainingDone: num } : m));
  };

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const getDeptColor = (dept) => {
    const d = (dept || "").toLowerCase();
    if (d.includes("retail") || d.includes("field")) return "#E53935";
    if (d.includes("manage") || d.includes("lead")) return "#2D6CC0";
    if (d.includes("prod")) return "#C07B06";
    if (d.includes("ops") || d.includes("operation")) return "#7B2D8E";
    return "#E53935";
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13, color:"#5B6B7D", lineHeight:1.5, fontWeight:500 }}>
            {data.length} team member{data.length !== 1 ? "s" : ""} assigned to this launch
          </div>
        </div>
        <button onClick={() => { setAdding(true); setEditing(null); setForm({ name:"", role:"", department:"", email:"", notes:"" }); }} style={S.btnPrimary}>
          {I.plus} Add Member
        </button>
      </div>

      {/* Add / Edit Form */}
      {adding && (
        <div className="fade-up" style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:20, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A2332", marginBottom:14 }}>{editing ? "Edit" : "Add"} Team Member</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label style={S.label}>Full Name</label><input autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} onKeyDown={e => e.key === "Enter" && save()} placeholder="e.g. Sohit Singh" style={S.input} /></div>
            <div><label style={S.label}>Role</label><input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Field Specialist" style={S.input} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label style={S.label}>Department</label><input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="e.g. Retail Operations" style={S.input} /></div>
            <div><label style={S.label}>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="e.g. name@clutch.ca" style={S.input} /></div>
          </div>
          <div style={{ marginBottom:14 }}><label style={S.label}>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="e.g. Deployed from Markham, strong closer" style={S.input} /></div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={save} style={S.btnPrimary}>{editing ? "Save Changes" : "Add Member"}</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} style={S.btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {/* Team Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 }}>
        {data.map(m => {
          const pct = totalTrainingBlocks ? Math.round((m.trainingDone || 0) / totalTrainingBlocks * 100) : 0;
          const ac = getDeptColor(m.department || m.role);
          // Count assigned checklist items
          const allItems = setupData ? setupData.flatMap(c => c.items) : [];
          const assigned = allItems.filter(i => i.assignee === m.name);
          const assignedDone = assigned.filter(i => i.done).length;
          const assignedTotal = assigned.length;
          const assignedPct = assignedTotal ? Math.round((assignedDone / assignedTotal) * 100) : 0;
          return (
            <div key={m.id} style={{ padding:18, borderRadius:14, background:"#FFFFFF", border:"1.5px solid #DCE3EB", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", position:"relative" }}>
              {/* Header with avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background: ac, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:15, fontWeight:800, flexShrink:0 }}>
                  {getInitials(m.name)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1A2332", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                  <div style={{ fontSize:12, fontWeight:600, color: ac }}>{m.role || "No role set"}</div>
                </div>
                <div style={{ display:"flex", gap:2 }}>
                  <button onClick={() => startEdit(m)} style={S.btnGhost}>{I.edit}</button>
                  <button onClick={() => del(m.id)} style={{ ...S.btnGhost, color:"#D32F2F" }}>{I.trash}</button>
                </div>
              </div>

              {/* Department & Contact */}
              {(m.department || m.email) && (
                <div style={{ marginBottom:12, padding:"10px 12px", borderRadius:10, background:"#EEF2F7" }}>
                  {m.department && <div style={{ fontSize:12, color:"#5B6B7D", marginBottom: m.email ? 4 : 0 }}>🏢 {m.department}</div>}
                  {m.email && <div style={{ fontSize:12, color:"#5B6B7D" }}>✉️ {m.email}</div>}
                </div>
              )}

              {/* Notes */}
              {m.notes && <div style={{ fontSize:12, color:"#8B97A8", fontStyle:"italic", marginBottom:12, lineHeight:1.4 }}>{m.notes}</div>}

              {/* Assigned Checklist Items */}
              <div style={{ padding:"10px 12px", borderRadius:10, background: assignedTotal > 0 ? "rgba(229,57,53,0.03)" : "#EEF2F7", border: assignedTotal > 0 ? "1px solid rgba(229,57,53,0.1)" : "1px solid #DCE3EB", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: assignedTotal > 0 ? 6 : 0 }}>
                  <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#8B97A8" }}>Assigned Items</span>
                  {assignedTotal > 0 ? (
                    <span style={{ fontSize:12, fontWeight:700, color: assignedPct === 100 ? "#1A8F38" : "#E53935" }}>{assignedDone}/{assignedTotal}</span>
                  ) : (
                    <span style={{ fontSize:11, color:"#C5CDD8" }}>None</span>
                  )}
                </div>
                {assignedTotal > 0 && (
                  <>
                    <div style={{ height:4, borderRadius:2, background:"#DCE3EB", overflow:"hidden", marginBottom:8 }}>
                      <div style={{ height:"100%", width:`${assignedPct}%`, borderRadius:2, background: assignedPct === 100 ? "#1A8F38" : "#E53935", transition:"width .3s ease" }} />
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                      {assigned.map(ai => (
                        <div key={ai.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color: ai.done ? "#1A8F38" : "#5B6B7D" }}>
                          <span style={{ fontSize:10 }}>{ai.done ? "✅" : "⬜"}</span>
                          <span style={{ textDecoration: ai.done ? "line-through" : "none", opacity: ai.done ? 0.6 : 1 }}>{ai.text.length > 40 ? ai.text.slice(0,40) + "…" : ai.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {data.length === 0 && !adding && (
        <div style={{ textAlign:"center", padding:48 }}>
          <div style={{ color:"#8B97A8", marginBottom:6 }}>{I.people}</div>
          <div style={{ fontSize:14, color:"#8B97A8", fontWeight:500 }}>No team members added yet</div>
          <div style={{ fontSize:12, color:"#C5CDD8", marginTop:4 }}>Add your launch team to track roles and training progress</div>
        </div>
      )}
    </div>
  );
}

function RiskRegister({ risks, setRisks, debriefData, teamRoster }) {
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", severity:"medium", assignee:"", source:"" });

  // Pull risks from debriefs that haven't been imported yet
  const importableRisks = debriefData.filter(d => d.risks).map(d => ({ day: d.day, text: d.risks, id: d.id })).filter(dr => !risks.some(r => r.sourceDebriefId === dr.id));

  const importFromDebrief = (dr) => {
    const items = dr.text.split(/[;•\n]/).map(s => s.trim()).filter(Boolean);
    const newRisks = items.map(text => ({ id: uid(), title: text, description: `Imported from debrief: ${dr.day}`, severity: "medium", status: "open", assignee: "", sourceDebriefId: dr.id, createdAt: new Date().toISOString() }));
    setRisks([...risks, ...newRisks]);
  };

  const addRisk = () => {
    if (!form.title.trim()) return;
    setRisks([...risks, { id: uid(), ...form, title: form.title.trim(), status: "open", createdAt: new Date().toISOString(), sourceDebriefId: null }]);
    setForm({ title:"", description:"", severity:"medium", assignee:"", source:"" }); setAdding(false);
  };

  const updateStatus = (id, status) => setRisks(risks.map(r => r.id === id ? { ...r, status, resolvedAt: status === "resolved" ? new Date().toISOString() : null } : r));
  const del = (id) => setRisks(risks.filter(r => r.id !== id));
  const updateAssignee = (id, assignee) => setRisks(risks.map(r => r.id === id ? { ...r, assignee } : r));

  const filtered = filter === "all" ? risks : risks.filter(r => r.status === filter);
  const openCount = risks.filter(r => r.status === "open").length;
  const flaggedCount = risks.filter(r => r.status === "flagged").length;

  const sevColors = { high:"#D32F2F", medium:"#C07B06", low:"#2D6CC0" };
  const statColors = { open:"#E53935", flagged:"#C07B06", resolved:"#1A8F38" };
  const statLabels = { open:"Open", flagged:"Flagged", resolved:"Resolved" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["all","open","flagged","resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"6px 14px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", border: filter===f?"none":"1.5px solid #DCE3EB", background: filter===f?"#E53935":"#FFFFFF", color: filter===f?"#fff":"#5B6B7D", fontFamily:"'Inter', sans-serif", textTransform:"capitalize" }}>
              {f}{f==="open" && openCount > 0 ? ` (${openCount})` : f==="flagged" && flaggedCount > 0 ? ` (${flaggedCount})` : ""}
            </button>
          ))}
        </div>
        <button onClick={() => setAdding(true)} style={S.btnPrimary}>{I.plus} Add Risk</button>
      </div>

      {/* Import from debriefs */}
      {importableRisks.length > 0 && (
        <div style={{ padding:14, borderRadius:12, background:"rgba(229,57,53,0.04)", border:"1.5px solid rgba(229,57,53,0.12)", marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#E53935", marginBottom:8 }}>Risks from Debriefs — not yet imported</div>
          {importableRisks.map(dr => (
            <div key={dr.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(229,57,53,0.08)" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#E53935" }}>{dr.day}</div>
                <div style={{ fontSize:12, color:"#5B6B7D", lineHeight:1.4, marginTop:2 }}>{dr.text}</div>
              </div>
              <button onClick={() => importFromDebrief(dr)} style={{ ...S.btnPrimary, padding:"5px 12px", fontSize:11, whiteSpace:"nowrap" }}>Import</button>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <div className="fade-up" style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:20, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A2332", marginBottom:14 }}>New Risk</div>
          <div style={{ marginBottom:12 }}><label style={S.label}>Risk Title</label><input autoFocus value={form.title} onChange={e => setForm({...form, title: e.target.value})} onKeyDown={e => e.key==="Enter" && addRisk()} placeholder="e.g. Vehicle staging area not ready" style={S.input} /></div>
          <div style={{ marginBottom:12 }}><label style={S.label}>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Details, context, potential impact..." rows={2} style={S.textarea} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={S.label}>Severity</label>
              <div style={{ display:"flex", gap:6 }}>
                {["high","medium","low"].map(s => (
                  <button key={s} onClick={() => setForm({...form, severity: s})} style={{ flex:1, padding:"7px 0", borderRadius:8, fontSize:11, fontWeight:700, textTransform:"capitalize", background: form.severity===s ? sevColors[s] : "#EEF2F7", color: form.severity===s ? "#fff" : "#8B97A8", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={S.label}>Assign To</label>
              <select value={form.assignee} onChange={e => setForm({...form, assignee: e.target.value})} style={{ ...S.input, cursor:"pointer" }}>
                <option value="">Unassigned</option>
                {teamRoster.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}><button onClick={addRisk} style={S.btnPrimary}>Add Risk</button><button onClick={() => setAdding(false)} style={S.btnSecondary}>Cancel</button></div>
        </div>
      )}

      {filtered.length === 0 && !adding && (
        <div style={{ textAlign:"center", padding:48 }}>
          <div style={{ color:"#8B97A8", marginBottom:6 }}>{I.risk}</div>
          <div style={{ fontSize:14, color:"#8B97A8", fontWeight:500 }}>{filter === "all" ? "No risks tracked yet" : `No ${filter} risks`}</div>
        </div>
      )}

      {filtered.map(r => (
        <div key={r.id} style={{ padding:16, borderRadius:14, background:"#FFFFFF", border: r.status==="open" ? "1.5px solid rgba(229,57,53,0.2)" : "1.5px solid #DCE3EB", borderLeft: `4px solid ${statColors[r.status]}`, marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", opacity: r.status==="resolved" ? 0.65 : 1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#1A2332", textDecoration: r.status==="resolved" ? "line-through" : "none" }}>{r.title}</div>
              {r.description && <div style={{ fontSize:12, color:"#5B6B7D", lineHeight:1.5, marginTop:4 }}>{r.description}</div>}
            </div>
            <button onClick={() => del(r.id)} style={{ ...S.btnGhost, color:"#D32F2F" }}>{I.trash}</button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", padding:"3px 10px", borderRadius:6, background: `${sevColors[r.severity]}15`, color: sevColors[r.severity] }}>{r.severity}</span>
            <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} style={{ padding:"4px 8px", borderRadius:6, border:"1px solid #DCE3EB", fontSize:11, fontWeight:600, color: statColors[r.status], background:"#FFFFFF", cursor:"pointer", fontFamily:"'Inter', sans-serif", outline:"none" }}>
              <option value="open">Open</option>
              <option value="flagged">Flagged</option>
              <option value="resolved">Resolved</option>
            </select>
            <select value={r.assignee || ""} onChange={e => updateAssignee(r.id, e.target.value)} style={{ padding:"4px 8px", borderRadius:6, border:"1px solid #DCE3EB", fontSize:11, fontWeight:500, color:"#5B6B7D", background:"#FFFFFF", cursor:"pointer", fontFamily:"'Inter', sans-serif", outline:"none" }}>
              <option value="">Unassigned</option>
              {teamRoster.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
            {r.assignee && <span style={{ fontSize:11, fontWeight:600, color:"#2D6CC0" }}>→ {r.assignee}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Reminders({ reminders, setReminders, trainingData, dailyData }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title:"", datetime:"", type:"training", repeat:"none", notes:"" });
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "denied");

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
  };

  // Check for due reminders every 30s
  useEffect(() => {
    if (notifPermission !== "granted") return;
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(r => {
        if (r.dismissed || !r.datetime) return;
        const rDate = new Date(r.datetime);
        const diff = rDate - now;
        if (diff <= 0 && diff > -60000) {
          new Notification(`Clutch Launch OS — ${r.title}`, { body: r.notes || `${r.type} reminder`, icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔔</text></svg>" });
          setReminders(prev => prev.map(pr => pr.id === r.id ? { ...pr, dismissed: true } : pr));
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [reminders, notifPermission]);

  const addReminder = () => {
    if (!form.title.trim() || !form.datetime) return;
    setReminders([...reminders, { id: uid(), ...form, title: form.title.trim(), dismissed: false, createdAt: new Date().toISOString() }]);
    setForm({ title:"", datetime:"", type:"training", repeat:"none", notes:"" }); setAdding(false);
  };

  const dismiss = (id) => setReminders(reminders.map(r => r.id === id ? { ...r, dismissed: true } : r));
  const del = (id) => setReminders(reminders.filter(r => r.id !== id));

  const quickAdd = (title, type, minutesFromNow) => {
    const dt = new Date(Date.now() + minutesFromNow * 60000);
    setReminders([...reminders, { id: uid(), title, type, datetime: dt.toISOString(), repeat:"none", notes:"", dismissed: false, createdAt: new Date().toISOString() }]);
  };

  const now = new Date();
  const upcoming = reminders.filter(r => !r.dismissed && new Date(r.datetime) > now).sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  const past = reminders.filter(r => r.dismissed || new Date(r.datetime) <= now).sort((a,b) => new Date(b.datetime) - new Date(a.datetime));

  const typeColors = { training:"#2D6CC0", checklist:"#E53935", huddle:"#C07B06", general:"#8B97A8" };
  const typeLabels = { training:"Training", checklist:"Checklist", huddle:"Huddle", general:"General" };

  const formatDT = (iso) => { const d = new Date(iso); return d.toLocaleDateString('en-CA', { month:'short', day:'numeric' }) + ' at ' + d.toLocaleTimeString('en-CA', { hour:'numeric', minute:'2-digit' }); };
  const timeUntil = (iso) => { const diff = new Date(iso) - now; if (diff < 0) return "past"; const mins = Math.round(diff/60000); if (mins < 60) return `in ${mins}m`; const hrs = Math.round(mins/60); if (hrs < 24) return `in ${hrs}h`; return `in ${Math.round(hrs/24)}d`; };

  return (
    <div>
      {/* Notification permission */}
      {notifPermission !== "granted" && (
        <div style={{ padding:14, borderRadius:12, background:"rgba(229,57,53,0.04)", border:"1.5px solid rgba(229,57,53,0.12)", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#1A2332" }}>Enable Push Notifications</div>
            <div style={{ fontSize:12, color:"#5B6B7D", marginTop:2 }}>Get browser alerts for upcoming training, huddles, and deadlines.</div>
          </div>
          <button onClick={requestPermission} style={S.btnPrimary}>{I.bell} Enable</button>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={() => quickAdd("Team Huddle", "huddle", 15)} style={{ ...S.btnSecondary, fontSize:11, padding:"7px 14px" }}>⏰ Huddle in 15m</button>
        <button onClick={() => quickAdd("Training Block Starts", "training", 30)} style={{ ...S.btnSecondary, fontSize:11, padding:"7px 14px" }}>📚 Training in 30m</button>
        <button onClick={() => quickAdd("End of Day Debrief", "huddle", 60)} style={{ ...S.btnSecondary, fontSize:11, padding:"7px 14px" }}>📝 Debrief in 1h</button>
        <button onClick={() => setAdding(true)} style={{ ...S.btnPrimary, fontSize:11, padding:"7px 14px" }}>{I.plus} Custom</button>
      </div>

      {adding && (
        <div className="fade-up" style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:20, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A2332", marginBottom:14 }}>New Reminder</div>
          <div style={{ marginBottom:12 }}><label style={S.label}>Title</label><input autoFocus value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Morning huddle" style={S.input} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label style={S.label}>Date & Time</label><input type="datetime-local" value={form.datetime ? form.datetime.slice(0,16) : ""} onChange={e => setForm({...form, datetime: new Date(e.target.value).toISOString()})} style={S.input} /></div>
            <div>
              <label style={S.label}>Type</label>
              <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={{ ...S.input, cursor:"pointer" }}>
                <option value="training">Training</option>
                <option value="checklist">Checklist</option>
                <option value="huddle">Huddle</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom:14 }}><label style={S.label}>Notes</label><input value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="Optional details..." style={S.input} /></div>
          <div style={{ display:"flex", gap:8 }}><button onClick={addReminder} style={S.btnPrimary}>Set Reminder</button><button onClick={() => setAdding(false)} style={S.btnSecondary}>Cancel</button></div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#1A2332", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Upcoming</div>
          {upcoming.map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:14, padding:14, borderRadius:12, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:8, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ width:40, height:40, borderRadius:10, background: `${typeColors[r.type]}12`, display:"flex", alignItems:"center", justifyContent:"center", color: typeColors[r.type], flexShrink:0 }}>{I.bell}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#1A2332" }}>{r.title}</div>
                <div style={{ fontSize:11, color:"#5B6B7D", marginTop:2 }}>{formatDT(r.datetime)} · <span style={{ fontWeight:600, color: typeColors[r.type] }}>{timeUntil(r.datetime)}</span></div>
                {r.notes && <div style={{ fontSize:11, color:"#8B97A8", marginTop:2 }}>{r.notes}</div>}
              </div>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", padding:"3px 8px", borderRadius:6, background: `${typeColors[r.type]}12`, color: typeColors[r.type] }}>{typeLabels[r.type]}</span>
              <button onClick={() => dismiss(r.id)} style={S.btnGhost} title="Dismiss">{I.check}</button>
              <button onClick={() => del(r.id)} style={{ ...S.btnGhost, color:"#D32F2F" }}>{I.trash}</button>
            </div>
          ))}
        </div>
      )}

      {/* Past / Dismissed */}
      {past.length > 0 && (
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:"#8B97A8", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Past / Dismissed</div>
          {past.slice(0,10).map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:14, padding:12, borderRadius:12, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:6, opacity:0.5 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#5B6B7D" }}>{r.title}</div>
                <div style={{ fontSize:11, color:"#8B97A8" }}>{formatDT(r.datetime)}</div>
              </div>
              <button onClick={() => del(r.id)} style={{ ...S.btnGhost, color:"#D32F2F" }}>{I.trash}</button>
            </div>
          ))}
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && !adding && (
        <div style={{ textAlign:"center", padding:48 }}>
          <div style={{ color:"#8B97A8", marginBottom:6 }}>{I.bell}</div>
          <div style={{ fontSize:14, color:"#8B97A8", fontWeight:500 }}>No reminders set</div>
          <div style={{ fontSize:12, color:"#C5CDD8", marginTop:4 }}>Use quick actions above or create a custom reminder</div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_GANTT_TASKS = [
  { id:"g1", task:"Secure location & keys", category:"Facility", startDay:-14, duration:3, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g2", task:"Install signage (exterior + interior)", category:"Facility", startDay:-10, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g3", task:"Wi-Fi & network setup", category:"Technology", startDay:-10, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g4", task:"POS / payment terminal install & test", category:"Technology", startDay:-8, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g5", task:"CRM / booking system live", category:"Technology", startDay:-7, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g6", task:"Security cameras operational", category:"Technology", startDay:-7, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g7", task:"Vehicle inventory delivered & staged", category:"Inventory", startDay:-5, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g8", task:"Key management system in place", category:"Inventory", startDay:-5, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g9", task:"Customer facing items ordered (NSO)", category:"Customer", startDay:-10, duration:5, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g10", task:"Welcome area setup", category:"Customer", startDay:-3, duration:2, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g11", task:"Google Business Profile live", category:"Customer", startDay:-3, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g12", task:"Team training — Day 1", category:"Training", startDay:-3, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g13", task:"Team training — Day 2", category:"Training", startDay:-2, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g14", task:"Dress rehearsal — Day 3", category:"Training", startDay:-1, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g15", task:"Compliance & safety checks", category:"Compliance", startDay:-2, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
  { id:"g16", task:"OPENING DAY", category:"Launch", startDay:0, duration:1, raci:{ r:"", a:"", c:"", i:"" }, done:false },
];

function GanttRACI({ data, setData, teamRoster }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ task:"", category:"Facility", startDay:0, duration:1 });

  const categories = [...new Set(data.map(t => t.category))];
  const catColors = { Facility:"#E53935", Technology:"#2D6CC0", Inventory:"#C07B06", Customer:"#7B2D8E", Training:"#1A8F38", Compliance:"#5B6B7D", Launch:"#E53935" };
  const getCatColor = (cat) => catColors[cat] || "#E53935";

  const minDay = Math.min(...data.map(t => t.startDay), -14);
  const maxDay = Math.max(...data.map(t => t.startDay + t.duration), 2);
  const totalDays = maxDay - minDay;
  const dayWidth = 100 / totalDays;

  const toggleDone = (id) => setData(data.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const updateRaci = (id, role, name) => setData(data.map(t => t.id === id ? { ...t, raci: { ...t.raci, [role]: name } } : t));
  const del = (id) => setData(data.filter(t => t.id !== id));

  const addTask = () => {
    if (!form.task.trim()) return;
    setData([...data, { id: uid(), task: form.task.trim(), category: form.category, startDay: form.startDay, duration: form.duration, raci: { r:"", a:"", c:"", i:"" }, done: false }]);
    setForm({ task:"", category:"Facility", startDay:0, duration:1 }); setAdding(false);
  };

  const saveEdit = (id) => {
    if (!form.task.trim()) return;
    setData(data.map(t => t.id === id ? { ...t, task: form.task.trim(), category: form.category, startDay: form.startDay, duration: form.duration } : t));
    setEditing(null);
  };

  const raciLabels = { r:"Responsible", a:"Accountable", c:"Consulted", i:"Informed" };
  const raciColors = { r:"#E53935", a:"#2D6CC0", c:"#C07B06", i:"#8B97A8" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:13, color:"#5B6B7D", fontWeight:500 }}>Day-relative timeline for your store launch. Day 0 = Opening Day.</div>
        <button onClick={() => { setAdding(true); setEditing(null); setForm({ task:"", category:"Facility", startDay:0, duration:1 }); }} style={S.btnPrimary}>{I.plus} Add Task</button>
      </div>

      {adding && (
        <div className="fade-up" style={{ padding:20, borderRadius:16, background:"#FFFFFF", border:"1.5px solid #DCE3EB", marginBottom:20, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#1A2332", marginBottom:14 }}>Add Task</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 120px", gap:12, marginBottom:12 }}>
            <div><label style={S.label}>Task Name</label><input autoFocus value={form.task} onChange={e => setForm({...form, task: e.target.value})} onKeyDown={e => e.key==="Enter" && addTask()} placeholder="e.g. Install POS terminal" style={S.input} /></div>
            <div><label style={S.label}>Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{...S.input, cursor:"pointer"}}>{["Facility","Technology","Inventory","Customer","Training","Compliance","Launch"].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div><label style={S.label}>Start (days from opening, negative = before)</label><input type="number" value={form.startDay} onChange={e => setForm({...form, startDay: parseInt(e.target.value)||0})} style={S.input} /></div>
            <div><label style={S.label}>Duration (days)</label><input type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: Math.max(1, parseInt(e.target.value)||1)})} style={S.input} /></div>
          </div>
          <div style={{ display:"flex", gap:8 }}><button onClick={addTask} style={S.btnPrimary}>Add Task</button><button onClick={() => setAdding(false)} style={S.btnSecondary}>Cancel</button></div>
        </div>
      )}

      {/* ═══ GANTT TIMELINE ═══ */}
      {(() => {
        const cellW = 50;
        const taskColW = 260;
        const tableW = taskColW + totalDays * cellW;
        return (
        <div style={{ background:"#FFFFFF", borderRadius:16, border:"1.5px solid #DCE3EB", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", overflowX:"auto" }}>
          <table style={{ width: tableW, borderCollapse:"collapse", tableLayout:"fixed" }}>
            <colgroup>
              <col style={{ width: taskColW }} />
              {Array.from({ length: totalDays }, (_, i) => <col key={i} style={{ width: cellW }} />)}
            </colgroup>
            <thead>
              <tr style={{ background:"#EEF2F7" }}>
                <th style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#8B97A8", borderBottom:"1.5px solid #DCE3EB", borderRight:"1.5px solid #DCE3EB" }}>Task</th>
                {Array.from({ length: totalDays }, (_, i) => {
                  const day = minDay + i;
                  const isOpening = day === 0;
                  return <th key={i} style={{ padding:"10px 0", textAlign:"center", fontSize:9, fontWeight:700, color: isOpening?"#E53935":"#8B97A8", background: isOpening?"rgba(229,57,53,0.08)":"transparent", borderBottom:"1.5px solid #DCE3EB", borderRight:"1px solid #E4EAF0" }}>{day === 0 ? "DAY 0" : day > 0 ? `+${day}` : day}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map(t => {
                const cc = getCatColor(t.category);
                const startCol = t.startDay - minDay;
                return (
                  <tr key={t.id} style={{ borderBottom:"1px solid #EEF2F7" }}>
                    <td style={{ padding:"8px 12px", borderRight:"1.5px solid #EEF2F7", verticalAlign:"middle" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <button onClick={() => toggleDone(t.id)} style={{ width:18, height:18, minWidth:18, borderRadius:5, border: t.done?"none":"1.5px solid #C5CDD8", background: t.done?"#1A8F38":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", padding:0, flexShrink:0 }}>
                          {t.done && <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color: t.done?"#8B97A8":"#1A2332", textDecoration: t.done?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.task}</div>
                          <div style={{ fontSize:9, fontWeight:700, color: cc, textTransform:"uppercase", marginTop:1 }}>{t.category}</div>
                        </div>
                        <button onClick={() => del(t.id)} style={{...S.btnGhost, color:"#D32F2F", padding:2, flexShrink:0}}>{I.trash}</button>
                      </div>
                    </td>
                    {Array.from({ length: totalDays }, (_, i) => {
                      const day = minDay + i;
                      const isOpening = day === 0;
                      const isStart = i === startCol;
                      const inRange = i >= startCol && i < startCol + t.duration;
                      return (
                        <td key={i} style={{ padding:0, position:"relative", borderRight:"1px solid #F0F1F4", background: isOpening ? "rgba(229,57,53,0.03)" : "transparent", verticalAlign:"middle", height:42 }}>
                          {isOpening && <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"rgba(229,57,53,0.15)", transform:"translateX(-1px)" }} />}
                          {isStart && (
                            <div style={{ position:"absolute", left:3, right: i + t.duration - 1 < totalDays ? -(t.duration - 1) * cellW + 3 : 3, top:11, height:20, borderRadius:6, background: t.done ? "#1A8F38" : cc, opacity: t.done ? 0.5 : 0.85, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", width: t.duration * cellW - 6, zIndex:2 }}>
                              {t.raci.r && <span style={{ fontSize:8, fontWeight:700, color:"#fff", background:"rgba(0,0,0,0.2)", padding:"1px 5px", borderRadius:3 }}>{t.raci.r.split(' ')[0]}</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        );
      })()}

      {data.length === 0 && !adding && (
        <div style={{ textAlign:"center", padding:48 }}>
          <div style={{ color:"#8B97A8", marginBottom:6 }}>{I.gantt}</div>
          <div style={{ fontSize:14, color:"#8B97A8", fontWeight:500 }}>No tasks in the timeline</div>
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { section: "STORE LAUNCH", items: [
    { key: "setup", label: "Store Setup", icon: I.checklist },
    { key: "gantt", label: "Launch Timeline", icon: I.gantt },
    { key: "team", label: "Team Roster", icon: I.people },
    { key: "risks", label: "Risk Register", icon: I.risk },
    { key: "settings", label: "Documents", icon: I.gear },
  ]},
  { section: "TEAM TRAINING", items: [
    { key: "training", label: "Training Plan", icon: I.training },
    { key: "daily", label: "Daily Structure", icon: I.daily },
    { key: "coach", label: "AI Coach", icon: I.coach },
    { key: "debrief", label: "Debrief", icon: I.debrief },
  ]},
  { section: "TOOLS", items: [
    { key: "reminders", label: "Reminders", icon: I.bell },
  ]},
];

export default function ClutchLaunchSystem() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("setup");
  const [storeName, setStoreName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [setupData, setSetupData] = useState(deepClone(DEFAULT_SETUP_CHECKLIST));
  const [trainingData, setTrainingData] = useState(deepClone(DEFAULT_TRAINING_PLAN));
  const [dailyData, setDailyData] = useState(deepClone(DEFAULT_DAILY_STRUCTURE));
  const [debriefData, setDebriefData] = useState([]);
  const [teamRoster, setTeamRoster] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [ganttData, setGanttData] = useState(deepClone(DEFAULT_GANTT_TASKS));
  const [reminders, setReminders] = useState([]);
  const [attachments, setAttachments] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { (async () => { const s=await loadState(); if(s){if(s.storeName)setStoreName(s.storeName);if(s.setupData)setSetupData(s.setupData);if(s.trainingData)setTrainingData(s.trainingData);if(s.dailyData)setDailyData(s.dailyData);if(s.debriefData)setDebriefData(s.debriefData);if(s.teamRoster)setTeamRoster(s.teamRoster);if(s.riskData)setRiskData(s.riskData);if(s.ganttData)setGanttData(s.ganttData);if(s.reminders)setReminders(s.reminders);if(s.attachments)setAttachments(s.attachments);} setLoaded(true); })(); }, []);
  useEffect(() => { if(!loaded) return; saveState({storeName,setupData,trainingData,dailyData,debriefData,teamRoster,riskData,ganttData,reminders,attachments}); }, [storeName,setupData,trainingData,dailyData,debriefData,teamRoster,riskData,ganttData,reminders,attachments,loaded]);
  const handleReset = async () => { setSetupData(deepClone(DEFAULT_SETUP_CHECKLIST)); setTrainingData(deepClone(DEFAULT_TRAINING_PLAN)); setDailyData(deepClone(DEFAULT_DAILY_STRUCTURE)); setDebriefData([]); setTeamRoster([]); setRiskData([]); setGanttData(deepClone(DEFAULT_GANTT_TASKS)); setReminders([]); setAttachments({}); setStoreName(""); setShowReset(false); try{await window.storage.delete(STORE_KEY);}catch{} };

  if(!loaded) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#EEF2F7"}}><div style={{width:36,height:36,border:"3px solid #DCE3EB",borderTopColor:"#E53935",borderRadius:"50%",animation:"spin .7s linear infinite"}} /><style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style></div>;

  const sd=setupData.reduce((a,c)=>a+c.items.filter(i=>i.done).length,0), st=setupData.reduce((a,c)=>a+c.items.length,0);
  const td=trainingData.reduce((a,d)=>a+d.blocks.filter(b=>b.done).length,0), tt=trainingData.reduce((a,d)=>a+d.blocks.length,0);
  const spct = st ? Math.round((sd/st)*100) : 0;
  const tpct = tt ? Math.round((td/tt)*100) : 0;

  const pageTitle = { setup:"Store Setup Checklist", gantt:"Launch Timeline", team:"Team Roster", risks:"Risk Register", settings:"Documents & Uploads", training:"Training Plan", daily:"Daily Structure", coach:"AI Coach", debrief:"Debrief", reminders:"Reminders" }[page] || "";
  const openRisks = riskData.filter(r => r.status !== "resolved").length;

  const navTo = (key) => { setPage(key); setSidebarOpen(false); };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#EEF2F7", color:"#1A2332", fontFamily:"'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        input::placeholder, textarea::placeholder { color:#8B97A8; }
        input:focus, textarea:focus { border-color: #E53935 !important; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .fade-up { animation:fadeUp .35s cubic-bezier(.25,.46,.45,.94); }
        .nav-item:hover { background:rgba(229,57,53,0.04); }
        .sidebar-slide { animation:slideIn .25s ease; }
        .overlay-fade { animation:fadeIn .2s ease; }
        @media (min-width:901px) { .mobile-only { display:none !important; } .sidebar-desktop { display:flex !important; } .sidebar-mobile { display:none !important; } }
        @media (max-width:900px) { .mobile-only { display:flex !important; } .sidebar-desktop { display:none !important; } .sidebar-mobile { display:flex !important; } .summary-cards { flex-direction:column !important; } .top-pills { display:none !important; } .top-bar-inner { padding:0 16px !important; } .page-content { padding:20px 16px 48px !important; } .summary-card-row { padding:20px 16px 0 !important; } }
        @media (max-width:600px) { .scenario-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* ═══ Sidebar — Desktop (persistent) ═══ */}
      <div className="sidebar-desktop" style={{ width:230, minWidth:230, background:"#FFFFFF", borderRight:"1.5px solid #DCE3EB", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, overflow:"auto" }}>
        <div style={{ padding:"20px 20px 16px", borderBottom:"1.5px solid #DCE3EB" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#E53935", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:15, fontWeight:800, boxShadow:"0 2px 8px rgba(229,57,53,0.2)" }}>C</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, color:"#1A2332", lineHeight:1.2 }}>Clutch Launch OS</div>
              <div style={{ fontSize:10, color:"#8B97A8", fontWeight:500 }}>Store Opening System</div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, padding:"12px 10px" }}>
          {NAV_ITEMS.map(section => (
            <div key={section.section} style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8B97A8", padding:"0 10px", marginBottom:8 }}>{section.section}</div>
              {section.items.map(item => {
                const active = page === item.key;
                return (
                  <button key={item.key} onClick={() => navTo(item.key)} className="nav-item" style={{
                    display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", borderRadius:10,
                    background: active ? "rgba(229,57,53,0.08)" : "transparent",
                    border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif",
                    fontSize:13, fontWeight: active ? 700 : 500, color: active ? "#E53935" : "#5B6B7D", transition:"all .15s",
                  }}>
                    <span style={{ display:"inline-flex", opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:"1.5px solid #DCE3EB" }}>
          <button onClick={()=>setShowReset(true)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", borderRadius:8, background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif", fontSize:12, fontWeight:500, color:"#8B97A8" }}>{I.reset} Reset Data</button>
          <div style={{ fontSize:10, color:"#C5CDD8", marginTop:8, paddingLeft:10 }}>Clutch Launch OS v1</div>
        </div>
      </div>

      {/* ═══ Sidebar — Mobile/iPad (overlay) ═══ */}
      {sidebarOpen && (
        <>
          <div className="overlay-fade" onClick={()=>setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:99 }} />
          <div className="sidebar-mobile sidebar-slide" style={{ position:"fixed", left:0, top:0, bottom:0, width:260, background:"#FFFFFF", zIndex:100, display:"flex", flexDirection:"column", boxShadow:"4px 0 20px rgba(0,0,0,0.1)", overflow:"auto" }}>
            <div style={{ padding:"20px 20px 16px", borderBottom:"1.5px solid #DCE3EB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#E53935", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:15, fontWeight:800, boxShadow:"0 2px 8px rgba(229,57,53,0.2)" }}>C</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:"#1A2332", lineHeight:1.2 }}>Clutch Launch OS</div>
                  <div style={{ fontSize:10, color:"#8B97A8", fontWeight:500 }}>Store Opening System</div>
                </div>
              </div>
              <button onClick={()=>setSidebarOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#8B97A8", padding:6 }}>{I.close}</button>
            </div>
            <div style={{ flex:1, padding:"12px 10px" }}>
              {NAV_ITEMS.map(section => (
                <div key={section.section} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#8B97A8", padding:"0 10px", marginBottom:8 }}>{section.section}</div>
                  {section.items.map(item => {
                    const active = page === item.key;
                    return (
                      <button key={item.key} onClick={() => navTo(item.key)} style={{
                        display:"flex", alignItems:"center", gap:10, width:"100%", padding:"12px 14px", borderRadius:10,
                        background: active ? "rgba(229,57,53,0.08)" : "transparent",
                        border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif",
                        fontSize:14, fontWeight: active ? 700 : 500, color: active ? "#E53935" : "#5B6B7D",
                      }}>
                        <span style={{ display:"inline-flex", opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 16px", borderTop:"1.5px solid #DCE3EB" }}>
              <button onClick={()=>{setShowReset(true);setSidebarOpen(false);}} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 10px", borderRadius:8, background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif", fontSize:13, fontWeight:500, color:"#8B97A8" }}>{I.reset} Reset Data</button>
            </div>
          </div>
        </>
      )}

      {/* ═══ Main Content ═══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Top Bar */}
        <div className="top-bar-inner" style={{ background:"#FFFFFF", borderBottom:"1.5px solid #DCE3EB", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Hamburger — mobile only */}
            <button className="mobile-only" onClick={()=>setSidebarOpen(true)} style={{ display:"none", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", color:"#1A2332", padding:4 }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span style={{ fontSize:15, fontWeight:700, color:"#1A2332" }}>{pageTitle}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Stats pills — desktop */}
            <div className="top-pills" style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, background:"rgba(229,57,53,0.06)", border:"1px solid rgba(229,57,53,0.12)" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#E53935" }}>{spct}%</span>
                <span style={{ fontSize:11, fontWeight:500, color:"#5B6B7D" }}>Setup</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, background:"rgba(229,57,53,0.06)", border:"1px solid rgba(229,57,53,0.12)" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#E53935" }}>{tpct}%</span>
                <span style={{ fontSize:11, fontWeight:500, color:"#5B6B7D" }}>Training</span>
              </div>
              {openRisks > 0 && (
                <button onClick={() => navTo("risks")} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, background:"rgba(211,47,47,0.08)", border:"1px solid rgba(211,47,47,0.2)", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"#D32F2F" }}>{openRisks}</span>
                  <span style={{ fontSize:11, fontWeight:500, color:"#D32F2F" }}>Risks</span>
                </button>
              )}
              <div style={{ width:1, height:20, background:"#DCE3EB" }} />
            </div>
            {/* Store name */}
            {editingName ? (
              <input autoFocus value={storeName} onChange={e=>setStoreName(e.target.value)} onBlur={()=>setEditingName(false)} onKeyDown={e=>e.key==="Enter"&&setEditingName(false)} placeholder="Store name..." style={{ fontSize:13, fontWeight:700, background:"transparent", border:"none", borderBottom:"2px solid #E53935", color:"#1A2332", fontFamily:"'Inter', sans-serif", outline:"none", padding:"4px 0", width:140 }} />
            ) : (
              <button onClick={()=>setEditingName(true)} style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color: storeName?"#1A2332":"#8B97A8", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter', sans-serif" }}>{I.pin} {storeName || "Store →"}</button>
            )}
          </div>
        </div>

        {/* Reset confirmation */}
        {showReset && (
          <div style={{ margin:"16px 16px 0" }} className="fade-up">
            <div style={{ padding:14, background:"rgba(211,47,47,0.06)", borderRadius:12, display:"flex", justifyContent:"space-between", alignItems:"center", border:"1.5px solid rgba(211,47,47,0.15)", flexWrap:"wrap", gap:10 }}>
              <span style={{ fontSize:13, color:"#D32F2F", fontWeight:600 }}>Reset all data for a new store launch?</span>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setShowReset(false)} style={S.btnSecondary}>Cancel</button>
                <button onClick={handleReset} style={{...S.btnPrimary, background:"#D32F2F", boxShadow:"0 2px 8px rgba(211,47,47,.25)"}}>Reset</button>
              </div>
            </div>
          </div>
        )}

        {/* Summary cards — show on setup page */}
        {page === "setup" && (
          <div className="summary-cards summary-card-row" style={{ display:"flex", gap:16, padding:"24px 32px 0" }}>
            {[
              { label:"SETUP", val:`${sd}/${st}`, sub:"Items Complete", color:"#E53935", pct:spct },
              { label:"TEAM", val:String(teamRoster.length), sub:"Members Assigned", color:"#7B2D8E", pct:null },
              { label:"TRAINING", val:`${td}/${tt}`, sub:"Blocks Complete", color:"#2D6CC0", pct:tpct },
            ].map(c => (
              <div key={c.label} style={{ flex:1, padding:"20px 22px", borderRadius:16, background:c.color, color:"#fff", position:"relative", overflow:"hidden", boxShadow:`0 4px 16px ${c.color}33` }}>
                <div style={{ position:"absolute", right:-20, top:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", opacity:0.8, marginBottom:8 }}>{c.label}</div>
                <div style={{ fontSize:28, fontWeight:900, lineHeight:1, marginBottom:4 }}>{c.val}</div>
                <div style={{ fontSize:12, fontWeight:500, opacity:0.85 }}>{c.sub}</div>
                {c.pct !== null && (
                  <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.25)", marginTop:12, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${c.pct}%`, borderRadius:2, background:"#fff", transition:"width .5s ease" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Page content */}
        <div className="fade-up page-content" key={page} style={{ padding:"24px 32px 48px", flex:1 }}>
          {page === "setup" && <SetupChecklist data={setupData} setData={setSetupData} teamRoster={teamRoster} />}
          {page === "gantt" && <GanttRACI data={ganttData} setData={setGanttData} teamRoster={teamRoster} />}
          {page === "team" && <TeamRoster data={teamRoster} setData={setTeamRoster} trainingData={trainingData} setupData={setupData} />}
          {page === "risks" && <RiskRegister risks={riskData} setRisks={setRiskData} debriefData={debriefData} teamRoster={teamRoster} />}
          {page === "settings" && <SetupSettings categories={setupData.map(c=>c.category)} attachments={attachments} setAttachments={setAttachments} onBack={()=>setPage("setup")} setupData={setupData} setSetupData={setSetupData} />}
          {page === "training" && <TrainingPlan data={trainingData} setData={setTrainingData} />}
          {page === "daily" && <DailyStructure data={dailyData} setData={setDailyData} />}
          {page === "coach" && <AICoach />}
          {page === "debrief" && <Debrief data={debriefData} setData={setDebriefData} />}
          {page === "reminders" && <Reminders reminders={reminders} setReminders={setReminders} trainingData={trainingData} dailyData={dailyData} />}
        </div>
      </div>
    </div>
  );
}