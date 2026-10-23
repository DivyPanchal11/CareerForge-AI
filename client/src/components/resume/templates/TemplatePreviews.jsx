import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Scaled A4 Container
// Renders content on a 600px × 848px standard A4 canvas and scales
// down with 100% vector sharpness to fit any container.
// ─────────────────────────────────────────────────────────────
export function A4Page({ children, className = "" }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.33);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      if (w > 0) setScale(w / 600);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateScale = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setScale(w / 600);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-white select-none pointer-events-none ${className}`}
    >
      <div
        style={{
          width: "600px",
          height: "848px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 bg-white origin-top-left overflow-hidden text-gray-800"
      >
        {children}
      </div>
    </div>
  );
}

// Reusable avatar component with graceful fallback
function Avatar({ src, alt, initials, className = "w-16 h-16 rounded-full" }) {
  const [hasError, setHasError] = useState(false);
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. CLASSIC CLEAR (Emily Carter - Project Manager, Toronto)
// ─────────────────────────────────────────────────────────────
export function ClassicClearPreview() {
  return (
    <A4Page>
      <div className="p-7 font-serif text-[10px] leading-relaxed text-gray-800 flex flex-col space-y-2.5">
        {/* Header */}
        <div className="text-center pb-2 border-b border-gray-400">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Emily Carter</h1>
          <p className="text-xs text-gray-600 mt-0.5 font-sans">Project Manager</p>
          <p className="text-[9.5px] text-gray-500 mt-1 font-sans">
            Toronto, Canada &nbsp;•&nbsp; emily.carter@email.com &nbsp;•&nbsp; +1 416-235-1847 &nbsp;•&nbsp; linkedin.com/in/emily-carter
          </p>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">Summary</h2>
          <p className="text-[9.5px] text-gray-700 leading-normal">
            Project Manager with six years of experience coordinating cross-functional initiatives in technology and business operations. Skilled in stakeholder communication, project planning, risk tracking, and delivery governance across complex environments. Known for building practical workflows, improving team alignment, and keeping priorities moving under tight deadlines.
          </p>
        </div>

        {/* Professional Experience */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1.5">Professional Experience</h2>

          <div className="mb-2">
            <div className="flex justify-between items-baseline font-bold text-[10.5px] text-gray-900">
              <span>Project Manager &nbsp;<span className="font-normal text-gray-600">Northbridge Digital</span></span>
              <span className="text-[9.5px] text-gray-500 font-normal">2021/01 - Present | Toronto, Canada</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Managed release plans across product, engineering, and operations teams with 98% sprint completion.</li>
              <li>Coordinated stakeholder updates, risk reviews, and executive milestone reporting.</li>
              <li>Improved delivery tracking, reducing cross-department communication gaps by 30%.</li>
            </ul>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-baseline font-bold text-[10.5px] text-gray-900">
              <span>Project Coordinator &nbsp;<span className="font-normal text-gray-600">Maplefield Solutions</span></span>
              <span className="text-[9.5px] text-gray-500 font-normal">2018/07 - 2021/12 | Toronto, Canada</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Supported schedules, budgets, and documentation for transformation initiatives.</li>
              <li>Facilitated sprint planning and maintained cross-department action logs.</li>
              <li>Escalated delivery blockers early to preserve project target deadlines.</li>
            </ul>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-baseline font-bold text-[10.5px] text-gray-900">
              <span>Operations Analyst &nbsp;<span className="font-normal text-gray-600">BrightPath Services</span></span>
              <span className="text-[9.5px] text-gray-500 font-normal">2017/01 - 2018/06 | Ottawa, Canada</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Analyzed workflow data to identify service delivery delays and efficiency bottlenecks.</li>
              <li>Prepared executive reports supporting resource planning and project prioritization.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline font-bold text-[10px] text-gray-900">
              <span>Project Management Assistant &nbsp;<span className="font-normal text-gray-600">University of Toronto</span></span>
              <span className="text-[9px] text-gray-500 font-normal">2016/09 - 2017/04 | Toronto, Canada</span>
            </div>
            <p className="text-[9px] text-gray-600">• Supported faculty project administration, research grants, and departmental schedule coordination.</p>
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">Education</h2>
          <div className="flex justify-between items-baseline text-[10px]">
            <span className="font-bold text-gray-900">Bachelor of Commerce in Management &nbsp;<span className="font-normal text-gray-600">Toronto Metropolitan University</span></span>
            <span className="text-[9.5px] text-gray-500">2013 - 2017 | Toronto, Canada</span>
          </div>
          <div className="flex justify-between items-baseline text-[10px] mt-0.5">
            <span className="font-bold text-gray-900">Diploma in Business Administration &nbsp;<span className="font-normal text-gray-600">Algonquin College</span></span>
            <span className="text-[9.5px] text-gray-500">2011 - 2013 | Ottawa, Canada</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">Skills</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[9.5px] text-gray-700">
            <div>• Project Planning &nbsp;&nbsp;&nbsp;&nbsp;• Stakeholder Management</div>
            <div>• Risk Management &nbsp;&nbsp;&nbsp;&nbsp;• Agile Delivery &amp; Scrums</div>
            <div>• Budget Tracking &nbsp;&nbsp;&nbsp;&nbsp;• Process Improvement</div>
            <div>• Jira &amp; Confluence &nbsp;&nbsp;&nbsp;&nbsp;• Microsoft Project &amp; Smartsheet</div>
          </div>
        </div>

        {/* Certificates & Languages */}
        <div className="pt-1.5 border-t border-gray-300 flex justify-between text-[9.5px] text-gray-700 font-sans">
          <div>
            <span className="font-bold text-gray-900">Certificates: </span>
            <span>PMP® • Certified ScrumMaster (CSM) • Google PM</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">Languages: </span>
            <span>English (Native) • French (Fluent)</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. ATLANTIC BLUE (Brian T. Wayne - Business Development)
// ─────────────────────────────────────────────────────────────
export function AtlanticPreview() {
  return (
    <A4Page>
      <div className="flex h-full select-none text-[10px] leading-relaxed">
        {/* Navy Sidebar (37%) */}
        <div className="w-[220px] bg-[#1E293B] text-white p-6 flex flex-col space-y-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Brian T. Wayne</h1>
            <p className="text-[11px] text-slate-300 italic mt-0.5">Business Development Consultant</p>

            <div className="my-3 flex justify-center">
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                alt="Brian T. Wayne"
                initials="BW"
                className="w-20 h-20 rounded-full border-2 border-white/40 shadow-md"
              />
            </div>

            <div className="space-y-1 text-[9.5px] text-slate-300 mt-2">
              <p>✉ brian@wayne.com</p>
              <p>📞 1-213-754-2010</p>
              <p>📍 Redondo Beach, CA</p>
              <p>🔗 linkedin.com/in/brian-wayne</p>
              <p>🌐 wayneconsulting.com</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-1">Profile</h2>
            <p className="text-[9px] text-slate-300 leading-normal">
              Senior Business Development Consultant with an MBA and 9+ years driving strategic growth, partner ecosystem expansion, and multi-million-dollar B2B deals across tech and financial services.
            </p>
          </div>

          <div className="pt-2 border-t border-white/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-1">Skills</h2>
            <div className="space-y-0.5 text-[9px] text-slate-300">
              <p>• Strategic Partnerships</p>
              <p>• Enterprise Deal Structuring</p>
              <p>• Market Expansion &amp; GTM</p>
              <p>• Executive Relationship Mgmt</p>
              <p>• Financial Due Diligence</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-1">Languages</h2>
            <div className="space-y-1 text-[9px] text-slate-300">
              <div className="flex justify-between"><span>English</span><span className="font-bold">•••••</span></div>
              <div className="flex justify-between"><span>Spanish</span><span className="font-bold">••••◦</span></div>
              <div className="flex justify-between"><span>German</span><span className="font-bold">•••◦◦</span></div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-1">Awards</h2>
            <p className="text-[8.5px] text-slate-300">Outstanding Business Student Award, USC (2016)</p>
            <p className="text-[8.5px] text-slate-300 mt-0.5">Dean's Honors List, UCLA (2012–2014)</p>
          </div>
        </div>

        {/* Right White Column (63%) */}
        <div className="flex-1 p-6 flex flex-col space-y-3 bg-white text-gray-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
              Work Experience
            </h2>

            <div className="mb-2.5">
              <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900">
                <span>Applewood Advisory Inc.</span>
                <span className="text-[9.5px] text-gray-400 font-normal">2022 - Present | New York, NY</span>
              </div>
              <p className="text-[10px] text-slate-600 italic font-semibold">Senior Business Development Consultant</p>
              <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-1">
                <li>Developed and executed growth strategy resulting in 32% YoY revenue growth.</li>
                <li>Negotiated joint venture agreements with 6 tier-one enterprise distribution partners.</li>
                <li>Directed multi-disciplinary teams in closing $18M in annualized contract volume.</li>
              </ul>
            </div>

            <div className="mb-2.5">
              <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900">
                <span>Beacon Global Capital</span>
                <span className="text-[9.5px] text-gray-400 font-normal">2018 - 2022 | Los Angeles, CA</span>
              </div>
              <p className="text-[10px] text-slate-600 italic font-semibold">Corporate Development Manager</p>
              <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-1">
                <li>Built acquisition pipelines and performed financial modeling on 14 target companies.</li>
                <li>Facilitated post-merger commercial integrations across commercial banking units.</li>
                <li>Managed executive stakeholder workshops to align commercial KPIs.</li>
              </ul>
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900">
                <span>Crestview Advisory Services</span>
                <span className="text-[9.5px] text-gray-400 font-normal">2016 - 2018 | San Francisco, CA</span>
              </div>
              <p className="text-[10px] text-slate-600 italic font-semibold">Associate Consultant - Growth Strategy</p>
              <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
                <li>Conducted market sizing and competitor intelligence benchmarks for Fortune 500 clients.</li>
                <li>Structured pitch decks and financial decks for senior partners.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-1.5">
              Education
            </h2>
            <div className="mb-1.5 text-[9.5px]">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Master of Business Administration (MBA)</span>
                <span className="text-gray-500 font-normal">2014 - 2016</span>
              </div>
              <p className="text-gray-600">USC Marshall School of Business • Finance &amp; Strategy Concentration</p>
            </div>
            <div className="text-[9.5px]">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Bachelor of Arts in Economics</span>
                <span className="text-gray-500 font-normal">2010 - 2014</span>
              </div>
              <p className="text-gray-600">University of California, Los Angeles (UCLA) • Cum Laude</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-1.5">
              Key Strategic Projects
            </h2>
            <p className="text-[9.5px] text-gray-700 leading-normal">
              <strong>Ecosystem Partnership Launch:</strong> Orchestrated commercial alliance between cloud infrastructure vendor and national retailer, generating $4.5M net new ARR in first 12 months.
            </p>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. MERCURY FLOW (Camila Rivera - Sales Manager, Miami)
// ─────────────────────────────────────────────────────────────
export function MercuryPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2.5 select-none text-[10px] leading-relaxed text-gray-800">
        <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
          <Avatar
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
            alt="Camila Rivera"
            initials="CR"
            className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Camila Rivera</h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">Sales Manager</p>
            <div className="flex flex-wrap gap-x-3 text-[9.5px] text-gray-500 mt-1">
              <span>✉ camila.rivera@email.com</span>
              <span>📞 +1 555 012 3784</span>
              <span>📍 Miami, United States</span>
              <span>🔗 linkedin.com/in/camila-rivera</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-100 text-gray-800 font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full text-center mb-1">
            Summary
          </div>
          <p className="text-[9.5px] text-gray-700 leading-normal text-center px-4">
            Results-driven sales professional with 6+ years of experience in account growth, client relationship management, and pipeline development across B2B environments. Strong track record of improving conversion rates, exceeding quarterly quotas, and building trusted alliances in English- and Spanish-speaking markets.
          </p>
        </div>

        <div>
          <div className="bg-gray-100 text-gray-800 font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full text-center mb-1.5">
            Professional Experience
          </div>

          <div className="grid grid-cols-12 gap-3 mb-2 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">01/2021 - Present</p>
              <p>Miami, United States</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">BrightPath Business Solutions</p>
              <p className="text-gray-500 italic font-medium">Sales Manager</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Manage a portfolio of mid-market commercial accounts across retail and fintech.</li>
                <li>Exceeded quarterly sales targets by 18%, boosting account retention by 14%.</li>
                <li>Built consultative renewal pipelines generating $3.2M in annual recurring contract value.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 mb-2 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">03/2018 - 12/2020</p>
              <p>Orlando, United States</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">Crestview Distribution Group</p>
              <p className="text-gray-500 italic font-medium">Senior Account Executive</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Prospected, pitched, and signed 42 new corporate clients across Southeast territory.</li>
                <li>Partnered with customer success teams to decrease client onboarding churn by 22%.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">06/2016 - 02/2018</p>
              <p>Tampa, United States</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">Vanguard Commercial Services</p>
              <p className="text-gray-500 italic font-medium">Inside Sales Representative</p>
              <p className="text-gray-700 mt-0.5">• Managed CRM lead qualification and scheduled 60+ executive discovery demos per month.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-100 text-gray-800 font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full text-center mb-1">
            Education
          </div>
          <div className="grid grid-cols-12 gap-3 text-[9.5px]">
            <div className="col-span-4 text-gray-500">2012 - 2016 | Miami, FL</div>
            <div className="col-span-8">
              <p className="font-bold text-gray-900">Bachelor of Science in Marketing &amp; International Business</p>
              <p className="text-gray-600">Florida International University • Magna Cum Laude</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-100 text-gray-800 font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full text-center mb-1">
            Skills &amp; Languages
          </div>
          <div className="flex justify-between text-[9px] text-gray-700 px-3">
            <span>• Account Management &nbsp;&nbsp;• CRM Management (Salesforce) &nbsp;&nbsp;• Sales Forecasting &nbsp;&nbsp;• Contract Negotiation</span>
            <span className="font-bold text-gray-900">English (Native) • Spanish (Bilingual)</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. TRUE BLUE (Daniel Mercer - Vice President of Sales, Chicago)
// ─────────────────────────────────────────────────────────────
export function TrueBluePreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2.5 select-none text-[10px] leading-relaxed text-gray-800">
        <div>
          <h1 className="text-2xl font-black text-[#1D4ED8] tracking-tight">Daniel Mercer</h1>
          <p className="text-xs text-gray-600 font-semibold mt-0.5">Vice President of Sales</p>
          <p className="text-[9.5px] text-gray-500 mt-1">
            ✉ daniel.mercer@email.com &nbsp;•&nbsp; 📞 +1 312 555 0187 &nbsp;•&nbsp; 📍 Chicago, IL &nbsp;•&nbsp; 🔗 linkedin.com/in/daniel-mercer
          </p>
          <div className="border-b-2 border-[#1D4ED8] mt-2" />
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#1D4ED8] uppercase border-b border-[#1D4ED8] pb-0.5 mb-1">
            Summary
          </h2>
          <p className="text-[9.5px] text-gray-700 leading-normal">
            Sales leader with 8+ years of experience driving revenue growth in B2B SaaS and commercial software. Skilled in enterprise sales execution, territory planning, pipeline hygiene, and mentoring high-performing sales squads. Delivered consistent quota over-performance across mid-market and enterprise accounts.
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#1D4ED8] uppercase border-b border-[#1D4ED8] pb-0.5 mb-1.5">
            Professional Experience
          </h2>

          <div className="mb-2">
            <div className="flex justify-between items-baseline font-bold text-[10.5px]">
              <span className="text-gray-900">Sales Manager, <span className="text-[#1D4ED8]">Nexora Solutions</span></span>
              <span className="text-gray-400 text-[9px] font-normal">2022 - Present | Chicago, IL</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Manage 10 senior account executives across Midwest territory with $12M quota.</li>
              <li>Improved pipeline forecast reporting accuracy to within 4% of target.</li>
              <li>Led high-stakes contract negotiations with Fortune 500 manufacturing accounts.</li>
            </ul>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-baseline font-bold text-[10.5px]">
              <span className="text-gray-900">Senior Sales Specialist, <span className="text-[#1D4ED8]">BrightScale Systems</span></span>
              <span className="text-gray-400 text-[9px] font-normal">2019 - 2022 | Chicago, IL</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Delivered 135% of annual sales quota through strategic account penetration.</li>
              <li>Built deep partnerships with regional clients in healthcare and commercial banking.</li>
              <li>Collaborated with marketing and SDR leads to double inbound discovery pipeline.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline font-bold text-[10.5px]">
              <span className="text-gray-900">Account Executive, <span className="text-[#1D4ED8]">Horizon Logic</span></span>
              <span className="text-gray-400 text-[9px] font-normal">2016 - 2019 | Milwaukee, WI</span>
            </div>
            <ul className="list-disc list-inside text-[9.5px] text-gray-700 space-y-0.5 mt-0.5">
              <li>Exceeded ramp quota within 90 days; closed 48 new logo accounts.</li>
              <li>Standardized sales objection-handling playbooks adopted company-wide.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#1D4ED8] uppercase border-b border-[#1D4ED8] pb-0.5 mb-1">
            Education
          </h2>
          <div className="flex justify-between items-baseline text-[9.5px]">
            <span className="font-bold text-gray-900">Professional Certificate in Sales Management, DePaul University</span>
            <span className="text-gray-400">2018 | Chicago, IL</span>
          </div>
          <div className="flex justify-between items-baseline text-[9.5px] mt-0.5">
            <span className="font-bold text-gray-900">Bachelor of Science in Marketing, Indiana University Bloomington</span>
            <span className="text-gray-400">2012 - 2016 | Bloomington, IN</span>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-[#1D4ED8] uppercase border-b border-[#1D4ED8] pb-0.5 mb-1">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-[9.5px] text-gray-700">
            <div>• Enterprise SaaS Sales &nbsp;&nbsp;&nbsp;&nbsp;• Territory Expansion</div>
            <div>• MEDDIC Methodology &nbsp;&nbsp;&nbsp;&nbsp;• High-Performance Coaching</div>
            <div>• Pipeline Management &nbsp;&nbsp;&nbsp;&nbsp;• Contract Pricing &amp; Terms</div>
            <div>• Salesforce &amp; Clari &nbsp;&nbsp;&nbsp;&nbsp;• Cross-Functional GTM</div>
          </div>
        </div>

        <div className="pt-1 border-t border-gray-200 flex justify-between text-[9px] text-gray-700">
          <div>
            <span className="font-bold text-[#1D4ED8]">Certifications: </span>
            <span>Salesforce Certified Administrator • HubSpot Enterprise Sales</span>
          </div>
          <div>
            <span className="font-bold text-[#1D4ED8]">Languages: </span>
            <span>English (Native) • Spanish (Working)</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. EDITORIAL RULE (Lena Hoffmann - Operations Manager, Berlin)
// ─────────────────────────────────────────────────────────────
export function EditorialPreview() {
  return (
    <A4Page>
      <div className="p-7 font-serif flex flex-col space-y-2.5 select-none text-[10px] leading-relaxed text-gray-900">
        <div className="text-center pb-2 border-b-2 border-gray-900">
          <h1 className="text-2xl font-bold tracking-wide">Lena Hoffmann</h1>
          <p className="text-xs text-gray-600 italic mt-0.5 font-sans">Operations Manager</p>
          <p className="text-[9.5px] text-gray-500 mt-1 font-sans">
            Berlin, Germany &nbsp;•&nbsp; lena.hoffmann@email.com &nbsp;•&nbsp; +49 151 4827 6391 &nbsp;•&nbsp; linkedin.com/in/lena-hoffmann
          </p>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-1">Summary</h2>
          <p className="text-[9.5px] text-gray-700 leading-normal">
            Operations leader with 7+ years of experience optimizing logistics, organizational workflows, and cross-functional teams in high-growth environments. Strong track record of automating manual bottlenecks, reducing fulfillment costs, and elevating vendor governance across European operations.
          </p>
        </div>

        <div>
          <div className="border-t-2 border-b-2 border-gray-900 py-1 mb-2 text-xs font-bold uppercase tracking-widest text-center">
            Professional Experience
          </div>

          <div className="mb-2 text-[9.5px]">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Operations Manager, Kessel &amp; Partner GmbH</span>
              <span className="text-gray-500 font-normal">2021/03 - Present | Berlin</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5 font-sans">
              <li>Manage warehouse and fulfillment operations with an annual budget of €4.8M.</li>
              <li>Re-engineered dispatch routing logic, reducing order processing turnaround by 26%.</li>
              <li>Led 35 frontline operations and logistics associates across two regional distribution hubs.</li>
            </ul>
          </div>

          <div className="mb-2 text-[9.5px]">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Supply Chain Coordinator, NeueForm Logistics</span>
              <span className="text-gray-500 font-normal">2018/06 - 2021/02 | Munich</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5 font-sans">
              <li>Oversaw customs documentation, carrier negotiations, and SLA tracking across DACH.</li>
              <li>Maintained 99.2% on-time shipment compliance under tight seasonal peaks.</li>
            </ul>
          </div>

          <div className="text-[9.5px]">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Process Analyst, Bauhaus Supply Chain</span>
              <span className="text-gray-500 font-normal">2016/09 - 2018/05 | Leipzig</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5 font-sans">
              <li>Audited 12 core standard operating procedures (SOPs) and implemented Lean 5S practices.</li>
              <li>Built weekly operations KPI dashboard for executive management.</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="border-t-2 border-b-2 border-gray-900 py-1 mb-1.5 text-xs font-bold uppercase tracking-widest text-center">
            Education
          </div>
          <div className="flex justify-between text-[9.5px] font-sans">
            <span className="font-bold">MSc in Supply Chain &amp; Operations Management, TU Berlin</span>
            <span className="text-gray-500">2014 - 2016</span>
          </div>
          <div className="flex justify-between text-[9.5px] mt-0.5 font-sans">
            <span className="font-bold">BSc in Industrial Engineering, Bauhaus-Universität Weimar</span>
            <span className="text-gray-500">2010 - 2014</span>
          </div>
        </div>

        <div>
          <div className="border-t-2 border-b-2 border-gray-900 py-1 mb-1 text-xs font-bold uppercase tracking-widest text-center">
            Skills &amp; Languages
          </div>
          <p className="text-[9.5px] text-gray-700 text-center font-sans">
            Supply Chain Strategy • Lean Six Sigma • Vendor Governance • SAP ERP • Warehouse Management (WMS) • Tableau
          </p>
          <p className="text-[9px] text-gray-500 text-center mt-1 font-sans">
            German (Native) &nbsp;|&nbsp; English (Fluent / C2) &nbsp;|&nbsp; French (Conversational)
          </p>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. SAFFRON LINE (Matteo Ricci - Head of Operations, Milan)
// ─────────────────────────────────────────────────────────────
export function SaffronPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2 select-none text-[10px] leading-relaxed">
        {/* Top Banner with Amber Divider */}
        <div className="flex items-center gap-4 pb-2 border-b-2 border-amber-600">
          <Avatar
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
            alt="Matteo Ricci"
            initials="MR"
            className="w-16 h-16 rounded-full border-2 border-amber-500 shadow-sm"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-black text-gray-900 leading-tight">Matteo Ricci</h1>
            <p className="text-xs text-amber-700 font-bold mt-0.5">Head of Operations</p>
            <p className="text-[9.5px] text-gray-500 mt-1">
              Milan, Italy &nbsp;•&nbsp; matteo.ricci@email.com &nbsp;•&nbsp; +39 347 418 2504 &nbsp;•&nbsp; linkedin.com/in/matteo-ricci
            </p>
          </div>
        </div>

        {/* 35/65 Asymmetric Columns */}
        <div className="grid grid-cols-12 gap-5 pt-1">
          {/* Left Column (35%) */}
          <div className="col-span-4 border-r border-amber-200 pr-3 space-y-2.5">
            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1 uppercase">
                Summary
              </h2>
              <p className="text-[9px] text-gray-700 leading-normal">
                Operations leader with 11+ years directing multi-site fulfillment hubs, continuous improvement, and customer service delivery across Southern Europe.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1 uppercase">
                Core Competencies
              </h2>
              <ul className="space-y-0.5 text-[9px] text-gray-700">
                <li>• Operations Strategy</li>
                <li>• Process Optimization</li>
                <li>• Multi-Site Governance</li>
                <li>• Warehouse Automation</li>
                <li>• Carrier &amp; 3PL Mgmt</li>
                <li>• Capex / Opex Planning</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1 uppercase">
                Languages
              </h2>
              <div className="space-y-1 text-[9px] text-gray-700">
                <div className="flex justify-between"><span>Italian</span><span className="font-bold">Native</span></div>
                <div className="flex justify-between"><span>English</span><span className="font-bold">Fluent</span></div>
                <div className="flex justify-between"><span>French</span><span className="font-bold">B2</span></div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1 uppercase">
                Certificates
              </h2>
              <p className="text-[8.5px] text-gray-600 leading-tight">
                Lean Six Sigma Black Belt<br />
                Certified Supply Chain Professional (CSCP)<br />
                APICS CPIM Certified
              </p>
            </div>
          </div>

          {/* Right Column (65%) */}
          <div className="col-span-8 space-y-2">
            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1.5 uppercase">
                Professional Experience
              </h2>
              <div className="mb-2 text-[9.5px]">
                <p className="font-bold text-[10.5px] text-gray-900">Head of Operations, LogiVera Solutions</p>
                <p className="text-gray-400 text-[9px] font-medium">2021 - Present | Milan, Italy</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                  <li>Direct operations strategy across 4 fulfillment hubs managing 180+ staff.</li>
                  <li>Spearheaded automated sorting initiative reducing packing errors by 41%.</li>
                  <li>Delivered €1.2M in annual logistics savings via consolidated carrier contracts.</li>
                </ul>
              </div>

              <div className="mb-2 text-[9.5px]">
                <p className="font-bold text-[10.5px] text-gray-900">Operations Manager, Spedita Italia</p>
                <p className="text-gray-400 text-[9px] font-medium">2017 - 2021 | Bologna, Italy</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                  <li>Oversaw last-mile fleet operations achieving 99.4% on-time delivery rate.</li>
                  <li>Deployed real-time telemetry dashboards increasing driver route efficiency.</li>
                </ul>
              </div>

              <div className="text-[9.5px]">
                <p className="font-bold text-[10.5px] text-gray-900">Senior Operations Lead, TransLine Services</p>
                <p className="text-gray-400 text-[9px] font-medium">2014 - 2017 | Turin, Italy</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                  <li>Managed cross-docking operations and inbound vendor receiving SLAs.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-amber-700 border-b border-amber-600 pb-0.5 mb-1 uppercase">
                Education
              </h2>
              <div className="text-[9.5px]">
                <p className="font-bold text-gray-900">SDA Bocconi School of Management, Milan</p>
                <p className="text-gray-500 text-[9px]">Executive Master in Supply Chain Strategy, 2016</p>
                <p className="font-bold text-gray-900 mt-1">Politecnico di Milano</p>
                <p className="text-gray-500 text-[9px]">Master of Science in Industrial Engineering, 2009 - 2012</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. STEADY FORM (Rohan K. Patel - Project Engineer)
// ─────────────────────────────────────────────────────────────
export function SteadyPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2 select-none text-[10px] leading-relaxed text-gray-800">
        {/* Header with Top-Right Avatar */}
        <div className="flex justify-between items-start pb-2 border-b border-gray-300">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-black text-gray-900">Rohan K. Patel</h1>
              <span className="text-xs text-gray-600 font-bold">Project Engineer</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] text-gray-500 mt-1">
              <span>✉ rohan.patel@email.com</span>
              <span>📞 +91 98765 43210</span>
              <span>🔗 linkedin.com/in/rohan-patel</span>
              <span>📍 Ahmedabad, India</span>
            </div>
          </div>
          <Avatar
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
            alt="Rohan K. Patel"
            initials="RP"
            className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
          />
        </div>

        {/* Summary */}
        <div>
          <div className="bg-slate-100 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1">
            Summary
          </div>
          <p className="text-[9.5px] text-gray-700 leading-normal px-2">
            Project Engineer with 6+ years of experience leading industrial and infrastructure construction packages. Expert in contractor coordination, MEP technical submittals, vendor management, and site execution with zero safety infractions.
          </p>
        </div>

        {/* Experience */}
        <div>
          <div className="bg-slate-100 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1.5">
            Professional Experience
          </div>
          <div className="grid grid-cols-12 gap-3 mb-2 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">01/2022 - Present</p>
              <p>Ahmedabad, India</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">Adani Infrastructure, Project Engineer</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Lead engineering coordination for $35M utility infrastructure modernization.</li>
                <li>Streamlined engineering drawing approvals, cutting design review delays by 3 weeks.</li>
                <li>Managed 8 sub-contractors ensuring strict adherence to IS/BIS building codes.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 mb-2 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">07/2019 - 12/2021</p>
              <p>Vadodara, India</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">Larsen &amp; Toubro, Mechanical Project Engineer</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Supervised heavy rotating equipment installation and cold commissioning.</li>
                <li>Monitored weekly contractor progress schedules on Primavera P6.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3 text-[9.5px]">
            <div className="col-span-4 text-gray-500 leading-tight">
              <p className="font-semibold text-gray-800">08/2017 - 06/2019</p>
              <p>Surat, India</p>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-[10.5px] text-gray-900">Torrent Power, Site Engineer Trainee</p>
              <p className="text-gray-700">• Performed quality inspections and site testing for electrical sub-station civil works.</p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="bg-slate-100 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1">
            Education
          </div>
          <div className="grid grid-cols-12 gap-3 text-[9.5px]">
            <div className="col-span-4 text-gray-500">2013 - 2017 | Ahmedabad</div>
            <div className="col-span-8">
              <p className="font-bold text-gray-900">Bachelor of Engineering in Mechanical Engineering</p>
              <p className="text-gray-600">Gujarat Technological University (GTU) • First Class with Distinction</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="bg-slate-100 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1">
            Technical Skills &amp; Software
          </div>
          <div className="grid grid-cols-3 gap-2 text-[9px] text-gray-700 px-2">
            <div>• Project Coordination<br />• Contractor Management</div>
            <div>• Primavera P6 &amp; MS Project<br />• AutoCAD &amp; SolidWorks</div>
            <div>• Technical Submittals<br />• OSHA Safety Standards</div>
          </div>
        </div>

        {/* Languages & Certificates */}
        <div>
          <div className="bg-slate-100 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1">
            Certifications &amp; Languages
          </div>
          <div className="flex justify-between items-center text-[9px] text-gray-700 px-2">
            <span>• English (Professional) &nbsp;&nbsp;• Hindi (Fluent) &nbsp;&nbsp;• Gujarati (Native)</span>
            <span>Project Management Professional (PMP) • Certified Lean Six Sigma</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. HUNTER GREEN (Yassine Ben Salem - Sales Manager)
// ─────────────────────────────────────────────────────────────
export function HunterPreview() {
  return (
    <A4Page>
      <div className="flex h-full select-none text-[10px] leading-relaxed">
        {/* Forest Green Sidebar */}
        <div className="w-[220px] bg-[#23372F] text-white p-6 flex flex-col space-y-3.5 shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-tight">Yassine Ben Salem</h1>
            <p className="text-xs text-emerald-200 mt-0.5">Sales Manager</p>

            <div className="space-y-1 text-[9px] text-emerald-100/80 mt-2.5">
              <p>🔗 linkedin.com/in/yassine-salem</p>
              <p>✉ yassine.bensalem@email.com</p>
              <p>📞 +216 55 482 731</p>
              <p>📍 Tunis, Tunisia</p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-700/60">
            <h2 className="text-xs font-bold uppercase text-emerald-200 mb-1">Summary</h2>
            <p className="text-[9px] text-emerald-100/90 leading-normal">
              Results-driven Sales Manager with 6+ years driving enterprise telecom and digital infrastructure contracts across North Africa. Proven ability to open new territories and build high-retention corporate accounts.
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-700/60">
            <h2 className="text-xs font-bold uppercase text-emerald-200 mb-1">Core Skills</h2>
            <ul className="space-y-0.5 text-[9px] text-emerald-100/80">
              <li>• Key Account Management</li>
              <li>• B2B Telecom Solutions</li>
              <li>• Executive Contract Closing</li>
              <li>• CRM &amp; Pipeline Hygiene</li>
              <li>• Strategic Channel Sales</li>
              <li>• Multi-Currency Pricing</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-emerald-700/60">
            <h2 className="text-xs font-bold uppercase text-emerald-200 mb-1">Languages</h2>
            <div className="space-y-1 text-[9px] text-emerald-100/90">
              <div className="flex justify-between"><span>Arabic</span><span className="font-bold">Native</span></div>
              <div className="flex justify-between"><span>French</span><span className="font-bold">Bilingual</span></div>
              <div className="flex justify-between"><span>English</span><span className="font-bold">Fluent</span></div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-700/60">
            <h2 className="text-xs font-bold uppercase text-emerald-200 mb-1">Certifications</h2>
            <p className="text-[8.5px] text-emerald-100/80">Certified Professional Sales Person (CPSP) • HubSpot Sales Hub</p>
          </div>
        </div>

        {/* Right White Canvas */}
        <div className="flex-1 p-6 flex flex-col space-y-3 text-gray-800">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#23372F] border-b-2 border-[#23372F] pb-1 mb-2">
              Professional Experience
            </h2>

            <div className="mb-2.5 text-[9.5px]">
              <div className="flex justify-between font-bold text-[11px] text-gray-900">
                <span>Sales Manager, Tunisie Connect</span>
                <span className="text-gray-400 font-normal">2021 - Present | Tunis, Tunisia</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Manage strategic business accounts with combined annualized revenue of €5.2M.</li>
                <li>Led quarterly sales planning and raised cross-sell conversion rates by 22%.</li>
                <li>Structured fiber-optic and cloud communications agreements for top banks.</li>
              </ul>
            </div>

            <div className="mb-2.5 text-[9.5px]">
              <div className="flex justify-between font-bold text-[11px] text-gray-900">
                <span>Senior Sales Executive, Maghreb Business Solutions</span>
                <span className="text-gray-400 font-normal">2019 - 2020 | Tunis</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Owned end-to-end sales cycle for B2B managed connectivity solutions.</li>
                <li>Increased monthly new enterprise logo acquisition by 35% through structured outbound.</li>
              </ul>
            </div>

            <div className="text-[9.5px]">
              <div className="flex justify-between font-bold text-[11px] text-gray-900">
                <span>Sales Account Specialist, MedCom Distribution</span>
                <span className="text-gray-400 font-normal">2017 - 2019 | Sousse</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Managed wholesale hardware distributors and resolved channel delivery conflicts.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#23372F] border-b-2 border-[#23372F] pb-1 mb-1.5">
              Education
            </h2>
            <div className="text-[9.5px]">
              <p className="font-bold text-gray-900">Master's Degree in International Commercial Management</p>
              <p className="text-gray-500">Tunis Business School (2015 - 2017) • Honours</p>
              <p className="font-bold text-gray-900 mt-1">Bachelor of Science in Business Administration</p>
              <p className="text-gray-500">Institut des Hautes Études Commerciales (IHEC) Carthage (2012 - 2015)</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#23372F] border-b-2 border-[#23372F] pb-1 mb-1">
              Key Commercial Milestone
            </h2>
            <p className="text-[9px] text-gray-700 leading-normal">
              Awarded <strong>Sales Executive of the Year (2023)</strong> for signing the largest multi-year corporate connectivity framework in company history (€1.4M ARR).
            </p>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. QUICKSILVER (Michael Nwosu - Sales Manager, UK)
// ─────────────────────────────────────────────────────────────
export function QuicksilverPreview() {
  return (
    <A4Page>
      <div className="flex h-full select-none text-[10px] leading-relaxed">
        <div className="w-[210px] bg-slate-100 p-6 border-r border-slate-200 flex flex-col space-y-3 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Michael Nwosu</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Sales Manager</p>

            <div className="my-2.5 flex justify-center">
              <Avatar
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80"
                alt="Michael Nwosu"
                initials="MN"
                className="w-18 h-18 rounded-full border border-slate-300 shadow-xs"
              />
            </div>

            <div className="space-y-1 text-[9px] text-slate-600">
              <p>✉ michael.nwosu@email.com</p>
              <p>📞 +44 7700 516 284</p>
              <p>🔗 linkedin.com/in/michael-nwosu</p>
              <p>📍 Birmingham, UK</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold uppercase text-slate-700 mb-1">Summary</h2>
            <p className="text-[9px] text-slate-600 leading-normal">
              B2B Sales Leader with 6+ years driving consultative SaaS solutions, strategic partnership growth, and territorial expansion across the UK Midlands.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold uppercase text-slate-700 mb-1">Skills</h2>
            <p className="text-[9px] text-slate-600 leading-relaxed">
              • Enterprise Sales Strategy<br />
              • Pipeline Forecasting<br />
              • Account-Based Selling<br />
              • Contract Negotiation<br />
              • Salesforce &amp; Outreach
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold uppercase text-slate-700 mb-1">Languages</h2>
            <div className="text-[9px] text-slate-600 space-y-0.5">
              <div className="flex justify-between"><span>English</span><span>•••••</span></div>
              <div className="flex justify-between"><span>Igbo</span><span>•••••</span></div>
              <div className="flex justify-between"><span>French</span><span>••••◦</span></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col space-y-3">
          <div>
            <div className="bg-slate-200 text-slate-800 px-3 py-1 rounded font-bold text-xs uppercase mb-2 text-center">
              Professional Experience
            </div>
            <div className="mb-2.5 text-[9.5px]">
              <p className="font-bold text-[10.5px] text-gray-900">Westford Commercial Services, Sales Manager</p>
              <p className="text-gray-400 text-[9px]">01/2022 - Present | Birmingham, United Kingdom</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Lead regional sales operations and exceeded annual revenue targets by 14% (£3.1M).</li>
                <li>Closed 22 strategic supply contracts in logistics and manufacturing sectors.</li>
                <li>Mentored team of 5 Business Development Reps, raising team quota attainment to 108%.</li>
              </ul>
            </div>

            <div className="mb-2 text-[9.5px]">
              <p className="font-bold text-[10.5px] text-gray-900">Brightline Solutions, Senior Sales Executive</p>
              <p className="text-gray-400 text-[9px]">05/2019 - 12/2021 | Nottingham, UK</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Owned full sales-cycle from prospecting to negotiation and contract closure.</li>
                <li>Recognized as Top Outbound Performer for Q3 and Q4 2020.</li>
              </ul>
            </div>

            <div className="text-[9.5px]">
              <p className="font-bold text-[10.5px] text-gray-900">Midland Direct, B2B Sales Associate</p>
              <p className="text-gray-400 text-[9px]">08/2017 - 04/2019 | Coventry, UK</p>
              <p className="text-gray-700 mt-0.5">• Managed outbound prospect campaigns generating 35 qualified discovery meetings per month.</p>
            </div>
          </div>

          <div>
            <div className="bg-slate-200 text-slate-800 px-3 py-1 rounded font-bold text-xs uppercase mb-1.5 text-center">
              Education
            </div>
            <p className="text-[10px] font-bold text-gray-900">Diploma in Professional Selling, Birmingham Metropolitan</p>
            <p className="text-[9px] text-gray-500">BA (Hons) Business Management, Aston University (2014 - 2017)</p>
          </div>

          <div>
            <div className="bg-slate-200 text-slate-800 px-3 py-1 rounded font-bold text-xs uppercase mb-1.5 text-center">
              Certificates &amp; Credentials
            </div>
            <p className="text-[9px] text-gray-700">
              HubSpot Sales Software Certified • Salesforce Certified Associate • LinkedIn Negotiation Masterclass
            </p>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. PRECISION LINE (Olivia Bennett - Head of Customer Service)
// ─────────────────────────────────────────────────────────────
export function PrecisionPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2.5 select-none text-[9.5px] leading-tight text-gray-800 font-sans">
        {/* Header */}
        <div className="text-center pb-1.5 border-b-2 border-gray-900">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Olivia Bennett</h1>
          <p className="text-xs text-gray-600 font-bold mt-0.5">Head of Customer Service</p>
          <p className="text-[9px] text-gray-500 mt-1">
            olivia.bennett@email.com &nbsp;•&nbsp; +61 412 683 947 &nbsp;•&nbsp; Sydney, Australia &nbsp;•&nbsp; linkedin.com/in/olivia-bennett
          </p>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-gray-900 mb-0.5">Summary</h2>
          <p className="text-[9px] text-gray-700 leading-normal">
            Customer service leader with over 16 years of experience building high-performing support functions across retail, telecom, financial services, and digital environments. Recognized for driving measurable gains in CSAT, reducing operational cost-per-contact, and embedding a culture of customer-centric excellence across omni-channel contact centers.
          </p>
        </div>

        {/* Professional Experience */}
        <div>
          <div className="border-b-2 border-double border-gray-900 pb-0.5 mb-1 text-[10.5px] font-bold uppercase tracking-wider">
            Professional Experience
          </div>

          <div className="text-[9px] mb-2">
            <div className="flex justify-between font-bold text-[10px]">
              <span>BrightWave Mobile, Head of Customer Service</span>
              <span className="text-gray-500 font-normal">2020 - Present | Sydney</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Led team of 6 department managers and 145 service professionals, raising CSAT from 84% to 93%.</p>
            <p className="text-gray-700">• Implemented AI-assisted ticketing and self-service portal that deflected 28% of tier-1 support volume.</p>
            <p className="text-gray-700">• Reduced frontline turnover by 19% through structured onboarding and skill-tier progression pathways.</p>
          </div>

          <div className="text-[9px] mb-2">
            <div className="flex justify-between font-bold text-[10px]">
              <span>Southern Lane Retail Group, Customer Service Director</span>
              <span className="text-gray-500 font-normal">2016 - 2020 | Melbourne</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Directed contact centers and in-store customer escalations across 82 retail storefronts nationwide.</p>
            <p className="text-gray-700">• Re-negotiated outsourced BPO vendor contracts, generating $620K in annualized operating savings.</p>
          </div>

          <div className="text-[9px] mb-1.5">
            <div className="flex justify-between font-bold text-[10px]">
              <span>Pacific Utility Services, Senior Customer Experience Manager</span>
              <span className="text-gray-500 font-normal">2012 - 2016 | Brisbane</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Managed omnichannel communications (phone, chat, email) achieving 94% First Contact Resolution (FCR).</p>
          </div>

          <div className="text-[9px]">
            <div className="flex justify-between font-bold text-[10px]">
              <span>Metro Connect Telecom, Service Delivery Team Lead</span>
              <span className="text-gray-500 font-normal">2008 - 2012 | Sydney</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Supervised 24 technical support specialists; earned National Customer Service Team of the Year (2011).</p>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="border-b-2 border-double border-gray-900 pb-0.5 mb-1 text-[10.5px] font-bold uppercase tracking-wider">
            Education
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="font-bold text-gray-900">Master of Business Administration (MBA), Macquarie University</span>
            <span className="text-gray-500">2014 - 2016</span>
          </div>
          <div className="flex justify-between text-[9px] mt-0.5">
            <span className="font-bold text-gray-900">Bachelor of Business, University of Technology Sydney</span>
            <span className="text-gray-500">2004 - 2007</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="border-b-2 border-double border-gray-900 pb-0.5 mb-1 text-[10.5px] font-bold uppercase tracking-wider">
            Core Competencies &amp; Expertise
          </div>
          <div className="grid grid-cols-4 gap-1 text-[8.5px] text-gray-700">
            <div>• Customer Operations<br />• Quality Assurance</div>
            <div>• Contact Centre Leadership<br />• Escalation Resolution</div>
            <div>• Workforce Planning &amp; WFM<br />• Performance Coaching</div>
            <div>• Omnichannel Journeys<br />• Voice-of-Customer Analytics</div>
          </div>
        </div>

        {/* Credentials */}
        <div className="pt-1 border-t border-gray-300 flex justify-between text-[8.5px] text-gray-600">
          <span>Certified Customer Experience Professional (CCXP) • Lean Six Sigma Black Belt</span>
          <span>English (Native) • French • Spanish</span>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. COBALT EDGE (Alejandro Herrera - Sales Manager, Mexico)
// ─────────────────────────────────────────────────────────────
export function CobaltPreview() {
  return (
    <A4Page>
      <div className="flex flex-col h-full select-none text-[10px] leading-relaxed">
        {/* Cobalt Top Hero Banner */}
        <div className="bg-[#0B3B60] text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Alejandro Herrera</h1>
            <p className="text-xs text-sky-200 font-medium italic mt-0.5">Sales Manager</p>
            <div className="space-y-0.5 text-[9px] text-white/80 mt-1.5">
              <p>✉ alejandro.herrera@email.com &nbsp;|&nbsp; 📞 +52 81 2345 6789</p>
              <p>📍 Monterrey, Mexico &nbsp;|&nbsp; 🔗 linkedin.com/in/alejandro-herrera</p>
            </div>
          </div>
          <Avatar
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            alt="Alejandro Herrera"
            initials="AH"
            className="w-18 h-18 rounded-full border-2 border-sky-400/50 shadow-md"
          />
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col space-y-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-gray-200 pb-0.5 mb-1">
              Summary
            </h2>
            <p className="text-[9.5px] text-gray-700 leading-normal">
              Results-driven sales professional with 7+ years of experience in B2B account growth, client relationship management, and commercial team leadership across northern Mexico. Strong track record of improving pipeline quality and consistently beating revenue targets.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-gray-200 pb-0.5 mb-1.5">
              Professional Experience
            </h2>

            <div className="mb-2 text-[9.5px]">
              <div className="flex justify-between font-bold text-[10.5px]">
                <span className="text-[#0B3B60]">Sales Manager, Grupo Delta Comercial</span>
                <span className="text-gray-400 font-normal">01/2022 - Present | Monterrey</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Manage 14 regional commercial accounts and consistently exceed quarterly quotas by 24%.</li>
                <li>Lead pipeline reviews, pricing negotiations, and strategic forecasting across 4 branches.</li>
                <li>Negotiated high-value supply agreements generating $4.8M MXN in incremental revenue.</li>
              </ul>
            </div>

            <div className="mb-2 text-[9.5px]">
              <div className="flex justify-between font-bold text-[10.5px]">
                <span className="text-[#0B3B60]">Senior Sales Executive, Nova Industrial Solutions</span>
                <span className="text-gray-400 font-normal">03/2019 - 12/2021 | Guadalajara</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                <li>Owned key enterprise accounts and delivered 30% YoY account expansion.</li>
                <li>Conducted technical product demonstrations for industrial manufacturing clients.</li>
              </ul>
            </div>

            <div className="text-[9.5px]">
              <div className="flex justify-between font-bold text-[10.5px]">
                <span className="text-[#0B3B60]">B2B Account Specialist, Prosumex International</span>
                <span className="text-gray-400 font-normal">06/2016 - 02/2019 | Monterrey</span>
              </div>
              <p className="text-gray-700 mt-0.5">• Managed commercial distribution network and expanded partner roster from 28 to 65 accounts.</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-gray-200 pb-0.5 mb-1">
              Education
            </h2>
            <div className="flex justify-between text-[9.5px]">
              <span className="font-bold text-gray-900">Bachelor of Business Administration (BBA)</span>
              <span className="text-gray-500">2012 - 2016</span>
            </div>
            <p className="text-[9px] text-gray-600">Tecnológico de Monterrey (ITESM) • Graduated with Academic Excellence</p>
            <p className="text-[9px] text-gray-600 mt-0.5">Diploma in Strategic Sales Management, IPADE Business School (2018)</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-gray-200 pb-0.5 mb-1">
              Key Commercial Achievements
            </h2>
            <p className="text-[9px] text-gray-700 leading-normal">
              Awarded <strong>Sales Champion of the Year (2023)</strong> for signing a $2.5M USD multi-year logistics distribution agreement with Mexico's leading beverage conglomerate.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-gray-200 pb-0.5 mb-1">
              Skills &amp; Languages
            </h2>
            <div className="flex justify-between text-[9px] text-gray-700">
              <span>• Key Account Management &nbsp;• Pipeline Forecasting &nbsp;• CRM (Salesforce) &nbsp;• Contract Pricing</span>
              <span className="font-bold text-gray-900">Spanish (Native) • English (Fluent) • Portuguese</span>
            </div>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 12. SILVER BANNER (Anna Field - Junior Project Manager, UK)
// ─────────────────────────────────────────────────────────────
export function SilverBannerPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2.5 select-none text-[10px] leading-relaxed text-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anna Field</h1>
          <p className="text-xs text-gray-600 font-semibold mt-0.5">Junior Project Manager</p>
          <div className="flex justify-between text-[9px] text-gray-500 mt-1 pb-2 border-b border-gray-300">
            <span>📍 Manchester, United Kingdom &nbsp;|&nbsp; 📞 +44 7700 483 216</span>
            <span>✉ anna.field@email.com &nbsp;|&nbsp; 🔗 linkedin.com/in/anna-field</span>
          </div>
        </div>

        <div>
          <div className="bg-slate-200 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1 text-center">
            Summary
          </div>
          <p className="text-[9.5px] text-gray-700 leading-normal text-center px-4">
            Detail-oriented Project Manager with experience supporting digital and operational projects in fast-paced corporate environments. Strong background in sprint coordination, risk log maintenance, stakeholder communications, and schedule governance.
          </p>
        </div>

        <div>
          <div className="bg-slate-200 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1.5 text-center">
            Professional Experience
          </div>

          <div className="text-[9.5px] mb-2">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Project Coordinator, Northbridge Solutions</span>
              <span className="text-gray-400 font-normal">2021/07 - Present | Manchester</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
              <li>Coordinate cross-functional sprint deliverables between design, engineering, and QA.</li>
              <li>Maintain RAID logs, risk registers, and weekly executive milestone reports.</li>
              <li>Organized roll-out of cloud collaboration tools across 650 remote employees.</li>
            </ul>
          </div>

          <div className="text-[9.5px] mb-2">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Associate Project Assistant, Vanguard Consulting</span>
              <span className="text-gray-400 font-normal">2019/08 - 2021/06 | Leeds</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
              <li>Supported project managers with work-breakdown structures (WBS) and sprint retrospectives.</li>
              <li>Managed contractor onboarding documentation and project resource bookings.</li>
            </ul>
          </div>

          <div className="text-[9.5px]">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Project Intern, Alder &amp; Co. Services</span>
              <span className="text-gray-400 font-normal">2018/06 - 2019/07 | Manchester</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Assisted with project meeting minutes, action items, and procurement invoice reconciliation.</p>
          </div>
        </div>

        <div>
          <div className="bg-slate-200 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1 text-center">
            Education
          </div>
          <div className="flex justify-between text-[9.5px]">
            <span className="font-bold text-gray-900">BA (Hons) Business Management, Manchester Metropolitan University</span>
            <span className="text-gray-500">2015 - 2018</span>
          </div>
          <p className="text-[9px] text-gray-500">First Class Honours • Dissertation on Agile Project Governance</p>
        </div>

        <div>
          <div className="bg-slate-200 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1 text-center">
            Key Project Deliverables
          </div>
          <p className="text-[9px] text-gray-700 leading-normal">
            <strong>Enterprise ERP Migration:</strong> Coordinated user acceptance testing (UAT) with 45 business unit stakeholders, achieving sign-off 2 weeks ahead of target deadline.
          </p>
        </div>

        <div>
          <div className="bg-slate-200 text-slate-800 px-3 py-0.5 rounded font-bold text-xs uppercase mb-1 text-center">
            Skills &amp; Certificates
          </div>
          <div className="flex justify-between text-[9px] text-gray-700 px-2">
            <span>• Agile Scrum &nbsp;• Jira &amp; Confluence &nbsp;• Risk Tracking &nbsp;• Asana &nbsp;• MS Project</span>
            <span className="font-bold text-gray-900">PRINCE2® Foundation • Google PM Certified</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 13. CLASSIC SERIF (Andrew O'Sullivan - Product Manager, Ireland)
// ─────────────────────────────────────────────────────────────
export function ClassicSerifPreview() {
  return (
    <A4Page>
      <div className="p-7 font-serif flex flex-col space-y-2.5 select-none text-[10px] leading-relaxed text-gray-900">
        <div className="text-center pb-2 border-b border-gray-400">
          <h1 className="text-2xl font-bold">Andrew O'Sullivan</h1>
          <p className="text-xs text-gray-600 italic mt-0.5 font-sans">Product Manager</p>
          <p className="text-[9.5px] text-gray-500 mt-1 font-sans">
            Dublin, Ireland &nbsp;•&nbsp; andrew.osullivan@email.com &nbsp;•&nbsp; +353 87 411 6849 &nbsp;•&nbsp; linkedin.com/in/andrew-osullivan
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1">Summary</h2>
          <p className="text-[9.5px] text-gray-700 leading-normal">
            Product Manager with experience driving customer-facing fintech platforms and internal workflow automation. Proven expertise in data-driven discovery, backlog prioritization, product roadmap execution, and aligning cross-functional engineering squads with strategic commercial OKRs.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">
            Professional Experience
          </h2>

          <div className="text-[9.5px] mb-2">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Lead Product Manager, BrightLane Technologies</span>
              <span className="text-gray-500 font-normal">2021/01 - Present | Dublin</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5 font-sans">
              <li>Own the core checkout and payments roadmap used by 650,000 monthly active users.</li>
              <li>Reduced onboarding friction by 23% through streamlined digital identity verification.</li>
              <li>Lead bi-weekly sprint planning, backlog grooming, and OKR quarterly reviews.</li>
            </ul>
          </div>

          <div className="text-[9.5px] mb-2">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Product Manager, Northbridge Digital</span>
              <span className="text-gray-500 font-normal">2018/06 - 2020/12 | Cork</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5 font-sans">
              <li>Delivered self-serve analytics portal for enterprise B2B customers, boosting retention by 14%.</li>
              <li>Conducted over 60 qualitative user interviews to validate feature hypotheses.</li>
            </ul>
          </div>

          <div className="text-[9.5px]">
            <div className="flex justify-between font-bold text-[10.5px]">
              <span>Associate Product Manager, Beacon Fintech Labs</span>
              <span className="text-gray-500 font-normal">2016/09 - 2018/05 | Dublin</span>
            </div>
            <p className="text-gray-700 font-sans mt-0.5">• Authored detailed user stories, PRDs, and acceptance criteria for mobile banking features.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">
            Education
          </h2>
          <div className="flex justify-between text-[9.5px] font-sans">
            <span className="font-bold">MSc in Digital Innovation, University College Dublin</span>
            <span className="text-gray-500">2015 - 2016</span>
          </div>
          <div className="flex justify-between text-[9.5px] mt-0.5 font-sans">
            <span className="font-bold">BA in Business &amp; Management, University of Galway</span>
            <span className="text-gray-500">2011 - 2015</span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">
            Key Product Impact
          </h2>
          <p className="text-[9px] text-gray-700 font-sans leading-normal">
            Spearheaded company's PSD2 Open Banking integration, expanding deposit rails across 8 European countries and growing transaction volume by €45M within the first 6 months.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1">
            Skills &amp; Languages
          </h2>
          <div className="flex justify-between text-[9px] text-gray-700 font-sans">
            <span>• Product Roadmaps &nbsp;• User Research &nbsp;• SQL &amp; Amplitude &nbsp;• Agile &amp; Scrum &nbsp;• Figma</span>
            <span>English (Native) &nbsp;|&nbsp; Irish (Fluent) &nbsp;|&nbsp; Spanish (Working)</span>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 14. REFINED (Mariana Costa Ribeiro - Finance Manager, Brazil)
// ─────────────────────────────────────────────────────────────
export function RefinedPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2 select-none text-[10px] leading-relaxed text-gray-800">
        {/* Header */}
        <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
          <Avatar
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
            alt="Mariana Costa Ribeiro"
            initials="MR"
            className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Mariana Costa Ribeiro</h1>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">Finance Manager</p>
            <p className="text-[9px] text-gray-400 mt-1">mariana.ribeiro@email.com &nbsp;•&nbsp; +55 11 98765-4321 &nbsp;•&nbsp; São Paulo, Brazil</p>
          </div>
        </div>

        {/* Dual Column */}
        <div className="grid grid-cols-12 gap-5 pt-1">
          {/* Left Column (35%) */}
          <div className="col-span-4 border-r border-gray-200 pr-3 space-y-2">
            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1">
                SUMMARY
              </div>
              <p className="text-[8.5px] text-gray-700 leading-normal">
                Finance leader with 8+ years overseeing budgeting, statutory reporting, cash forecasting, and cost optimization for multinational consumer goods enterprises.
              </p>
            </div>

            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1">
                CORE SKILLS
              </div>
              <ul className="text-[8.5px] text-gray-700 space-y-0.5">
                <li>• Strategic Financial Planning</li>
                <li>• Budget &amp; Variance Analysis</li>
                <li>• Cash Flow &amp; Working Capital</li>
                <li>• IFRS Statutory Compliance</li>
                <li>• SAP S/4HANA &amp; Hyperion</li>
                <li>• Power BI &amp; Advanced Excel</li>
              </ul>
            </div>

            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1">
                LANGUAGES
              </div>
              <div className="text-[8.5px] text-gray-700 space-y-1 mt-0.5">
                <div><span>Portuguese</span><div className="h-1 bg-black rounded w-full mt-0.5" /></div>
                <div><span>English</span><div className="h-1 bg-black rounded w-4/5 mt-0.5" /></div>
                <div><span>Spanish</span><div className="h-1 bg-black rounded w-3/5 mt-0.5" /></div>
              </div>
            </div>

            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1">
                CERTIFICATIONS
              </div>
              <p className="text-[8px] text-gray-700 leading-tight">
                CFA Charterholder (CFA Institute)<br />
                Corporate Finance Analyst (CFI)
              </p>
            </div>
          </div>

          {/* Right Column (65%) */}
          <div className="col-span-8 space-y-2">
            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1.5">
                PROFESSIONAL EXPERIENCE
              </div>
              <div className="text-[9px] mb-2">
                <p className="font-bold text-[10px] text-gray-900">Natura &amp;Co, Finance Manager</p>
                <p className="text-gray-400">2022 - Present | São Paulo, Brazil</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                  <li>Manage monthly financial close and variance analysis for 2 commercial business units.</li>
                  <li>Automated FP&amp;A models in SAP, shortening quarterly closing cycle by 3 business days.</li>
                  <li>Identified supply chain cost variances resulting in R$8.5M in annual operational savings.</li>
                </ul>
              </div>

              <div className="text-[9px] mb-1.5">
                <p className="font-bold text-[10px] text-gray-900">Raízen, Senior Financial Analyst</p>
                <p className="text-gray-400">2019 - 2022 | São Paulo, Brazil</p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
                  <li>Built 5-year rolling financial models for capital investments in renewable energy assets.</li>
                  <li>Prepared executive presentations for audit committees and bank syndicates.</li>
                </ul>
              </div>

              <div className="text-[9px]">
                <p className="font-bold text-[10px] text-gray-900">Ambev, Financial Analyst</p>
                <p className="text-gray-400">2016 - 2019 | Campinas, Brazil</p>
                <p className="text-gray-700 mt-0.5">• Managed distributor credit risk and reconciled commercial trade promotion expenditure.</p>
              </div>
            </div>

            <div>
              <div className="inline-block bg-black text-white text-[9.5px] font-bold px-2 py-0.5 rounded-xs mb-1.5">
                EDUCATION
              </div>
              <p className="text-[9.5px] font-bold text-gray-900">MBA in Corporate Finance, Fundação Getulio Vargas (FGV)</p>
              <p className="text-[9px] text-gray-500">2017 - 2019 | São Paulo</p>
              <p className="text-[9.5px] font-bold text-gray-900 mt-1">Bachelor of Business Administration, Mackenzie</p>
              <p className="text-[9px] text-gray-500">2012 - 2016 | Graduated with Distinction</p>
            </div>
          </div>
        </div>
      </div>
    </A4Page>
  );
}

// ─────────────────────────────────────────────────────────────
// 15. CONDENSED RULE (Ahmed Hassan - Head of Engineering, Cairo)
// ─────────────────────────────────────────────────────────────
export function CondensedPreview() {
  return (
    <A4Page>
      <div className="p-7 flex flex-col space-y-2 select-none text-[9.5px] leading-tight text-gray-800">
        <div className="pb-1 border-b-2 border-gray-900">
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ahmed Hassan</h1>
            <span className="text-xs text-gray-600 font-bold">Head of Engineering</span>
          </div>
          <p className="text-[9px] text-gray-500 mt-0.5">
            ahmed.hassan@email.com &nbsp;|&nbsp; +20 100 482 7391 &nbsp;|&nbsp; Cairo, Egypt &nbsp;|&nbsp; linkedin.com/in/ahmed-hassan
          </p>
        </div>

        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Summary</h2>
          <p className="text-[9px] text-gray-700 leading-normal">
            Engineering executive with 17+ years directing large-scale infrastructure, power plant, and industrial manufacturing facilities across the Middle East &amp; North Africa. Strong leader in engineering governance, capital project delivery, and operational asset reliability.
          </p>
        </div>

        <div>
          <h2 className="text-[10.5px] font-bold uppercase border-b border-gray-900 pb-0.5 mb-1">
            Professional Experience
          </h2>

          <div className="mb-1.5 text-[9px]">
            <div className="flex justify-between font-bold text-[10px]">
              <span>RidaWorks Infrastructure, Head of Engineering</span>
              <span className="text-gray-500 font-normal">2020 - Present | Cairo</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
              <li>Direct multi-disciplinary engineering organization of 120+ engineers and project managers.</li>
              <li>Delivered $85M industrial wastewater treatment facility 3 months ahead of contract schedule.</li>
              <li>Standardized technical specifications cutting plant downtime by 34% across 6 sites.</li>
            </ul>
          </div>

          <div className="mb-1.5 text-[9px]">
            <div className="flex justify-between font-bold text-[10px]">
              <span>Delta Industrial Solutions, Engineering Director</span>
              <span className="text-gray-500 font-normal">2016 - 2020 | Alexandria</span>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-0.5 mt-0.5">
              <li>Directed brownfield expansion of steel fabrication lines maintaining zero OSHA lost-time incidents.</li>
              <li>Managed contractor procurement and equipment fabrication audits across European suppliers.</li>
            </ul>
          </div>

          <div className="text-[9px]">
            <div className="flex justify-between font-bold text-[10px]">
              <span>Cairo Energy Services, Senior Engineering Manager</span>
              <span className="text-gray-500 font-normal">2010 - 2016 | Cairo</span>
            </div>
            <p className="text-gray-700 mt-0.5">• Managed combined-cycle turbine overhauls and commissioned automated SCADA monitoring networks.</p>
          </div>
        </div>

        <div>
          <h2 className="text-[10.5px] font-bold uppercase border-b border-gray-900 pb-0.5 mb-1">
            Education
          </h2>
          <div className="flex justify-between text-[9px]">
            <span className="font-bold">Executive Program in Operations Leadership, German University in Cairo</span>
            <span className="text-gray-500">2018</span>
          </div>
          <div className="flex justify-between text-[9px] mt-0.5">
            <span className="font-bold">Bachelor of Science in Mechanical Engineering, Ain Shams University</span>
            <span className="text-gray-500">1998 - 2003</span>
          </div>
        </div>

        <div>
          <h2 className="text-[10.5px] font-bold uppercase border-b border-gray-900 pb-0.5 mb-0.5">
            Key Capital Project
          </h2>
          <p className="text-[8.5px] text-gray-700">
            <strong>Suez Canal Corridor Expansion ($140M):</strong> Served as Lead Technical Advisor for mechanical and pumping infrastructure, ensuring 100% adherence to international EPC safety standards.
          </p>
        </div>

        <div>
          <h2 className="text-[10.5px] font-bold uppercase border-b border-gray-900 pb-0.5 mb-0.5">
            Core Competencies &amp; Certifications
          </h2>
          <p className="text-[8.5px] text-gray-700">
            Engineering Leadership • Capital Project Delivery • Technical Governance • Asset Reliability • OSHA / HSE Standards • Six Sigma Black Belt
          </p>
        </div>

        <div className="pt-1 border-t border-gray-300 flex justify-between text-[8.5px] text-gray-600">
          <span>Certified Maintenance &amp; Reliability Professional (CMRP) • PMP® Certified</span>
          <span>Arabic (Native) • English (Fluent) • French (Working)</span>
        </div>
      </div>
    </A4Page>
  );
}
