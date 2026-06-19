#!/usr/bin/env python3
"""DEPRECATED — Do not run on production NEOXWEB pages (outdated Nexura template).
Use hand-edited HTML + scripts/fix-seo-bulk.py for SEO maintenance."""

import os

BASE = os.path.dirname(os.path.abspath(__file__))

HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <meta name="theme-color" content="#0a0a0a">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/dark-mode.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="css/service-page.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">
    <script defer src="js/utils.js"></script>
    <script defer src="js/main.js"></script>
    <script defer src="js/animations.js"></script>
    <script defer src="js/navbar.js"></script>
</head>
<body class="service-page">
    <div id="navbar-container"></div>
    <main>
'''

FOOT = '''
    </main>
    <footer class="site-footer compact">
        <div class="container footer-grid">
            <a href="index.html" class="footer-logo">Nexura</a>
            <div class="footer-links">
                <a href="services.html">Services</a>
                <a href="portfolio.html">Portfolio</a>
                <a href="contact.html">Contact</a>
            </div>
        </div>
        <div class="footer-bottom container"><p>&copy; 2026 Nexura. All rights reserved.</p></div>
    </footer>
    <div class="custom-cursor" id="customCursor"></div>
</body>
</html>
'''

def hero(s):
    floats = ""
    if s.get("float_top"):
        floats += f'<div class="web-hero-float-card web-hero-float-card--top"><i class="fas {s["float_top_icon"]}" aria-hidden="true"></i> {s["float_top"]}</div>'
    if s.get("float_bottom"):
        floats += f'<div class="web-hero-float-card web-hero-float-card--bottom"><i class="fas {s["float_bottom_icon"]}" aria-hidden="true"></i> {s["float_bottom"]}</div>'
    metrics = "".join(f'<div class="web-metric"><i class="fas fa-check-circle" aria-hidden="true"></i> {m}</div>' for m in s.get("metrics", []))
    return f'''
        <section class="web-hero">
            <div class="container web-hero-grid">
                <div class="web-hero-copy fade-up">
                    <span class="section-tag">{s["tag"]}</span>
                    <h1>{s["h1"]}</h1>
                    <p class="web-hero-lead">{s["lead"]}</p>
                    <div class="web-hero-actions">
                        <a href="contact.html" class="btn btn-primary btn-large">Start a Project</a>
                        <a href="services.html" class="btn btn-outline btn-large">All Services</a>
                    </div>
                    <div class="web-hero-metrics">{metrics}</div>
                </div>
                <div class="web-hero-visual fade-up delay-1">
                    <img src="assets/services/{s["svg"]}" alt="" width="440" height="440">
                    {floats}
                </div>
            </div>
        </section>'''

def tech_strip(pills):
    items = "".join(f'<span class="web-tech-pill"><i class="{p[0]}" aria-hidden="true"></i> {p[1]}</span>' for p in pills)
    return f'''
        <section class="web-tech-strip" aria-label="Technologies">
            <div class="container"><span class="label">Built with</span>{items}</div>
        </section>'''

def deliver(s):
    cards = ""
    for i, c in enumerate(s["cards"], 1):
        green = " service-panel-icon--green" if i % 2 == 0 else ""
        delay = f" delay-{i-1}" if i > 1 else ""
        bullets = "".join(f'<div class="list-bullet"><span></span>{b}</div>' for b in c["bullets"])
        cards += f'''
                <article class="service-panel tilt-card fade-up{delay}">
                    <span class="service-panel-num">0{i}</span>
                    <div class="service-panel-icon{green}"><img src="assets/icons/{c["icon"]}" alt="" width="30" height="30"></div>
                    <h3>{c["title"]}</h3>
                    <p>{c["desc"]}</p>
                    {bullets}
                </article>'''
    return f'''
        <section class="section-padding">
            <div class="container section-header text-center">
                <span class="section-tag">What we deliver</span>
                <h2>{s["deliver_h2"]}</h2>
                <p class="section-desc">{s["deliver_desc"]}</p>
            </div>
            <div class="service-grid">{cards}
            </div>
        </section>'''

def why(s):
    cards = ""
    for i, w in enumerate(s["why"]):
        delay = " delay-1" if i else ""
        items = "".join(f"<li>{x}</li>" for x in w["items"])
        cards += f'''
                <article class="web-why-card fade-up{delay}">
                    <div class="web-why-icon"><i class="fas {w["icon"]}" aria-hidden="true"></i></div>
                    <h2>{w["title"]}</h2>
                    <p>{w["desc"]}</p>
                    <ul class="checklist">{items}</ul>
                </article>'''
    return f'''
        <section class="section-padding gray-bg">
            <div class="container section-header text-center">
                <span class="section-tag">{s["why_tag"]}</span>
                <h2>{s["why_h2"]}</h2>
                <p class="section-desc">{s["why_desc"]}</p>
            </div>
            <div class="web-why-grid">{cards}
            </div>
        </section>'''

def process(steps):
    items = ""
    for i, st in enumerate(steps):
        delay = f" delay-{i}" if i else ""
        items += f'''
                <article class="web-process-step fade-up{delay}">
                    <div class="web-process-dot">0{i+1}</div>
                    <h3>{st["title"]}</h3>
                    <p>{st["desc"]}</p>
                </article>'''
    return f'''
        <section class="section-padding">
            <div class="container section-header text-center">
                <span class="section-tag">Our process</span>
                <h2>Structured delivery from discovery through launch.</h2>
            </div>
            <div class="web-process">{items}
            </div>
        </section>'''

def capabilities(caps):
    cards = ""
    for i, c in enumerate(caps):
        delay = " delay-1" if i else ""
        cards += f'''
                <article class="web-cap-card fade-up{delay}">
                    <img src="assets/icons/{c["icon"]}" alt="" width="44" height="44">
                    <div><h3>{c["title"]}</h3><p>{c["desc"]}</p></div>
                </article>'''
    return f'''
        <section class="section-padding gray-bg">
            <div class="container section-header text-center">
                <span class="section-tag">Capabilities</span>
                <h2>Core engineering and product services.</h2>
            </div>
            <div class="web-cap-grid">{cards}
            </div>
        </section>'''

def cases(case_list):
    cards = ""
    for i, c in enumerate(case_list):
        delay = f" delay-{i}" if i else ""
        cards += f'''
                <article class="web-case-card fade-up{delay}">
                    <span class="web-case-badge">{c["badge"]}</span>
                    <h3>{c["title"]}</h3>
                    <p>{c["desc"]}</p>
                    <span class="web-case-tag">{c["tag"]}</span>
                </article>'''
    return f'''
        <section class="section-padding">
            <div class="container section-header text-center">
                <span class="section-tag">Case studies</span>
                <h2>Projects that delivered measurable business impact.</h2>
            </div>
            <div class="web-cases">{cards}
            </div>
        </section>'''

def stats(stat_list):
    items = ""
    for i, st in enumerate(stat_list):
        delay = f" delay-{i}" if i else ""
        items += f'<div class="web-stat-item fade-up{delay}"><strong>{st[0]}</strong><span>{st[1]}</span></div>'
    return f'''
        <section class="web-stats-band"><div class="container web-stats-grid">{items}</div></section>'''

def cta(s):
    return f'''
        <section class="web-cta">
            <div class="container">
                <div class="web-cta-card fade-up">
                    <h2>{s["cta_h2"]}</h2>
                    <p>{s["cta_p"]}</p>
                    <a href="contact.html" class="btn btn-white btn-large">Get Started &rarr;</a>
                </div>
            </div>
        </section>'''

DEFAULT_PROCESS = [
    {"title": "Discovery & Strategy", "desc": "We align product goals, user needs, and business metrics before development begins."},
    {"title": "Design & Prototype", "desc": "High-fidelity workflows and design systems validate the experience early."},
    {"title": "Build & Integrate", "desc": "Engineering focuses on quality, maintainability, and deployment readiness."},
    {"title": "Launch & Grow", "desc": "Post-launch support ensures continuous performance and growth."},
]

SERVICES = [
    {
        "file": "mobile.html",
        "title": "Mobile App Development | Nexura",
        "description": "Native and cross-platform mobile apps with premium UX, fast launch, and scalable architecture.",
        "tag": "Mobile Products",
        "h1": 'Native &amp; cross-platform apps built for <span class="highlight">growth</span>.',
        "lead": "We build mobile products that feel fast, intuitive, and polished — whether for daily consumer engagement or secure enterprise workflows.",
        "svg": "mobile-app.svg",
        "float_top": "4.8 App Store Rating", "float_top_icon": "fa-star",
        "float_bottom": "50+ Apps Launched", "float_bottom_icon": "fa-mobile-alt",
        "metrics": ["iOS & Android native", "Flutter & React Native", "App Store launch support"],
        "tech": [("fab fa-apple", "Swift / SwiftUI"), ("fab fa-android", "Kotlin"), ("fas fa-code-branch", "Flutter"), ("fab fa-react", "React Native"), ("fas fa-cloud", "Firebase"), ("fas fa-chart-line", "Analytics")],
        "deliver_h2": "High-impact mobile products for users, teams, and launch success.",
        "deliver_desc": "From app concept to App Store launch, every build is optimized for retention, performance, and growth.",
        "cards": [
            {"icon": "mobile.svg", "title": "Consumer Mobile Apps", "desc": "Experience-rich apps designed for engagement, discovery, and daily use.", "bullets": ["Delightful onboarding journeys", "Notification-driven retention", "Offline-first user flows"]},
            {"icon": "security.svg", "title": "Enterprise Mobile Tools", "desc": "Secure apps for field teams, distributed workforces, and business workflows.", "bullets": ["Role-based access and permissions", "Reliable data sync and reporting", "Audit-ready security controls"]},
            {"icon": "rocket.svg", "title": "Cross-Platform Delivery", "desc": "Shared codebase strategies that accelerate launch without sacrificing quality.", "bullets": ["Reusable component systems", "Native hardware integrations", "App Store and Play Store support"]},
        ],
        "why_tag": "Why mobile matters", "why_h2": "Mobile is where your users live every day.", "why_desc": "A premium mobile product increases engagement, loyalty, and revenue across every touchpoint.",
        "why": [
            {"icon": "fa-bolt", "title": "Performance first", "desc": "We optimize for startup time, smooth animations, and battery-efficient operations.", "items": ["Native and near-native performance", "Real-device testing pipelines", "Crash-free session targets"]},
            {"icon": "fa-heart", "title": "Retention by design", "desc": "Onboarding, notifications, and UX patterns that keep users coming back.", "items": ["Personalized onboarding flows", "Push and in-app messaging", "Analytics-driven iteration"]},
        ],
        "cases": [
            {"badge": "+40% Retention", "title": "Fitness app relaunch", "desc": "Redesigned onboarding and offline mode increased 30-day retention by 40%.", "tag": "Consumer · iOS · UX"},
            {"badge": "2x Productivity", "title": "Field service platform", "desc": "Enterprise mobile tool reduced field reporting time by half.", "tag": "Enterprise · Android · Sync"},
            {"badge": "4.9 Rating", "title": "Fintech mobile wallet", "desc": "Secure cross-platform app with biometric auth and instant transfers.", "tag": "Fintech · Flutter · Security"},
        ],
        "stats": [("50+", "Apps launched"), ("4.8", "Average store rating"), ("35%", "Retention uplift"), ("100%", "Store compliance")],
        "cta_h2": "Launch your mobile product", "cta_p": "Partner with Nexura to ship a mobile app that users love and your business can scale.",
    },
    {
        "file": "cloud.html",
        "title": "Cloud Engineering | Nexura",
        "description": "Secure cloud infrastructure, DevOps, and observability for scalable digital systems.",
        "tag": "Cloud Engineering",
        "h1": 'Secure cloud infrastructure engineered to <span class="highlight">scale</span>.',
        "lead": "We design resilient cloud architecture, DevOps workflows, and monitoring systems that keep your product available, observable, and cost-effective.",
        "svg": "cloud-engineering.svg",
        "float_top": "99.99% Uptime", "float_top_icon": "fa-server",
        "float_bottom": "40% Cost Savings", "float_bottom_icon": "fa-dollar-sign",
        "metrics": ["AWS, Azure & GCP", "Infrastructure as Code", "24/7 observability"],
        "tech": [("fab fa-aws", "AWS"), ("fab fa-microsoft", "Azure"), ("fab fa-google", "GCP"), ("fab fa-docker", "Docker"), ("fas fa-cubes", "Kubernetes"), ("fas fa-code-branch", "Terraform")],
        "deliver_h2": "Modern infrastructure for reliability, performance, and efficiency.",
        "deliver_desc": "We build cloud systems that help teams ship faster, reduce risk, and scale without surprise outages.",
        "cards": [
            {"icon": "cloud.svg", "title": "Cloud Architecture", "desc": "Design secure infrastructure with multi-cloud strategy, IaC, and resilient foundations.", "bullets": ["Serverless and container platforms", "Infrastructure as Code", "Security and compliance"]},
            {"icon": "performance.svg", "title": "Performance Engineering", "desc": "Optimize architecture for reliability, latency, and efficient resource usage.", "bullets": ["Auto-scaling and routing", "Load testing and tuning", "Global delivery patterns"]},
            {"icon": "chart.svg", "title": "Observability", "desc": "Monitoring, logging, and incident workflows for confident operations.", "bullets": ["Real-time dashboards", "Alerting and runbooks", "Continuous improvement"]},
        ],
        "why_tag": "Cloud value", "why_h2": "Faster releases, safer systems, and lower operational cost.", "why_desc": "The right cloud foundation makes your product more reliable and easier to operate.",
        "why": [
            {"icon": "fa-shield-alt", "title": "Engineering resilience", "desc": "Infrastructure with redundancy, automated recovery, and secure boundaries.", "items": ["Fault-tolerant multi-region deployments", "Network segmentation and encryption", "IAM best practices"]},
            {"icon": "fa-cogs", "title": "Operational maturity", "desc": "Cloud engineering that improves team confidence and reduces firefighting.", "items": ["CI/CD with automated validation", "Monitoring and incident response", "Cost governance and optimization"]},
        ],
        "cases": [
            {"badge": "-50% Ops", "title": "Managed services migration", "desc": "Moved legacy app to managed cloud and reduced manual ops by 50%.", "tag": "Migration · AWS · DevOps"},
            {"badge": "Multi-Region", "title": "Global deployment", "desc": "Designed multi-region architecture for performance and disaster recovery.", "tag": "Architecture · GCP · Scale"},
            {"badge": "-30% Cost", "title": "Cost governance", "desc": "Monitoring and budget controls cut infrastructure waste significantly.", "tag": "FinOps · Azure · Monitoring"},
        ],
        "stats": [("99.99%", "Uptime delivered"), ("40%", "Cost savings"), ("60%", "Deploy frequency"), ("24/7", "Visibility")],
        "cta_h2": "Start cloud engineering", "cta_p": "Build infrastructure that scales with confidence and operates with clarity.",
    },
    {
        "file": "ai.html",
        "title": "AI & Automation | Nexura",
        "description": "AI-powered products, intelligent automation, and data-driven decision systems.",
        "tag": "AI & Automation",
        "h1": 'Intelligent products that <span class="highlight">automate work</span> and unlock insights.',
        "lead": "We help teams build AI-powered experiences, automated workflows, and predictive systems that create measurable efficiency and value.",
        "svg": "ai-automation.svg",
        "float_top": "40hrs Saved/Week", "float_top_icon": "fa-clock",
        "float_bottom": "LLM Integrated", "float_bottom_icon": "fa-brain",
        "metrics": ["Custom AI agents", "Workflow automation", "Enterprise-ready security"],
        "tech": [("fas fa-robot", "OpenAI"), ("fas fa-brain", "Claude"), ("fab fa-google", "Gemini"), ("fas fa-database", "Vector DB"), ("fab fa-python", "Python"), ("fas fa-plug", "APIs")],
        "deliver_h2": "Modern AI and automation for faster decisions and smarter experiences.",
        "deliver_desc": "We build AI products that are reliable, understandable, and connected to your business outcomes.",
        "cards": [
            {"icon": "brain.svg", "title": "AI-Driven Experiences", "desc": "Conversational interfaces, personalization, and recommendation engines.", "bullets": ["Chatbots and virtual agents", "Behavior-based personalization", "Insights in the interface"]},
            {"icon": "automation.svg", "title": "Workflow Automation", "desc": "Reduce manual operations with automated pipelines and intelligent alerting.", "bullets": ["Process orchestration", "API-driven automation", "Event-based actions"]},
            {"icon": "chart.svg", "title": "Data Intelligence", "desc": "Turn raw data into predictions, forecasts, and decision support.", "bullets": ["Data ingestion and modeling", "Predictive insights", "Dashboard-driven decisions"]},
        ],
        "why_tag": "Why AI now", "why_h2": "AI is a competitive advantage when implemented responsibly.", "why_desc": "We focus on practical AI that delivers ROI — not experiments that never ship.",
        "why": [
            {"icon": "fa-magic", "title": "Practical intelligence", "desc": "AI features embedded where they create real user and business value.", "items": ["LLM integrations with guardrails", "Document and knowledge automation", "Custom model workflows"]},
            {"icon": "fa-lock", "title": "Secure & compliant", "desc": "Enterprise-grade security for sensitive data and regulated industries.", "items": ["Data privacy and access controls", "Audit trails and monitoring", "Human-in-the-loop validation"]},
        ],
        "cases": [
            {"badge": "40hrs/wk", "title": "Support automation", "desc": "AI agent reduced support ticket volume and saved 40 hours per week.", "tag": "LLM · Support · Automation"},
            {"badge": "+60% Speed", "title": "Document intelligence", "desc": "Automated contract review cut processing time by 60%.", "tag": "NLP · Enterprise · Compliance"},
            {"badge": "3x ROI", "title": "Predictive analytics", "desc": "ML forecasting model improved inventory decisions with 3x ROI.", "tag": "ML · Retail · Data"},
        ],
        "stats": [("40+", "AI products shipped"), ("3x", "Average ROI"), ("95%", "Accuracy targets"), ("24/7", "Agent availability")],
        "cta_h2": "Build your AI product", "cta_p": "From intelligent agents to full automation platforms — we ship AI that works in production.",
    },
    {
        "file": "software-engineering.html",
        "title": "Software Engineering | Nexura",
        "description": "Enterprise software engineering for web, mobile, and cloud platforms.",
        "tag": "Software Engineering",
        "h1": 'Build resilient software with <span class="highlight">modern engineering</span> practices.',
        "lead": "Custom software engineering for startups and enterprises — from full-stack development to API architecture and ongoing support.",
        "svg": "software-engineering.svg",
        "float_top": "500+ Projects", "float_top_icon": "fa-code",
        "float_bottom": "98% Satisfaction", "float_bottom_icon": "fa-thumbs-up",
        "metrics": ["Clean architecture", "Agile delivery", "Enterprise security"],
        "tech": [("fab fa-react", "React"), ("fab fa-node-js", "Node.js"), ("fab fa-python", "Python"), ("fas fa-database", "PostgreSQL"), ("fab fa-docker", "Docker"), ("fas fa-code-branch", "Git")],
        "deliver_h2": "Enterprise-grade software tailored to your business needs.",
        "deliver_desc": "High-performance applications that support product growth, automation, and future innovation.",
        "cards": [
            {"icon": "saas.svg", "title": "Custom Web Applications", "desc": "Secure, scalable web platforms with modern frameworks and API-first architecture.", "bullets": ["Responsive enterprise UIs", "API-first design", "Third-party integrations"]},
            {"icon": "mobile.svg", "title": "Mobile & Cross-Platform", "desc": "Native and hybrid apps for performance and deep device integration.", "bullets": ["iOS and Android native", "Cross-platform frameworks", "Offline capabilities"]},
            {"icon": "cloud.svg", "title": "Cloud Native Engineering", "desc": "Microservices, CI/CD, and containerized infrastructure.", "bullets": ["Microservices architecture", "Automated CI/CD pipelines", "Container orchestration"]},
        ],
        "why_tag": "Why engineering matters", "why_h2": "Quality engineering is the foundation of every great product.", "why_desc": "We build systems that are maintainable, testable, and ready to evolve with your business.",
        "why": [
            {"icon": "fa-sitemap", "title": "Clean architecture", "desc": "Modular, documented codebases that teams can extend confidently.", "items": ["Domain-driven design patterns", "Automated test coverage", "Technical documentation"]},
            {"icon": "fa-rocket", "title": "Rapid delivery", "desc": "Agile sprints with transparent progress and predictable releases.", "items": ["Two-week sprint cycles", "Continuous integration", "Staging and production pipelines"]},
        ],
        "cases": [
            {"badge": "3x Scale", "title": "SaaS platform rebuild", "desc": "Re-architected monolith into microservices supporting 3x user growth.", "tag": "SaaS · Microservices · Scale"},
            {"badge": "99.9%", "title": "Enterprise portal", "desc": "Mission-critical portal with 99.9% uptime and sub-second response.", "tag": "Enterprise · Performance"},
            {"badge": "-50% Bugs", "title": "QA automation", "desc": "Test automation reduced production defects by 50%.", "tag": "QA · CI/CD · Automation"},
        ],
        "stats": [("500+", "Projects"), ("98%", "Client satisfaction"), ("10+", "Years experience"), ("24/7", "Support available")],
        "cta_h2": "Start your software project", "cta_p": "Partner with Nexura for engineering excellence from MVP to enterprise scale.",
    },
    {
        "file": "it-consulting.html",
        "title": "IT Consulting | Nexura",
        "description": "Expert IT advisory and digital transformation consulting for modern businesses.",
        "tag": "IT Consulting",
        "h1": 'Strategic IT consulting for <span class="highlight">digital transformation</span>.',
        "lead": "Expert advisory on technology strategy, architecture decisions, and digital transformation roadmaps that align IT with business goals.",
        "svg": "it-consulting.svg",
        "float_top": "200+ Clients", "float_top_icon": "fa-users",
        "float_bottom": "ROI Focused", "float_bottom_icon": "fa-chart-pie",
        "metrics": ["Technology roadmaps", "Architecture reviews", "Vendor evaluation"],
        "tech": [("fas fa-sitemap", "Enterprise Arch"), ("fas fa-shield-alt", "Security"), ("fas fa-cloud", "Cloud Strategy"), ("fas fa-chart-line", "Analytics"), ("fas fa-cogs", "DevOps"), ("fas fa-database", "Data")],
        "deliver_h2": "Advisory services that turn technology into competitive advantage.",
        "deliver_desc": "We help leadership teams make confident technology decisions with clarity and measurable outcomes.",
        "cards": [
            {"icon": "chart.svg", "title": "Digital Strategy", "desc": "Align technology investments with business objectives and market opportunities.", "bullets": ["Technology roadmaps", "Digital maturity assessment", "Innovation workshops"]},
            {"icon": "layers.svg", "title": "Architecture Advisory", "desc": "Evaluate and design systems for scalability, security, and maintainability.", "bullets": ["Architecture reviews", "Migration planning", "Technology selection"]},
            {"icon": "security.svg", "title": "Risk & Compliance", "desc": "Identify risks and build compliance-ready technology foundations.", "bullets": ["Security assessments", "Compliance readiness", "Vendor evaluation"]},
        ],
        "why_tag": "Why consulting", "why_h2": "The right strategy prevents costly mistakes.", "why_desc": "Expert guidance saves time, reduces risk, and accelerates digital transformation.",
        "why": [
            {"icon": "fa-lightbulb", "title": "Clarity & direction", "desc": "Clear recommendations backed by industry experience and data.", "items": ["Executive-level reporting", "Prioritized action plans", "ROI modeling"]},
            {"icon": "fa-handshake", "title": "Vendor-neutral advice", "desc": "Recommendations based on your needs, not vendor partnerships.", "items": ["Unbiased technology selection", "RFP support", "Contract negotiation guidance"]},
        ],
        "cases": [
            {"badge": "$2M Saved", "title": "Cloud strategy", "desc": "Consolidated cloud spend and saved $2M annually through right-sizing.", "tag": "Cloud · FinOps · Strategy"},
            {"badge": "6mo Roadmap", "title": "Digital transformation", "desc": "Delivered 18-month transformation roadmap in 6 weeks.", "tag": "Strategy · Enterprise"},
            {"badge": "100% Compliant", "title": "Compliance readiness", "desc": "Achieved SOC 2 readiness within one audit cycle.", "tag": "Security · Compliance"},
        ],
        "stats": [("200+", "Clients advised"), ("$5M+", "Cost savings delivered"), ("95%", "Recommendation adoption"), ("10+", "Industries served")],
        "cta_h2": "Get expert IT guidance", "cta_p": "Book a consultation to align your technology strategy with business growth.",
    },
    {
        "file": "data-analytics.html",
        "title": "Data & Analytics | Nexura",
        "description": "Business intelligence, data pipelines, and analytics for data-driven decisions.",
        "tag": "Data & Analytics",
        "h1": 'Turn data into <span class="highlight">actionable insights</span>.',
        "lead": "Business intelligence, data engineering, and analytics platforms that help teams make faster, smarter decisions.",
        "svg": "data-analytics.svg",
        "float_top": "Real-time Dashboards", "float_top_icon": "fa-chart-bar",
        "float_bottom": "10TB+ Processed", "float_bottom_icon": "fa-database",
        "metrics": ["Data pipelines", "BI dashboards", "Predictive models"],
        "tech": [("fas fa-database", "Snowflake"), ("fab fa-python", "Python"), ("fas fa-chart-line", "Tableau"), ("fas fa-cloud", "BigQuery"), ("fas fa-cogs", "Airflow"), ("fas fa-brain", "ML")],
        "deliver_h2": "End-to-end data solutions for modern businesses.",
        "deliver_desc": "From raw data to executive dashboards — we build analytics infrastructure that scales.",
        "cards": [
            {"icon": "chart.svg", "title": "Business Intelligence", "desc": "Interactive dashboards and reports for every stakeholder level.", "bullets": ["Executive dashboards", "Self-service analytics", "KPI tracking and alerts"]},
            {"icon": "api.svg", "title": "Data Engineering", "desc": "Reliable pipelines that ingest, transform, and deliver clean data.", "bullets": ["ETL/ELT pipelines", "Data warehouse design", "Real-time streaming"]},
            {"icon": "brain.svg", "title": "Predictive Analytics", "desc": "ML models that forecast trends and automate decisions.", "bullets": ["Forecasting models", "Anomaly detection", "Recommendation engines"]},
        ],
        "why_tag": "Why data matters", "why_h2": "Data-driven companies outperform competitors.", "why_desc": "Unified analytics turn scattered data into a strategic asset.",
        "why": [
            {"icon": "fa-tachometer-alt", "title": "Single source of truth", "desc": "Consolidated data models everyone trusts.", "items": ["Data governance frameworks", "Master data management", "Quality monitoring"]},
            {"icon": "fa-eye", "title": "Visibility at every level", "desc": "From operations to boardroom — insights when they matter.", "items": ["Role-based dashboards", "Automated reporting", "Mobile analytics access"]},
        ],
        "cases": [
            {"badge": "+35% Revenue", "title": "Retail analytics", "desc": "Demand forecasting improved inventory and increased revenue 35%.", "tag": "Retail · ML · Forecasting"},
            {"badge": "Real-time", "title": "Operations dashboard", "desc": "Live ops dashboard reduced incident response time by 70%.", "tag": "Ops · Streaming · BI"},
            {"badge": "360° View", "title": "Customer data platform", "desc": "Unified customer view enabled personalized marketing at scale.", "tag": "CDP · Marketing · Data"},
        ],
        "stats": [("10TB+", "Data processed"), ("35%", "Revenue uplift"), ("70%", "Faster decisions"), ("99.9%", "Pipeline reliability")],
        "cta_h2": "Unlock your data potential", "cta_p": "Build analytics infrastructure that turns data into your competitive edge.",
    },
    {
        "file": "application-modernization.html",
        "title": "Application Modernization | Nexura",
        "description": "Transform legacy systems into modern cloud-native applications.",
        "tag": "App Modernization",
        "h1": 'Modernize legacy apps for <span class="highlight">speed and scale</span>.',
        "lead": "Transform outdated systems into modern, scalable, cloud-native applications with measurable performance gains and lower operational costs.",
        "svg": "application-modernization.svg",
        "float_top": "3x Performance", "float_top_icon": "fa-bolt",
        "float_bottom": "50% Cost Cut", "float_bottom_icon": "fa-percentage",
        "metrics": ["Legacy migration", "Cloud-native rebuild", "Zero-downtime cutover"],
        "tech": [("fab fa-aws", "AWS"), ("fab fa-docker", "Containers"), ("fas fa-code-branch", "Microservices"), ("fas fa-database", "Kafka"), ("fas fa-cloud", "Serverless"), ("fas fa-shield-alt", "Security")],
        "deliver_h2": "Proven modernization strategies for every legacy system.",
        "deliver_desc": "Whether rehost, refactor, rebuild, or replace — we choose the right path for your goals and timeline.",
        "cards": [
            {"icon": "cloud.svg", "title": "Rehost (Lift & Shift)", "desc": "Move existing applications to cloud with minimal changes for fastest migration.", "bullets": ["Cloud migration planning", "Infrastructure provisioning", "Cutover orchestration"]},
            {"icon": "api.svg", "title": "Refactor (Re-architect)", "desc": "Restructure for cloud-native architecture and microservices.", "bullets": ["Service decomposition", "API gateway design", "Database modernization"]},
            {"icon": "rocket.svg", "title": "Rebuild (Rewrite)", "desc": "Complete rebuild with modern frameworks for maximum performance.", "bullets": ["Greenfield architecture", "Parallel run strategy", "Data migration"]},
        ],
        "why_tag": "Why modernize", "why_h2": "Legacy systems hold your business back.", "why_desc": "Modern platforms unlock agility, reduce costs, and enable innovation.",
        "why": [
            {"icon": "fa-tachometer-alt", "title": "3x performance boost", "desc": "Modern apps run faster and handle more users with better UX.", "items": ["Performance benchmarking", "Auto-scaling infrastructure", "CDN and caching layers"]},
            {"icon": "fa-dollar-sign", "title": "50% cost reduction", "desc": "Cloud-native solutions reduce infrastructure and maintenance costs.", "items": ["Right-sized resources", "Managed services adoption", "License optimization"]},
        ],
        "cases": [
            {"badge": "3x Faster", "title": "ERP modernization", "desc": "Legacy ERP migrated to cloud microservices with 3x performance gain.", "tag": "Enterprise · Cloud · Migration"},
            {"badge": "-50% Cost", "title": "Mainframe exit", "desc": "Mainframe workloads moved to cloud saving 50% annually.", "tag": "Migration · FinOps"},
            {"badge": "99.9%", "title": "Zero-downtime cutover", "desc": "Phased migration with zero production downtime.", "tag": "DevOps · Reliability"},
        ],
        "stats": [("500+", "Apps modernized"), ("3x", "Performance boost"), ("50%", "Cost reduction"), ("99.9%", "Uptime achieved")],
        "cta_h2": "Modernize your applications", "cta_p": "Transform legacy systems into platforms built for the next decade.",
    },
    {
        "file": "saas-platforms.html",
        "title": "SaaS & Platforms | Nexura",
        "description": "Build scalable SaaS products and multi-tenant platform solutions.",
        "tag": "SaaS & Platforms",
        "h1": 'Build SaaS products that <span class="highlight">scale</span>.',
        "lead": "Multi-tenant architecture, subscription billing, analytics, and APIs — SaaS platforms built for growth and reliability.",
        "svg": "saas-platforms.svg",
        "float_top": "Multi-Tenant", "float_top_icon": "fa-users",
        "float_bottom": "Stripe Ready", "float_bottom_icon": "fa-credit-card",
        "metrics": ["Subscription billing", "Tenant isolation", "Developer APIs"],
        "tech": [("fab fa-stripe", "Stripe"), ("fab fa-react", "React"), ("fab fa-node-js", "Node.js"), ("fas fa-database", "PostgreSQL"), ("fas fa-plug", "Webhooks"), ("fas fa-chart-line", "Analytics")],
        "deliver_h2": "Platform engineering for recurring revenue products.",
        "deliver_desc": "From MVP to enterprise SaaS — we build the foundation your product needs to grow.",
        "cards": [
            {"icon": "layers.svg", "title": "Multi-Tenant SaaS", "desc": "Secure tenant isolation, RBAC, and configuration for enterprise products.", "bullets": ["Tenant data isolation", "Role-based access control", "Per-tenant configuration"]},
            {"icon": "commerce.svg", "title": "Subscription Billing", "desc": "Recurring plans, trials, invoicing with Stripe and modern gateways.", "bullets": ["Plan and pricing management", "Trial and upgrade flows", "Invoice and tax handling"]},
            {"icon": "api.svg", "title": "API & Integrations", "desc": "Developer-friendly APIs, webhooks, and partner connections.", "bullets": ["REST and GraphQL APIs", "Webhook delivery system", "OAuth and API keys"]},
        ],
        "why_tag": "Why SaaS", "why_h2": "SaaS models create predictable, scalable revenue.", "why_desc": "The right platform architecture supports growth from 10 to 10,000 customers.",
        "why": [
            {"icon": "fa-chart-line", "title": "Growth-ready architecture", "desc": "Systems designed to scale tenants, data, and revenue without rewrites.", "items": ["Horizontal scaling patterns", "Usage metering", "Churn analytics"]},
            {"icon": "fa-lock", "title": "Enterprise readiness", "desc": "Security and compliance features enterprise buyers expect.", "items": ["SSO and SAML integration", "Audit logs", "SOC 2 alignment"]},
        ],
        "cases": [
            {"badge": "$1M ARR", "title": "B2B SaaS launch", "desc": "MVP to $1M ARR in 14 months with multi-tenant platform.", "tag": "B2B · Billing · Scale"},
            {"badge": "10x Tenants", "title": "Platform scaling", "desc": "Architecture supported 10x tenant growth without downtime.", "tag": "Multi-tenant · Performance"},
            {"badge": "SSO Live", "title": "Enterprise upgrade", "desc": "Added SSO and audit logs to close enterprise deals.", "tag": "Enterprise · Security"},
        ],
        "stats": [("30+", "SaaS products built"), ("$10M+", "ARR enabled"), ("10x", "Tenant scaling"), ("99.9%", "Platform uptime")],
        "cta_h2": "Build your SaaS platform", "cta_p": "Launch a subscription product with billing, analytics, and APIs built in from day one.",
    },
    {
        "file": "product-design.html",
        "title": "Product Design | Nexura",
        "description": "User-centered product design and UX strategy for digital products.",
        "tag": "Product Design",
        "h1": 'Design experiences that <span class="highlight">convert and delight</span>.',
        "lead": "User-centered product design that brings business strategy to intuitive, beautiful digital experiences.",
        "svg": "product-design.svg",
        "float_top": "Design Systems", "float_top_icon": "fa-palette",
        "float_bottom": "+30% Conversion", "float_bottom_icon": "fa-arrow-up",
        "metrics": ["UX research", "Design systems", "Prototyping"],
        "tech": [("fab fa-figma", "Figma"), ("fas fa-pencil-ruler", "Design Systems"), ("fas fa-users", "User Research"), ("fas fa-mobile-alt", "Responsive"), ("fas fa-universal-access", "A11y"), ("fas fa-vial", "Usability Testing")],
        "deliver_h2": "Design services from research to high-fidelity delivery.",
        "deliver_desc": "We bridge strategy and engineering with design that users love and businesses trust.",
        "cards": [
            {"icon": "design.svg", "title": "UX Research & Strategy", "desc": "Understand users deeply before designing solutions.", "bullets": ["User interviews and surveys", "Journey mapping", "Competitive analysis"]},
            {"icon": "experience.svg", "title": "UI Design & Prototyping", "desc": "High-fidelity interfaces and interactive prototypes.", "bullets": ["Visual design systems", "Interactive prototypes", "Responsive layouts"]},
            {"icon": "chart.svg", "title": "Conversion Optimization", "desc": "Data-informed design that improves key business metrics.", "bullets": ["A/B test design", "Funnel optimization", "Accessibility audits"]},
        ],
        "why_tag": "Why design matters", "why_h2": "Great design is a business multiplier.", "why_desc": "Thoughtful UX reduces friction, builds trust, and drives conversion.",
        "why": [
            {"icon": "fa-heart", "title": "User-centered process", "desc": "Every decision validated with real user feedback.", "items": ["Usability testing sessions", "Iterative design sprints", "Accessibility standards"]},
            {"icon": "fa-puzzle-piece", "title": "Design systems", "desc": "Consistent, scalable component libraries for faster development.", "items": ["Component documentation", "Design tokens", "Developer handoff"]},
        ],
        "cases": [
            {"badge": "+30% CVR", "title": "E-commerce redesign", "desc": "Checkout redesign increased conversion by 30%.", "tag": "E-commerce · UX · CVR"},
            {"badge": "Design System", "title": "Enterprise UI kit", "desc": "Design system reduced dev time by 40% across 5 products.", "tag": "Design System · Enterprise"},
            {"badge": "4.9 UX Score", "title": "SaaS onboarding", "desc": "Onboarding redesign achieved 4.9/5 user satisfaction.", "tag": "SaaS · Onboarding · UX"},
        ],
        "stats": [("100+", "Products designed"), ("30%", "Avg conversion lift"), ("40%", "Faster dev handoff"), ("WCAG", "Accessibility compliant")],
        "cta_h2": "Design your next product", "cta_p": "Create digital experiences that users love and metrics prove.",
    },
    {
        "file": "testing-qa.html",
        "title": "Testing & QA | Nexura",
        "description": "Quality assurance, test automation, and performance testing services.",
        "tag": "Testing & QA",
        "h1": 'Ship with <span class="highlight">confidence</span> every release.',
        "lead": "Quality assurance, automation, and performance testing that protects your release confidence and user experience.",
        "svg": "testing-qa.svg",
        "float_top": "95% Coverage", "float_top_icon": "fa-check-double",
        "float_bottom": "-80% Bugs", "float_bottom_icon": "fa-bug",
        "metrics": ["Test automation", "Performance testing", "Security testing"],
        "tech": [("fas fa-vial", "Selenium"), ("fab fa-js", "Cypress"), ("fas fa-tachometer-alt", "JMeter"), ("fas fa-shield-alt", "OWASP"), ("fas fa-code-branch", "CI/CD"), ("fas fa-mobile-alt", "Appium")],
        "deliver_h2": "Comprehensive QA for web, mobile, and API products.",
        "deliver_desc": "From manual exploratory testing to full automation pipelines — quality built into every release.",
        "cards": [
            {"icon": "automation.svg", "title": "Test Automation", "desc": "Automated regression suites that catch bugs before production.", "bullets": ["E2E test frameworks", "CI/CD integration", "Visual regression testing"]},
            {"icon": "performance.svg", "title": "Performance Testing", "desc": "Load, stress, and scalability testing for confident launches.", "bullets": ["Load and stress testing", "Performance benchmarking", "Bottleneck identification"]},
            {"icon": "security.svg", "title": "Security Testing", "desc": "Vulnerability assessments and penetration testing.", "bullets": ["OWASP top 10 testing", "API security validation", "Compliance test suites"]},
        ],
        "why_tag": "Why QA matters", "why_h2": "Quality is cheaper than fixing production bugs.", "why_desc": "Investing in QA reduces downtime, protects reputation, and accelerates releases.",
        "why": [
            {"icon": "fa-shield-alt", "title": "Release confidence", "desc": "Ship knowing every critical path is tested and verified.", "items": ["Release gate criteria", "Smoke and regression suites", "Production monitoring alignment"]},
            {"icon": "fa-robot", "title": "Automation ROI", "desc": "Automated tests save hours every sprint and catch regressions early.", "items": ["Framework selection", "Maintainable test architecture", "Flaky test elimination"]},
        ],
        "cases": [
            {"badge": "-80% Bugs", "title": "Automation program", "desc": "Test automation reduced production defects by 80%.", "tag": "Automation · CI/CD"},
            {"badge": "10K Users", "title": "Load test success", "desc": "Platform validated for 10K concurrent users before launch.", "tag": "Performance · Scale"},
            {"badge": "SOC 2", "title": "Security audit pass", "desc": "Security testing helped achieve SOC 2 compliance.", "tag": "Security · Compliance"},
        ],
        "stats": [("95%", "Test coverage"), ("-80%", "Production bugs"), ("10K+", "Concurrent users tested"), ("100%", "Release gate compliance")],
        "cta_h2": "Strengthen your QA", "cta_p": "Build quality into every release with automation and expert testing.",
    },
    {
        "file": "ecommerce-strategy.html",
        "title": "E-commerce Strategy | Nexura",
        "description": "Commerce planning and optimization for digital stores and marketplace growth.",
        "tag": "E-commerce Strategy",
        "h1": 'Commerce strategies that <span class="highlight">drive revenue</span>.',
        "lead": "Commerce planning and optimization for digital stores, subscriptions, and marketplace growth.",
        "svg": "ecommerce-strategy.svg",
        "float_top": "+25% AOV", "float_top_icon": "fa-shopping-cart",
        "float_bottom": "Headless Ready", "float_bottom_icon": "fa-store",
        "metrics": ["Conversion optimization", "Headless commerce", "Marketplace strategy"],
        "tech": [("fas fa-shopping-bag", "Shopify"), ("fas fa-store", "WooCommerce"), ("fas fa-cloud", "Headless CMS"), ("fab fa-stripe", "Stripe"), ("fas fa-chart-line", "Analytics"), ("fas fa-search", "SEO")],
        "deliver_h2": "End-to-end commerce strategy and implementation.",
        "deliver_desc": "From storefront design to checkout optimization — we grow your digital commerce revenue.",
        "cards": [
            {"icon": "cart.svg", "title": "Storefront Strategy", "desc": "Commerce architecture and platform selection for your business model.", "bullets": ["Platform evaluation", "Catalog architecture", "Merchandising strategy"]},
            {"icon": "commerce.svg", "title": "Checkout Optimization", "desc": "Reduce cart abandonment and increase average order value.", "bullets": ["Checkout flow redesign", "Payment method optimization", "Upsell and cross-sell flows"]},
            {"icon": "chart.svg", "title": "Growth & Analytics", "desc": "Data-driven commerce growth with attribution and funnel analysis.", "bullets": ["Conversion funnel analysis", "A/B testing programs", "Customer lifetime value modeling"]},
        ],
        "why_tag": "Why commerce strategy", "why_h2": "E-commerce success requires more than a storefront.", "why_desc": "Strategic commerce decisions compound into sustainable revenue growth.",
        "why": [
            {"icon": "fa-funnel-dollar", "title": "Conversion focus", "desc": "Every touchpoint optimized from discovery to purchase.", "items": ["Product page optimization", "Cart abandonment recovery", "Mobile commerce UX"]},
            {"icon": "fa-globe", "title": "Omnichannel ready", "desc": "Unified commerce across web, mobile, and marketplaces.", "items": ["Headless architecture", "Marketplace integration", "Inventory synchronization"]},
        ],
        "cases": [
            {"badge": "+25% AOV", "title": "Checkout optimization", "desc": "Streamlined checkout increased average order value by 25%.", "tag": "CRO · Checkout · Revenue"},
            {"badge": "+18% Revenue", "title": "Headless storefront", "desc": "Headless rebuild drove 18% revenue growth in Q1.", "tag": "Headless · Performance"},
            {"badge": "3 Markets", "title": "Marketplace expansion", "desc": "Launched on 3 new marketplaces with unified inventory.", "tag": "Marketplace · Scale"},
        ],
        "stats": [("25%", "AOV increase"), ("18%", "Revenue growth"), ("-35%", "Cart abandonment"), ("3x", "Marketplace reach")],
        "cta_h2": "Grow your commerce revenue", "cta_p": "Build a commerce strategy that converts browsers into loyal customers.",
    },
    {
        "file": "development.html",
        "title": "Development | Nexura — Modern Software Engineering",
        "description": "Professional web and mobile development with enterprise-grade engineering.",
        "tag": "Development",
        "h1": 'Web &amp; mobile <span class="highlight">development</span> that scales ideas into reality.',
        "lead": "High-performance web, mobile, and enterprise applications using modern architectures, clean code, and agile delivery.",
        "svg": "development.svg",
        "float_top": "Full-Stack", "float_top_icon": "fa-layer-group",
        "float_bottom": "Agile Delivery", "float_bottom_icon": "fa-sync",
        "metrics": ["Full-stack engineering", "Agile sprints", "Clean code standards"],
        "tech": [("fab fa-react", "React"), ("fab fa-node-js", "Node.js"), ("fab fa-python", "Python"), ("fas fa-mobile-alt", "Mobile"), ("fab fa-docker", "Docker"), ("fas fa-code-branch", "Git")],
        "deliver_h2": "Full-stack development services for modern product roadmaps.",
        "deliver_desc": "From responsive web apps to native mobile — quality software with engineering rigor.",
        "cards": [
            {"icon": "saas.svg", "title": "Frontend Engineering", "desc": "React, Next.js, Vue, and Angular for performance and accessibility.", "bullets": ["Component-driven architecture", "Performance optimization", "Accessibility compliance"]},
            {"icon": "api.svg", "title": "Backend Systems", "desc": "API-first backends with Node.js, Python, Java, and Go.", "bullets": ["REST and GraphQL APIs", "Microservice architecture", "Database design"]},
            {"icon": "mobile.svg", "title": "Mobile Development", "desc": "iOS, Android, Flutter, and React Native applications.", "bullets": ["Native iOS and Android", "Cross-platform frameworks", "App store deployment"]},
        ],
        "why_tag": "Why choose us", "why_h2": "Development done right saves time and money.", "why_desc": "Clean code, clear communication, and predictable delivery on every project.",
        "why": [
            {"icon": "fa-code", "title": "Clean code culture", "desc": "Maintainable codebases your team can extend for years.", "items": ["Code review standards", "Documentation practices", "Technical debt management"]},
            {"icon": "fa-users", "title": "Agile partnership", "desc": "Transparent sprints with demos and feedback every two weeks.", "items": ["Sprint planning", "Weekly demos", "Flexible scope management"]},
        ],
        "cases": [
            {"badge": "4x Speed", "title": "MVP in 8 weeks", "desc": "Full-stack MVP delivered in 8 weeks, enabling seed funding.", "tag": "MVP · Startup · Full-stack"},
            {"badge": "99.9%", "title": "Enterprise app", "desc": "Mission-critical app with 99.9% uptime SLA.", "tag": "Enterprise · Reliability"},
            {"badge": "2 Platforms", "title": "Cross-platform app", "desc": "Single codebase launched on iOS and Android simultaneously.", "tag": "Mobile · Flutter"},
        ],
        "stats": [("4x", "Faster timelines"), ("99%", "On-time delivery"), ("30%", "Conversion lift"), ("100%", "Responsive coverage")],
        "cta_h2": "Let's build together", "cta_p": "Partner with Nexura for robust, maintainable software ready for growth.",
    },
]

for svc in SERVICES:
  content = HEAD.format(title=svc["title"], description=svc["description"])
  content += hero(svc)
  content += tech_strip(svc["tech"])
  content += deliver(svc)
  content += why(svc)
  content += process(DEFAULT_PROCESS)
  content += capabilities([
    {"icon": "performance.svg", "title": "Performance & Reliability", "desc": "Optimized systems built for speed, scale, and uptime."},
    {"icon": "security.svg", "title": "Security & Compliance", "desc": "Secure controls, encryption, and standards-based compliance readiness."},
  ])
  content += cases(svc["cases"])
  content += stats(svc["stats"])
  content += cta(svc)
  content += FOOT
  path = os.path.join(BASE, svc["file"])
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)
  print("Created:", svc["file"])

print("Done!")
