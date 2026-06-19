/**
 * Build Unified Infotech homepage — exact copy from www.unifiedinfotech.net
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.join(__dirname, '..');

function writeHeader() {
    const html = `<!-- Unified Infotech — header (exact nav) -->
<header class="ui-header" id="uiHeader">
    <div class="ui-container ui-header__inner">
        <a href="index.html" class="ui-logo">
            <span class="ui-logo-mark" aria-hidden="true">U</span>
            <span class="ui-logo-text">Unified<span> Infotech</span></span>
        </a>

        <ul class="ui-nav" id="uiNav">
            <li data-menu="services">
                <button type="button" class="ui-nav-link">Services <i class="fas fa-chevron-down"></i></button>
                <div class="ui-mega">
                    <div class="ui-mega-grid">
                        <div class="ui-mega-col">
                            <h4>Software Engineering</h4>
                            <a href="web.html">Website Development</a>
                            <a href="development.html">Web App Development</a>
                            <a href="mobile.html">Mobile App Development</a>
                            <a href="application-modernization.html">Application Modernization</a>
                            <a href="software-engineering.html">Blockchain Development</a>
                            <a href="software-engineering.html">Custom Software Development</a>
                            <a href="saas-platforms.html">SaaS Development</a>
                            <a href="ecommerce-strategy.html">E-commerce Development</a>
                            <a href="testing-qa.html">Testing &amp; Quality Assurance</a>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Design &amp; Digital Experience</h4>
                            <a href="product-design.html">User Research</a>
                            <a href="web.html">Web Design</a>
                            <a href="product-design.html">UI/UX Design</a>
                            <a href="product-design.html">IA and UX Design</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">Manufacturing</span>
                                <h5>Created a Conversion-centric Website for a Leading Car Tyre Manufacturer</h5>
                                <p>Revamped the website with refined UI/UX, micro-interactions, improved architecture, and smoother navigation.</p>
                            </div>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Cloud Engineering</h4>
                            <a href="cloud.html">Cloud Migration</a>
                            <a href="cloud.html">DevOps</a>
                            <a href="cloud.html">Cybersecurity</a>
                            <a href="cloud.html">24/7 Support &amp; Maintenance</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">Energy</span>
                                <h5>Unlocked huge business growth and seed funding for a Solar Energy Provider</h5>
                                <p>Developed sales management tool with real-time tracking, analytics &amp; collaboration to enhance efficiency.</p>
                            </div>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Data &amp; Analytics</h4>
                            <a href="data-analytics.html">Data Engineering</a>
                            <a href="data-analytics.html">Analytics &amp; Visualization</a>
                            <a href="ai.html">AI &amp; Machine Learning</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">Translation</span>
                                <h5>SaaS Platform Modernization for a NASDAQ listed Law Transcription Firm</h5>
                                <p>Developed AI-driven transcription with real-time diary-ization, boosting accuracy, efficiency, and uptime.</p>
                            </div>
                        </div>
                        <div class="ui-mega-col">
                            <h4>IT Consulting &amp; Advisory</h4>
                            <a href="it-consulting.html">IT Staff Augmentation</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">SaaS</span>
                                <h5>Built an idea into a Multi-million Dollar SaaS Platform with patented tech</h5>
                                <p>Implemented cutting-edge tech, enabling multi-location recording, real-time analytics, dynamic editing, and scalability.</p>
                            </div>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Digital Strategy</h4>
                            <a href="data-analytics.html">Digital Marketing</a>
                            <a href="data-analytics.html">SEO Marketing Services</a>
                            <a href="blog.html">Content Marketing Services</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">Logistics</span>
                                <h5>Website Revamp to boost conversions of a Leading Online Logistics Provider</h5>
                                <p>Redesigned the legacy website with cutting-edge tech, optimizing UI/UX, enhancing conversions, and scalability.</p>
                            </div>
                        </div>
                        <div class="ui-mega-col">
                            <h4>Leading Tech Offerings for</h4>
                            <a href="it-consulting.html">Startup Consulting</a>
                            <a href="it-consulting.html">SMB Consulting</a>
                            <a href="it-consulting.html">Enterprise Consulting</a>
                            <div class="ui-mega-case" style="margin-top:1rem">
                                <span class="tag">Case study</span>
                                <span class="tag">Education &amp; eLearning</span>
                                <h5>Platform Modernization enabled 3x sales growth for a Global Edtech Leader</h5>
                                <p>Implemented cutting-edge tech, optimizing UI/UX, enhancing performance, and integrating scalable solutions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <li data-menu="tech">
                <button type="button" class="ui-nav-link">Technologies <i class="fas fa-chevron-down"></i></button>
                <div class="ui-mega">
                    <div class="ui-mega-grid">
                        <div class="ui-mega-col" style="grid-column:1/-1;max-width:100%">
                            <h4>Technologies</h4>
                            <p>Our expertise spans all major technologies and platforms, and advances to innovative technology trends.</p>
                            <a href="services.html">All Technology Expertise</a>
                            <p style="margin-top:0.75rem"><strong>Recognized by:</strong> 4.6 — Our rating on Clutch</p>
                        </div>
                        <div class="ui-mega-col"><h4>Backend</h4><a href="development.html">Node.js (Express/Nest)</a><a href="development.html">Laravel</a><a href="development.html">Python</a></div>
                        <div class="ui-mega-col"><h4>Frontend</h4><a href="web.html">JavaScript</a><a href="web.html">Angular</a><a href="web.html">ReactJS</a><a href="web.html">Vue.JS</a></div>
                        <div class="ui-mega-col"><h4>Mobile</h4><a href="mobile.html">React Native</a><a href="mobile.html">iOS Native</a><a href="mobile.html">Android Native</a><a href="mobile.html">Flutter</a></div>
                        <div class="ui-mega-col"><h4>Cloud</h4><a href="cloud.html">AWS Cloud</a><a href="cloud.html">Azure</a></div>
                        <div class="ui-mega-col"><h4>CMS</h4><a href="web.html">WordPress</a><a href="web.html">Drupal</a><a href="ecommerce-strategy.html">WooCommerce</a></div>
                        <div class="ui-mega-col"><h4>Database</h4><a href="development.html">MongoDB</a><a href="development.html">MySQL</a></div>
                        <div class="ui-mega-col"><h4>Automation Testing</h4><a href="testing-qa.html">Playwright</a></div>
                    </div>
                </div>
            </li>
            <li><a href="industry.html">Industries</a></li>
            <li><a href="portfolio.html">Case Studies</a></li>
            <li data-menu="resources">
                <button type="button" class="ui-nav-link">Resources <i class="fas fa-chevron-down"></i></button>
                <div class="ui-dropdown">
                    <a href="blog.html">Blogs</a>
                    <a href="resources.html">Infographics</a>
                    <a href="resources.html">Ebooks</a>
                    <a href="product-design.html">UI/UX Gallery</a>
                </div>
            </li>
            <li data-menu="company">
                <button type="button" class="ui-nav-link">Company <i class="fas fa-chevron-down"></i></button>
                <div class="ui-dropdown">
                    <a href="about.html">About</a>
                    <a href="index.html#process">Our Process</a>
                    <a href="services.html">Engagement Models</a>
                    <a href="team.html">Careers</a>
                    <a href="blog.html">Newsroom</a>
                </div>
            </li>
        </ul>

        <div class="ui-header__actions">
            <button type="button" class="ui-btn-icon" id="appSearchOpen" aria-label="Site Search"><i class="fas fa-search"></i></button>
            <a href="contact.html" class="ui-btn-contact">Contact Us</a>
            <button type="button" class="ui-hamburger ui-btn-icon" id="uiHamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
        </div>
    </div>
</header>

<nav class="ui-mobile-nav" id="uiMobileNav" aria-label="Mobile menu">
    <a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="portfolio.html">Case Studies</a>
    <a href="resources.html">Resources</a>
    <a href="industry.html">Industries</a>
    <a href="contact.html">Contact Us</a>
</nav>
`;
    fs.writeFileSync(path.join(PROJECT, 'unified-header.html'), html, 'utf8');
}

function writeFooter() {
    const html = `<footer class="ui-footer ui-footer-unified">
    <div class="ui-container">
        <h3 style="color:#fff;margin-bottom:1.25rem;font-size:1.25rem">Let's Grow Your Brand</h3>
        <div class="ui-footer-grid">
            <div>
                <h4>Core Services</h4>
                <a href="software-engineering.html">Custom Software Development</a>
                <a href="web.html">Website Development</a>
                <a href="mobile.html">Mobile App Development</a>
                <a href="ecommerce-strategy.html">Ecommerce Development</a>
                <a href="data-analytics.html">Data Engineering</a>
            </div>
            <div>
                <h4>Technology</h4>
                <a href="development.html">Backend</a>
                <a href="web.html">Frontend</a>
                <a href="web.html">CMS</a>
                <a href="mobile.html">Mobile</a>
                <a href="cloud.html">Cloud</a>
                <a href="cloud.html">Security</a>
            </div>
            <div>
                <h4>Company</h4>
                <a href="about.html">About</a>
                <a href="portfolio.html">Case Studies</a>
                <a href="blog.html">Blogs</a>
                <a href="team.html">Careers</a>
                <a href="contact.html">Contact</a>
                <a href="index.html">Sitemap</a>
            </div>
            <div class="ui-footer-offices">
                <div><strong>USA</strong>135 Madison Ave, New York, NY 10016<br>+1 201 761 9432</div>
                <div style="margin-top:1rem"><strong>IND</strong>DN 53, Salt Lake, Sector V, Kolkata 700091<br>+91 93309 01942<br>+033 2335 0953</div>
                <div class="ui-footer-mail" style="margin-top:1rem">
                    <h4>Mail us at</h4>
                    <a href="mailto:hello@unifiedinfotech.net">hello@unifiedinfotech.net</a>
                </div>
                <div style="margin-top:1rem"><h4 style="color:#fff;font-size:0.85rem">Get Connected</h4></div>
            </div>
        </div>
    </div>
    <div class="ui-container ui-footer-bottom">
        <span>&copy; 2026 Unified Infotech Inc. All rights reserved.</span>
        <a href="contact.html">Privacy Policy</a>
    </div>
</footer>
`;
    fs.writeFileSync(path.join(PROJECT, 'unified-footer.html'), html, 'utf8');
}

function buildMain() {
    return `
    <!-- HERO -->
    <section class="ui-hero ui-hero--ref">
        <div class="ui-hero__glow" aria-hidden="true"></div>
        <div class="ui-container ui-hero__layout">
            <div class="ui-hero__content">
                <h1><strong>Simply Exceptional Software Engineering.</strong></h1>
                <p class="ui-hero__sub">Proven IT Consulting &amp; Custom Software Development solutions for your complex business challenges, ensuring long-term success.</p>
                <a href="contact.html" class="ui-btn-getstarted">Get Started <i class="fas fa-chevron-right"></i></a>
            </div>
            <div class="ui-hero__coil" aria-hidden="true">
                <img src="assets/images/hero-coil.svg" alt="banner-shape-image1" width="520" height="400">
            </div>
        </div>
        <div class="ui-home-trust-pills ui-container">
            <span><strong>Local</strong> oversight</span>
            <span><strong>Global</strong> expertise</span>
            <span><strong>Flawless</strong> execution</span>
        </div>
    </section>

    <!-- HOME OF ENGINEERS -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container ui-text-center">
            <h2 class="ui-section-title">Home of Dependable Engineers &amp; Analysts.</h2>
            <h3 class="ui-section-title" style="margin-top:1rem;font-size:clamp(1.25rem,3vw,1.75rem)">We <strong>ideate, engineer, and</strong><br><strong>transform digital landscapes</strong> to help your business stay modern, efficient, and agile.</h3>
        </div>
    </section>

    <!-- SERVICE PILLARS -->
    <section class="ui-section">
        <div class="ui-container">
            <div class="ui-home-pillars ui-fade-up">
                <div class="ui-home-pillar">
                    <h4>Software Product Engineering</h4>
                    <ul>
                        <li><a href="web.html">Website Development</a></li>
                        <li><a href="mobile.html">Mobile App Development</a></li>
                        <li><a href="software-engineering.html">Custom Software Development</a></li>
                        <li><a href="application-modernization.html">Application Modernization</a></li>
                        <li><a href="ecommerce-strategy.html">E-commerce Development</a></li>
                        <li><a href="software-engineering.html">Blockchain Development</a></li>
                        <li><a href="software-engineering.html">Enterprise Software Development</a></li>
                        <li><a href="development.html">API &amp; Microservices</a></li>
                        <li><a href="software-engineering.html">Software Project Rescue</a></li>
                        <li><a href="testing-qa.html">Testing &amp; Quality Assurance</a></li>
                    </ul>
                </div>
                <div class="ui-home-pillar">
                    <h4>IT Consulting &amp; Advisory</h4>
                    <ul>
                        <li><a href="it-consulting.html">Product Strategy &amp; Roadmap</a></li>
                        <li><a href="it-consulting.html">Business Technology Consulting</a></li>
                    </ul>
                </div>
                <div class="ui-home-pillar">
                    <h4>Data &amp; Analytics</h4>
                    <ul>
                        <li><a href="data-analytics.html">Data Engineering</a></li>
                        <li><a href="data-analytics.html">Analytics &amp; Visualization</a></li>
                        <li><a href="ai.html">AI &amp; Machine Learning</a></li>
                    </ul>
                </div>
                <div class="ui-home-pillar">
                    <h4>Digital Experience</h4>
                    <ul>
                        <li><a href="product-design.html">User Research</a></li>
                        <li><a href="web.html">Web Design</a></li>
                        <li><a href="product-design.html">UI/UX Design</a></li>
                        <li><a href="product-design.html">UX &amp; Information Architecture</a></li>
                    </ul>
                </div>
                <div class="ui-home-pillar">
                    <h4>Cloud Engineering</h4>
                    <ul>
                        <li><a href="cloud.html">Cloud Migration</a></li>
                        <li><a href="cloud.html">DevOps</a></li>
                        <li><a href="cloud.html">Cybersecurity</a></li>
                        <li><a href="cloud.html">24/7 Support &amp; Maintenance</a></li>
                    </ul>
                </div>
                <div class="ui-home-pillar">
                    <h4>Digital Strategy</h4>
                    <ul>
                        <li><a href="data-analytics.html">Digital Marketing</a></li>
                        <li><a href="data-analytics.html">SEO Marketing Services</a></li>
                        <li><a href="blog.html">Content Marketing Services</a></li>
                    </ul>
                </div>
            </div>
            <div class="ui-text-center" style="margin-top:2rem">
                <h3 class="ui-section-title">Leading Technology Offerings For</h3>
                <div class="ui-home-offerings">
                    <a href="it-consulting.html" class="ui-home-offering">Enterprise Consulting</a>
                    <a href="it-consulting.html" class="ui-home-offering">SMB Consulting</a>
                    <a href="it-consulting.html" class="ui-home-offering">Startup Consulting</a>
                </div>
            </div>
        </div>
    </section>

    <!-- WHO WE ARE -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container ui-who-grid">
            <div class="ui-fade-up">
                <span class="ui-section-tag">Who we are</span>
                <h2 class="ui-section-title"><strong>Engineering digital experiences</strong> with our vision, insight, and experience</h2>
                <p class="ui-section-desc">Founded in 2010, We believe in building a future where People, Process, and Technology, drive lasting change.</p>
                <p class="ui-section-desc">Whatever we do is rooted in customer-centricity. We deliver tailored solutions that enhance your business performance and secure competitive advantages amid disruptions.</p>
                <h4 style="margin:1rem 0 0.5rem;color:#fff">Blending technology with innovation for end-to-end CX</h4>
                <a href="services.html" class="ui-btn-primary">Learn More <i class="fas fa-arrow-right"></i></a>
                <span style="display:block;margin-top:0.35rem;font-size:0.85rem;color:rgba(255,255,255,0.5)">about services</span>
                <div class="ui-stats-row" style="margin-top:1.5rem">
                    <div class="ui-stat-box"><strong>15+</strong><span>Years in Business</span></div>
                    <div class="ui-stat-box"><strong>300+</strong><span>Global Clients</span></div>
                    <div class="ui-stat-box"><strong>250+</strong><span>Tech Experts</span></div>
                </div>
            </div>
            <div class="ui-benefits-grid ui-fade-up">
                <div class="ui-benefit-card"><h4>Agile<br>Approach</h4><p>Improve your digital responsiveness to customer and business demands.</p><p>Our experts deliver high-quality software solutions by leveraging agile methodologies to fast-track business transformation.</p></div>
                <div class="ui-benefit-card"><h4>Reduced Time to Market</h4><p>Gain a competitive edge with our cutting-edge solutions delivered at speed.</p><p>Partner with us to swiftly meet customer demands with our best-in-class software solutions and industry-leading timelines.</p></div>
                <div class="ui-benefit-card"><h4>Technological Excellence</h4><p>Realign your business for growth, and stay ahead of tech trends.</p><p>Leverage our advanced, always-evolving software engineering and IT ecosystem to transform challenges into opportunities.</p></div>
                <div class="ui-benefit-card"><h4>Improved End-user Satisfaction Rates</h4><p>Create meaningful experiences that are built to boost conversions.</p><p>Our client-centricity makes us the best partner for your digital transformation journey, turning skeptics into loyal customers.</p></div>
                <div class="ui-benefit-card"><h4>Top-Tier Security &amp; 24/7 Support</h4><p>Ensure continuity and resilience of your business software solutions.</p><p>Collaborate with us and capitalize on our robust incident prevention, 24/7 support, and quick response capabilities.</p></div>
            </div>
        </div>
    </section>

    <!-- CASE STUDIES -->
    <section class="ui-section" id="case-studies">
        <div class="ui-container">
            <div class="ui-cs-header ui-fade-up">
                <div>
                    <span class="ui-section-tag">#case studies</span>
                    <h2 class="ui-section-title">Navigating complex challenges with digital excellence.</h2>
                </div>
                <a href="portfolio.html" class="ui-btn-outline">Our Success Stories</a>
            </div>
            <div class="ui-cs-slider-wrap ui-fade-up">
                <div class="ui-cs-slider" id="uiCsSlider">
                    <article class="ui-cs-card">
                        <div class="ui-cs-num">CS 01</div>
                        <h3>Platform Modernization enabled 3x sales growth for a Global Edtech Leader</h3>
                        <p>Implemented cutting-edge tech, optimizing UI/UX, enhancing performance, and integrating scalable solutions.</p>
                        <div class="ui-cs-metrics">
                            <div><strong>200%</strong><span>Increase in subscriptions</span></div>
                            <div><strong>300%</strong><span>Increase in revenue</span></div>
                        </div>
                        <a href="case-study.html" class="ui-cs-link">View Case study</a>
                    </article>
                    <article class="ui-cs-card">
                        <div class="ui-cs-num">CS 02</div>
                        <h3>Digital Transformation of a Translation Company, fueling business growth</h3>
                        <p>Developed scalable middleware to enhance efficiency, ensure data security, and optimize UI/UX with advanced analytics.</p>
                        <div class="ui-cs-metrics">
                            <div><strong>3x</strong><span>Improvement in customer satisfaction survey</span></div>
                            <div><strong>35%</strong><span>Reduction in project delivery timelines</span></div>
                        </div>
                        <a href="portfolio.html" class="ui-cs-link">View Case study</a>
                    </article>
                    <article class="ui-cs-card">
                        <div class="ui-cs-num">CS 03</div>
                        <h3>Built an idea into a Multi-million Dollar SaaS Platform with patented tech</h3>
                        <p>Implemented cutting-edge tech, enabling multi-location recording, real-time analytics, dynamic editing, and scalability.</p>
                        <div class="ui-cs-metrics">
                            <div><strong>$25</strong><span>Million+ seed funding</span></div>
                            <div><strong>50+</strong><span>Fortune 500 customers</span></div>
                        </div>
                        <a href="saas-platforms.html" class="ui-cs-link">View Case study</a>
                    </article>
                    <article class="ui-cs-card">
                        <div class="ui-cs-num">CS 04</div>
                        <h3>Increased eCommerce sales by 124% for a Tire and Rim Manufacturer</h3>
                        <p>Implemented advanced search, seamless checkout, AWS migration, and scalable solutions to enhance performance &amp; UX.</p>
                        <div class="ui-cs-metrics">
                            <div><strong>124%</strong><span>Growth in sales</span></div>
                            <div><strong>60%</strong><span>Improvement in cart abandonment rate</span></div>
                        </div>
                        <a href="ecommerce-strategy.html" class="ui-cs-link">View Case study</a>
                    </article>
                </div>
                <div class="ui-cs-nav">
                    <button type="button" id="uiCsPrev" aria-label="Previous"><i class="fas fa-arrow-left"></i></button>
                    <button type="button" id="uiCsNext" aria-label="Next"><i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    </section>

    <!-- TECHNOLOGY -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container ui-text-center">
            <span class="ui-section-tag ui-fade-up">Technologies</span>
            <h2 class="ui-section-title ui-fade-up">Driving Digital Transformation through advanced <strong>Technology Capabilities</strong>.</h2>
            <div class="ui-tech-tabs ui-fade-up">
                <button type="button" class="ui-tech-tab">UI/UX</button>
                <button type="button" class="ui-tech-tab">Frontend</button>
                <button type="button" class="ui-tech-tab">Backend</button>
                <button type="button" class="ui-tech-tab">Mobile</button>
                <button type="button" class="ui-tech-tab">Database</button>
                <button type="button" class="ui-tech-tab">Cloud</button>
                <button type="button" class="ui-tech-tab">DevOps</button>
                <button type="button" class="ui-tech-tab">Monitoring &amp; Logging</button>
                <button type="button" class="ui-tech-tab">Security</button>
                <button type="button" class="ui-tech-tab">CMS</button>
                <button type="button" class="ui-tech-tab">CRM/ERP/Platforms</button>
                <button type="button" class="ui-tech-tab">Collaboration Tools</button>
            </div>
            <div class="ui-tech-panel ui-fade-up"><h4>UI/UX</h4><p>Offering the best in UI/UX designs to ensure high-quality output that enhances your ROI with</p></div>
            <div class="ui-tech-panel"><h4>Frontend</h4><p>Redefine your website frontend with tech stacks that help build smooth user interfaces for seamless user experiences.</p></div>
            <div class="ui-tech-panel"><h4>Backend</h4><p>Choose the best server-facing tech stacks to improve performance and create exceptional business functionalities.</p></div>
            <div class="ui-tech-panel"><h4>Mobile</h4><p>Ensure the responsiveness and design consistency by choosing from the hand-picked selection of mobile tools and technologies we offer</p></div>
            <div class="ui-tech-panel"><h4>Database</h4><p>Rationalize your data migration by selecting a database that offers you the most in functionality and convenience.</p></div>
            <div class="ui-tech-panel"><h4>Cloud</h4><p>Choose wisely from our cloud tech stack to drive the success, scalability, security, and overall impact of your digital product.</p></div>
            <div class="ui-tech-panel"><h4>DevOps</h4><p>DevOps is more than a mindset. It involves a precisely coordinated play of tools and technologies that maximize your digital ROI.</p></div>
            <div class="ui-tech-panel"><h4>Monitoring &amp; Logging</h4><p>Empower your infrastructure with observability solutions for real-time insights and seamless performance.</p></div>
            <div class="ui-tech-panel"><h4>Security</h4><p>Implement comprehensive security measures and data handling compliances to safeguard systems, applications, and data from threats.</p></div>
            <div class="ui-tech-panel"><h4>CMS</h4><p>Content is king. We leverage the latest content management systems to ensure the effectiveness of your website content and elements.</p></div>
            <div class="ui-tech-panel"><h4>CRM/ERP/Platforms</h4><p>Streamline operations and enhance customer relationships with integrated, scalable solutions</p></div>
            <div class="ui-tech-panel"><h4>Collaboration Tools</h4><p>Streaming teamwork through real-time communication and project management to improve workflows, enhance coordination, and drive results.</p></div>
            <div style="margin-top:2rem"><a href="services.html" class="ui-btn-outline">Our Technologies Library</a></div>
        </div>
    </section>

    <!-- CLIENT STORIES -->
    <section class="ui-section">
        <div class="ui-container">
            <div class="ui-text-center" style="margin-bottom:2rem">
                <span class="ui-section-tag">Client Stories</span>
                <h2 class="ui-section-title">What our <strong>clients</strong> say about us.</h2>
            </div>
            <div class="ui-client-logos ui-fade-up">
                <span>mcgrawhill</span><span>nbcu-white</span><span>UNITED NATIONS</span><span>CITI</span><span>cqfluency</span><span>eshipper</span><span>Bluesky-LOGO</span><span>Jhonson lambert</span><span>SG analytics</span>
            </div>
            <div class="ui-testimonial-names ui-fade-up">
                <div class="ui-testimonial-name"><strong>Dan Milczarski</strong><span>Chief Technology Officer</span></div>
                <div class="ui-testimonial-name"><strong>Mark Weithorn</strong><span>CEO and Founder</span></div>
                <div class="ui-testimonial-name"><strong>Shane Rogers</strong><span>CEO and Founder</span></div>
                <div class="ui-testimonial-name"><strong>Jeramey Ricks</strong><span>Chief Executive Officer</span></div>
                <div class="ui-testimonial-name"><strong>Gustavo Lima</strong><span>Founder</span></div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="ui-cta-band">
        <div class="ui-container">
            <h2>Ready to <strong>Embrace</strong><br><strong>Digital Change?</strong></h2>
            <p>Let's guide you through a seamless transformation process</p>
            <a href="contact.html" class="ui-btn-primary">Talk To Our Experts</a>
            <div class="ui-cta-stats">
                <div><strong>15+</strong><span>Years in Service</span></div>
                <div><strong>300+</strong><span>Global Clients</span></div>
                <div><strong>250+</strong><span>Tech Experts</span></div>
            </div>
        </div>
    </section>

    <!-- PROCESS -->
    <section class="ui-section" id="process">
        <div class="ui-container ui-text-center">
            <span class="ui-section-tag">Our<br>Process</span>
            <h2 class="ui-section-title">Maximizing software engineering output with our people-focused <strong>Processes</strong>.</h2>
            <div class="ui-process-grid" style="margin-top:2.5rem;text-align:left">
                <div class="ui-process-card ui-fade-up"><div class="step">p01</div><h4>Discovery Workshop</h4><p>Outpace your competition with our experienced software experts, who drive business value by collaborating with you through our discovery workshops.</p><p>Together, we explore new ideas, experiment with cutting-edge technologies, and co-create innovative solutions tailored to your business.</p></div>
                <div class="ui-process-card ui-fade-up"><div class="step">p02</div><h4>Predictive Planning</h4><p>Assess scenario impacts and take correctives to mitigate them. Coordinate a cohesive response for every situation.</p><p>Our expert developers champion predictive and meticulous planning throughout the custom software development life cycle.</p></div>
                <div class="ui-process-card ui-fade-up"><div class="step">p03</div><h4>IA &amp; UX/UI Design</h4><p>Convert design ideas into tangible prototypes through visual storytelling, precise information architecture, and interactive UX.</p><p>We prioritize having a well-defined IA as a crucial element of UI/UX. By organizing information in its proper hierarchy, we assist our clients in ensuring steady engagement and conversion rates.</p></div>
                <div class="ui-process-card ui-fade-up"><div class="step">p04</div><h4>Development</h4><p>Solve complex digital challenges with ease using creative yet pragmatic innovations with our enterprise software development team of design architects, developers, engineers, and testers.</p><p>They relentlessly work to upgrade your software solutions with access to premier technologies.</p></div>
                <div class="ui-process-card ui-fade-up"><div class="step">p05</div><h4>Testing</h4><p>Convert your software into your competitive differentiator with our technology-led, compliance-driven testing practices.</p><p>By adopting an analytics-driven smart testing and QA approach, we elevate software quality several notches to offer secure and reliable user experiences.</p></div>
                <div class="ui-process-card ui-fade-up"><div class="step">p06</div><h4>Maintenance</h4><p>Enhance your business productivity by mitigating downtime to enable quick realization of your digital ROI.</p><p>Consult with our software maintenance experts to ensure 100% runtime efficiency, security and stability, high performance and extensive feature customization.</p></div>
            </div>
            <p class="ui-process-note">** We usually tailor our process based on the project requirements and our process—while following the underlying principles—may vary slightly, based on the combination of services we provide.</p>
            <a href="about.html" class="ui-btn-outline" style="margin-top:1rem">Our Process Details</a>
        </div>
    </section>

    <!-- INDUSTRIES -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container ui-text-center">
            <span class="ui-section-tag">Industries</span>
            <h2 class="ui-section-title">A Unified Vision That Caters to Diverse<br><strong>Industry</strong> Demands.</h2>
            <div class="ui-industry-tabs ui-fade-up">
                <button type="button" class="ui-industry-tab">Education</button>
                <button type="button" class="ui-industry-tab">Healthcare</button>
                <button type="button" class="ui-industry-tab">Real Estate</button>
                <button type="button" class="ui-industry-tab">Finance</button>
                <button type="button" class="ui-industry-tab">Media &amp; Entertainment</button>
                <button type="button" class="ui-industry-tab">Travel</button>
                <button type="button" class="ui-industry-tab">Automotive</button>
                <button type="button" class="ui-industry-tab">E-Commerce</button>
                <button type="button" class="ui-industry-tab">Insurance</button>
                <button type="button" class="ui-industry-tab">SaaS</button>
                <button type="button" class="ui-industry-tab">Translation</button>
            </div>
            <div class="ui-industry-panel ui-fade-up"><h3>Education</h3><p>In the evolving education industry, we navigate challenges with a digital-first mindset, bridging learning gaps and meeting shifting expectations. Our eLearning software development leverages advanced technology and student data analytics to create intuitive, interactive, and personalized learning experiences.</p><em>Because learning happens everywhere</em></div>
            <div class="ui-industry-panel"><h3>Healthcare</h3><p>In the healthcare industry, we personalize processes with seamless access and engaging user journeys for better patient care. Our IT services enhance efficiency, streamline workflows, and enable predictive, preventive solutions—reducing custom software development costs while optimizing clinician performance.</p><em>Because wellness starts with care</em></div>
            <div class="ui-industry-panel"><h3>Real Estate</h3><p>We empower the construction and real estate industry with innovative digital solutions tailored to its needs. Our robust tools optimize efficiency, track project progress, ensure precise resource allocation, streamline task management, and enhance communication among all stakeholders for seamless operations.</p><em>Because home is where life begins</em></div>
            <div class="ui-industry-panel"><h3>Finance</h3><p>We specialize in fintech software development, helping financial institutions drive innovation, enhance security, and deliver seamless experiences. Using advanced technology, data analytics, and compliance-focused solutions, we optimize market efficiency. Explore how our custom software development fuels industry growth and resilience.</p><em>Because every dollar counts</em></div>
            <div class="ui-industry-panel"><h3>Media &amp; Entertainment</h3><p>Unified Infotech transforms the media &amp; entertainment industry with custom solutions that enhance audience engagement and deliver seamless experiences. By adopting the DevOps methodology, we accelerate time to market, drive growth, and implement cutting-edge technology to meet evolving demands.</p><em>Because stories shape perspectives</em></div>
            <div class="ui-industry-panel"><h3>Travel</h3><p>We transform the travel and hospitality industry by integrating people, processes, and technology to deliver seamless, high-performing solutions. Our expertise in eCommerce, custom software, mobile app development, and web design empowers businesses to stay competitive and enhance the customer experience.</p><em>Because every journey tells a story</em></div>
            <div class="ui-industry-panel"><h3>Automotive</h3><p>Drive the future of the automotive industry by embracing the mobility ecosystem and cross-industry collaboration. Our software-defined, intelligent, and secure solutions create digitally connected experiences with user safety at the core. Leverage our web and custom software development to stay ahead.</p><em>Because every mile matters</em></div>
            <div class="ui-industry-panel"><h3>E-Commerce</h3><p>Unified Infotech is redefining digital retail by helping businesses adapt to evolving customer needs. Our ecommerce website development creates seamless, immersive experiences that drive conversions, enhance loyalty, and build a transparent, collaborative ecosystem from concept to delivery.</p><em>Because shopping should be seamless</em></div>
            <div class="ui-industry-panel"><h3>Insurance</h3><p>In the insurance industry, we address complex customer protection needs by digitizing, connecting, and personalizing services. Our expertise enables tailored solutions, automates tasks, and enhances claims and underwriting processes. Using cutting-edge technology, we transform operations and deliver compelling products.</p><em>Because peace of mind is priceless</em></div>
            <div class="ui-industry-panel"><h3>SaaS</h3><p>We empower industries with B2B SaaS solutions, setting new performance standards through digital innovation. By leveraging SaaS and digital platforms, we help businesses streamline workflows, enhance CX, and drive efficiency. Explore how our custom software development fuels growth and resilience.</p><em>Because solutions drive success</em></div>
            <div class="ui-industry-panel"><h3>Translation</h3><p>We empower businesses in the speech and translation tech industry with culture-sensitive, transformative solutions. Our fast, efficient services break communication barriers, enabling global expansion. With human ingenuity and technical expertise, we help clients navigate cultural complexities and drive growth.</p><em>Because words bridge cultures</em></div>
            <div style="margin-top:2rem"><a href="industry.html" class="ui-btn-outline">Our Industry Expertise</a></div>
        </div>
    </section>

    <!-- RESOURCES -->
    <section class="ui-section">
        <div class="ui-container">
            <div class="ui-text-center" style="margin-bottom:2.5rem">
                <span class="ui-section-tag">Resources</span>
                <h2 class="ui-section-title">Explore our curated digital resources to maximize your business growth</h2>
            </div>
            <div class="ui-resources-grid">
                <article class="ui-resource-card ui-fade-up">
                    <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/web-dev.jpg" alt="WordPress vs Drupal – The Definitive Ebook" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                    <div class="body"><span class="type">Ebook</span><h4>WordPress vs. Drupal - The Definitive Ebook</h4><div class="meta-list"><span>Web Development</span><span>CMS Development</span></div><div class="author">Santanu Mandal · Oct 15th, 2025 · 25 minutes read</div><a href="resources.html">Download now</a></div>
                </article>
                <article class="ui-resource-card ui-fade-up">
                    <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/seo-new.jpg" alt="Zero to Hero With a Website Revamp in 2025" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                    <div class="body"><span class="type">Ebook</span><h4>Zero to Hero With A Website Revamp in 2025</h4><div class="meta-list"><span>Web Development</span><span>Web Design</span></div><div class="author">Samrat Biswas · Oct 15th, 2025 · 20 minutes read</div><a href="resources.html">Download now</a></div>
                </article>
                <article class="ui-resource-card ui-fade-up">
                    <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/ppc.jpg" alt="Low Code Vs No Code Vs Pro Code" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                    <div class="body"><span class="type">Ebook</span><h4>Low-Code vs No-Code vs Pro-Code - Choosing the best Platform for 2025</h4><div class="meta-list"><span>Web Development</span></div><div class="author">Saptarshi Halder · Oct 15th, 2025 · 25 minutes read</div><a href="resources.html">Download now</a></div>
                </article>
                <article class="ui-resource-card ui-fade-up">
                    <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/social-media-new.jpg" alt="Unlock 3X ROI with Website Personalization Strategies" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                    <div class="body"><span class="type">Ebook</span><h4>Unlock 3X ROI with Website Personalization Strategies</h4><div class="meta-list"><span>Website Personalization</span></div><div class="author">Samrat Biswas · Oct 15th, 2025 · 25 minutes read</div><a href="resources.html">Download now</a></div>
                </article>
                <article class="ui-resource-card ui-fade-up">
                    <div class="thumb" style="padding:0;overflow:hidden"><img src="assets/images/neoxweb/portfolio-branding.jpg" alt="Offshoring vs Nearshoring vs Onshoring" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>
                    <div class="body"><span class="type">Infographic</span><h4>Offshoring vs. Nearshoring vs. Onshoring – Which Outsourcing Model is Right for Your Business?</h4><div class="meta-list"><span>Staff Augmentation</span></div><div class="author">Paulami Bagchi · May 30th, 2025 · 7 minutes read</div><a href="resources.html">Download now</a></div>
                </article>
            </div>
            <div class="ui-text-center" style="margin-top:2rem"><a href="resources.html" class="ui-btn-primary">Explore Our Resources</a></div>
        </div>
    </section>

    <!-- PRESS -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container">
            <div class="ui-text-center" style="margin-bottom:2rem">
                <span class="ui-section-tag">Press<br>Releases</span>
                <h2 class="ui-section-title">Select stories on Unified Infotech's achievements and events</h2>
            </div>
            <div class="ui-press-grid ui-fade-up">
                <article class="ui-press-card">
                    <span class="tag">Unified Communications</span>
                    <h4>Unified Infotech Presents the State of AI Adoption at the 2026 Spring NYC Small Business Expo</h4>
                </article>
                <article class="ui-press-card">
                    <span class="tag">Unified Communications</span>
                    <h4>Unified Infotech Strengthens Global AI and Startup Partnerships at GITEX Global and Expand North Star 2025</h4>
                    <a href="blog.html">Read More about Unified Infotech Strengthens Global AI and Startup Partnerships at GITEX Global and Expand North Star 2025</a>
                </article>
                <article class="ui-press-card">
                    <span class="tag">Unified Communications</span>
                    <h4>Unified Infotech Is Now Great Place To Work Certified</h4>
                    <a href="blog.html">Read More about Unified Infotech Is Now Great Place To Work Certified</a>
                </article>
            </div>
        </div>
    </section>

    <!-- CONTACT -->
    <section class="ui-section ui-contact-section" id="contact">
        <div class="ui-container">
            <div class="ui-contact-grid">
                <div class="ui-fade-up">
                    <span class="ui-section-tag">Contact</span>
                    <h2 class="ui-section-title">Get in touch with our <strong>Digital Experts</strong></h2>
                    <p class="ui-section-desc">Exploring career opportunities? Click Career with Unified in the next section.</p>
                </div>
                <form class="ui-form ui-fade-up" id="uiContactForm">
                    <div class="ui-field"><label for="cName">Name*</label><input id="cName" name="name" required></div>
                    <div class="ui-field"><label for="cEmail">Email*</label><input id="cEmail" name="email" type="email" required></div>
                    <div class="ui-field"><label for="cCompany">Company Name</label><input id="cCompany" name="company"></div>
                    <div class="ui-field"><label for="cPhone">Phone Number*</label><input id="cPhone" name="phone" required></div>
                    <div class="ui-field"><label for="cMessage">Message*</label><textarea id="cMessage" name="message" required maxlength="750"></textarea><div class="ui-char-count" id="uiCharCount">0/750 characters</div></div>
                    <div class="ui-form-upload">
                        <p>Drag and drop or browse to upload your file(s)</p>
                        <p>Maximum file size is 15MB, up to 4 files</p>
                        <p><strong>Supported formats:</strong> doc, docx, ppt, jpeg, jpg, png, pdf</p>
                        <input type="file" multiple accept=".doc,.docx,.ppt,.jpeg,.jpg,.png,.pdf" aria-label="Upload files">
                    </div>
                    <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;margin:0.75rem 0"><input type="checkbox" name="newsletter"> Tick to receive a newsletter by email.</label>
                    <p style="font-size:0.78rem;color:rgba(255,255,255,0.55);margin-bottom:1rem">By clicking the "submit" button, you are agreeing to Unified Infotech Read our full Terms of Use and Privacy Policy</p>
                    <div class="ui-form-captcha">
                        <span>Please answer this to continue 4+2=</span>
                        <input type="text" id="uiCaptcha" name="captcha" required aria-label="Captcha answer">
                    </div>
                    <button type="submit" class="ui-btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </section>

    <!-- CAREERS -->
    <section class="ui-section ui-section--soft">
        <div class="ui-container">
            <div class="ui-careers-band ui-fade-up">
                <span class="ui-section-tag">Work with us</span>
                <h3>Join Our Diverse Team</h3>
                <p>Join our team of seasoned IT professionals and acquire curated digital expertise</p>
                <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1.25rem">
                    <a href="team.html" class="ui-btn-primary">Career with Unified</a>
                    <a href="team.html" class="ui-btn-outline">View Open Roles</a>
                </div>
                <p style="margin-top:0.75rem;font-size:0.85rem;color:rgba(255,255,255,0.5)">Browse on</p>
            </div>
        </div>
    </section>
`;
}

function writeIndex() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="theme-color" content="#050508">
    <title>Unified Infotech: Global Digital Transformation Partner</title>
    <meta name="description" content="Simply Exceptional Software Engineering. Proven IT Consulting &amp; Custom Software Development solutions for your complex business challenges, ensuring long-term success.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="css/unified-theme.css">
    <link rel="stylesheet" href="css/unified-app.css">
    <link rel="stylesheet" href="css/unified-pro.css">
    <link rel="stylesheet" href="css/unified-dark.css">
    <link rel="stylesheet" href="css/unified-pages.css">
    <link rel="stylesheet" href="css/unified-home-full.css">
    <link rel="stylesheet" href="css/dock-pages.css">
    <script defer src="js/config.js"></script>
    <script defer src="js/api.js"></script>
</head>
<body class="unified-site unified-app ui-ref-theme has-dock" data-ui-nav="index.html">

<div id="ui-header-slot"></div>

<main id="app-main">
${buildMain()}
</main>

<div id="ui-footer-slot"></div>

<nav class="ui-bottom-nav" aria-label="Quick navigation">
    <a href="index.html" class="ui-bottom-nav__fab" aria-label="Home"><i class="fas fa-link"></i></a>
    <a href="portfolio.html"><i class="fas fa-book-open"></i> Case Studies</a>
    <a href="resources.html"><i class="fas fa-file-alt"></i> Resources</a>
    <a href="industry.html"><i class="fas fa-industry"></i> Industry</a>
    <a href="contact.html"><i class="fas fa-pen"></i> Enquiry</a>
</nav>
<button type="button" class="ui-chat-fab" id="uiChatFab" aria-label="Open chat"><i class="fas fa-comment-dots"></i></button>

<script defer src="js/unified-home.js"></script>
<script defer src="js/unified-app.js"></script>
<script defer src="js/unified-layout.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(PROJECT, 'index.html'), html, 'utf8');
}

writeHeader();
writeFooter();
writeIndex();
console.log('Built: unified-header.html, unified-footer.html, index.html');
