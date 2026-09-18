import os
try:
    import docx
except ImportError:
    print("Installing python-docx...")
    os.system("pip install python-docx")
    import docx

from docx import Document
from docx.shared import Twips, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# Measurements extracted from CV (2).docx (twips; 20 twips = 1 pt, 1440 = 1 in)
PAGE_W = 11906          # A4 width
PAGE_H = 16838          # A4 height
MARGIN = 864            # 0.6 in
CONTENT_RIGHT_TAB = 10181
DEFAULT_TAB = 720
BODY_SIZE = Pt(11)      # Normal / inherited (sz 22)
NAME_SIZE = Pt(24)      # sz 48
SECTION_SIZE = Pt(12)   # sz 24
SKILL_SIZE = Pt(10)     # sz 20
BULLET_SIZE = Pt(10)    # sz 20
TECH_SIZE = Pt(10)      # sz 20
LINK_COLOR = "0046B4"
FONT_NAME = "Times New Roman"


# ── XML Styling Helpers ───────────────────────────────────────────────────────

def set_rfonts(rPr, name=FONT_NAME):
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    rFonts.set(qn("w:ascii"), name)
    rFonts.set(qn("w:hAnsi"), name)
    rFonts.set(qn("w:eastAsia"), name)
    rFonts.set(qn("w:cs"), name)


def style_run(run, *, size=None, bold=None, italic=None, font=FONT_NAME):
    """Apply Times New Roman and optional size/weight. Omit size to inherit 11pt."""
    run.font.name = font
    rPr = run._element.get_or_add_rPr()
    set_rfonts(rPr, font)
    if size is not None:
        run.font.size = size
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic
    return run


def add_tab(paragraph):
    run = paragraph.add_run()
    run._r.append(OxmlElement("w:tab"))
    return run


def set_spacing(paragraph, *, before=0, after=0, line=240, line_rule="auto"):
    """Set w:spacing in twips to match the reference XML exactly."""
    pPr = paragraph._p.get_or_add_pPr()
    spacing = pPr.find(qn("w:spacing"))
    if spacing is None:
        spacing = OxmlElement("w:spacing")
        pPr.append(spacing)
    spacing.set(qn("w:before"), str(before))
    spacing.set(qn("w:after"), str(after))
    if line is not None:
        spacing.set(qn("w:line"), str(line))
        spacing.set(qn("w:lineRule"), line_rule)
    else:
        if qn("w:line") in spacing.attrib:
            del spacing.attrib[qn("w:line")]
        if qn("w:lineRule") in spacing.attrib:
            del spacing.attrib[qn("w:lineRule")]


def set_indent(paragraph, *, start=None, hanging=None):
    pPr = paragraph._p.get_or_add_pPr()
    ind = pPr.find(qn("w:ind"))
    if ind is None:
        ind = OxmlElement("w:ind")
        pPr.append(ind)
    if start is not None:
        ind.set(qn("w:start"), str(start))
    if hanging is not None:
        ind.set(qn("w:hanging"), str(hanging))


def set_right_tabs(paragraph):
    """Clear the default 0.5in tab and place a right tab at the content edge."""
    pPr = paragraph._p.get_or_add_pPr()
    existing = pPr.find(qn("w:tabs"))
    if existing is not None:
        pPr.remove(existing)
    tabs = OxmlElement("w:tabs")
    clear = OxmlElement("w:tab")
    clear.set(qn("w:val"), "clear")
    clear.set(qn("w:pos"), str(DEFAULT_TAB))
    right = OxmlElement("w:tab")
    right.set(qn("w:val"), "right")
    right.set(qn("w:pos"), str(CONTENT_RIGHT_TAB))
    right.set(qn("w:leader"), "none")
    tabs.append(clear)
    tabs.append(right)
    pPr.append(tabs)


def add_hyperlink(paragraph, text, url):
    """Clickable hyperlink: inherit 11pt TNR, #0046B4, single underline."""
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), r_id)

    new_run = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")

    r_style = OxmlElement("w:rStyle")
    r_style.set(qn("w:val"), "Style")
    rPr.append(r_style)

    c = OxmlElement("w:color")
    c.set(qn("w:val"), LINK_COLOR)
    rPr.append(c)

    u = OxmlElement("w:u")
    u.set(qn("w:val"), "single")
    rPr.append(u)

    new_run.append(rPr)
    t = OxmlElement("w:t")
    t.text = text
    new_run.append(t)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)


def add_bottom_border(paragraph):
    """Section-title rule: single, 0.75pt (sz 6), space 1, black."""
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "000000")
    pBdr.append(bottom)
    pPr.append(pBdr)


def set_keep_with_next(paragraph):
    pPr = paragraph._p.get_or_add_pPr()
    existing = pPr.find(qn("w:keepNext"))
    if existing is not None:
        pPr.remove(existing)
    kn = OxmlElement("w:keepNext")
    kn.set(qn("w:val"), "true")
    pPr.append(kn)


def set_document_defaults(doc):
    """Match CV (2).docx Normal + docDefaults: TNR 11pt, single spacing, no extra gap."""
    normal = doc.styles["Normal"]
    normal.font.name = FONT_NAME
    normal.font.size = BODY_SIZE
    rPr = normal.element.get_or_add_rPr()
    set_rfonts(rPr)
    color = rPr.find(qn("w:color"))
    if color is None:
        color = OxmlElement("w:color")
        rPr.append(color)
    color.set(qn("w:val"), "auto")

    pf = normal.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    pf.line_spacing = 1.0

    # Document-level run defaults
    styles_el = doc.styles.element
    doc_defaults = styles_el.find(qn("w:docDefaults"))
    if doc_defaults is None:
        doc_defaults = OxmlElement("w:docDefaults")
        styles_el.insert(0, doc_defaults)
    rPrDefault = doc_defaults.find(qn("w:rPrDefault"))
    if rPrDefault is None:
        rPrDefault = OxmlElement("w:rPrDefault")
        doc_defaults.append(rPrDefault)
    def_rPr = rPrDefault.find(qn("w:rPr"))
    if def_rPr is None:
        def_rPr = OxmlElement("w:rPr")
        rPrDefault.append(def_rPr)
    set_rfonts(def_rPr)
    for tag, val in (("w:sz", "22"), ("w:szCs", "22")):
        el = def_rPr.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            def_rPr.append(el)
        el.set(qn("w:val"), val)

    # Default tab stop 720 twips (0.5 in), as in the reference
    settings = doc.settings.element
    dts = settings.find(qn("w:defaultTabStop"))
    if dts is None:
        dts = OxmlElement("w:defaultTabStop")
        settings.append(dts)
    dts.set(qn("w:val"), str(DEFAULT_TAB))


# ── Layout Elements ───────────────────────────────────────────────────────────

def add_section_header(doc, title):
    p = doc.add_paragraph()
    set_keep_with_next(p)
    add_bottom_border(p)
    set_spacing(p, before=280, after=80, line=240)
    run = p.add_run(title.upper())
    style_run(run, size=SECTION_SIZE, bold=True)
    return p


def add_bullet(doc, text):
    """Manual hanging bullet: start 360, hanging 216, after 40, 10pt, • + tab + text."""
    p = doc.add_paragraph()
    set_spacing(p, before=0, after=40, line=240)
    set_indent(p, start=360, hanging=216)

    run = p.add_run()
    style_run(run, size=BULLET_SIZE)
    t_bullet = OxmlElement("w:t")
    t_bullet.text = "•"
    run._r.append(t_bullet)
    run._r.append(OxmlElement("w:tab"))
    t_text = OxmlElement("w:t")
    t_text.text = text
    run._r.append(t_text)
    return p


def add_experience_header(doc, company, dates, role, location, first=False):
    # Company (Bold 11pt) ... Dates (Bold 11pt, right-aligned)
    # First entry after the section heading has before=0; later entries keep 240.
    p1 = doc.add_paragraph()
    set_keep_with_next(p1)
    set_right_tabs(p1)
    set_spacing(p1, before=0 if first else 240, after=0, line=240)
    set_indent(p1, start=0)
    style_run(p1.add_run(company), bold=True)
    add_tab(p1)
    style_run(p1.add_run(dates), bold=True)

    # Role (Italic 11pt) ... Location (Regular 11pt, right-aligned)
    p2 = doc.add_paragraph()
    set_keep_with_next(p2)
    set_right_tabs(p2)
    set_spacing(p2, before=0, after=80, line=240)
    set_indent(p2, start=0)
    style_run(p2.add_run(role), italic=True)
    add_tab(p2)
    style_run(p2.add_run(location))
    return p1, p2


def add_project_header(doc, title, links, tech, first=False):
    # Title (Bold 11pt) ... Links (11pt, right-aligned).
    # First project after the section heading has before=0; later ones keep 280.
    p1 = doc.add_paragraph()
    set_keep_with_next(p1)
    set_right_tabs(p1)
    set_spacing(p1, before=0 if first else 280, after=0, line=240)
    set_indent(p1, start=0)
    style_run(p1.add_run(title), bold=True)
    add_tab(p1)
    for i, (name, url) in enumerate(links):
        if i > 0:
            style_run(p1.add_run(" | "))
        add_hyperlink(p1, name, url)

    # Tech stack (Italic 10pt)
    p2 = doc.add_paragraph()
    set_keep_with_next(p2)
    set_spacing(p2, before=0, after=80, line=240)
    set_indent(p2, start=0)
    style_run(p2.add_run(tech), size=TECH_SIZE, italic=True)
    return p1, p2


def add_cert_bullet(doc, name, url):
    """Certification row: hanging bullet (11pt inherited) + hyperlink."""
    p = doc.add_paragraph()
    set_spacing(p, before=0, after=40, line=240)
    set_indent(p, start=360, hanging=216)
    run = p.add_run()
    t_bullet = OxmlElement("w:t")
    t_bullet.text = "•"
    run._r.append(t_bullet)
    run._r.append(OxmlElement("w:tab"))
    add_hyperlink(p, name, url)
    return p


# ── Document Builder ──────────────────────────────────────────────────────────

def build_docx():
    doc = Document()
    set_document_defaults(doc)

    # A4 11906 x 16838 twips, 864-twip (0.6 in) margins — from CV (2).docx sectPr
    section = doc.sections[0]
    section.page_width = Twips(PAGE_W)
    section.page_height = Twips(PAGE_H)
    section.top_margin = Twips(MARGIN)
    section.bottom_margin = Twips(MARGIN)
    section.left_margin = Twips(MARGIN)
    section.right_margin = Twips(MARGIN)
    section.header_distance = Twips(0)
    section.footer_distance = Twips(0)

    # ── Header ────────────────────────────────────────────────────────────────
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_spacing(p_name, before=0, after=40, line=None)
    style_run(p_name.add_run("Jayesh Patel"), size=NAME_SIZE, bold=True)

    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_spacing(p_contact, before=0, after=120, line=None)
    style_run(p_contact.add_run("+91 8347205513  |  "))
    add_hyperlink(p_contact, "jayeshmepani777@gmail.com", "mailto:jayeshmepani777@gmail.com")
    style_run(p_contact.add_run("  |  "))
    add_hyperlink(p_contact, "linkedin.com/in/jayeshmepani", "https://linkedin.com/in/jayeshmepani/")
    style_run(p_contact.add_run("  |  "))
    add_hyperlink(p_contact, "github.com/jayeshmepani", "https://github.com/jayeshmepani/")

    # ── Professional Summary ──────────────────────────────────────────────────
    add_section_header(doc, "Professional Summary")
    p_sum = doc.add_paragraph()
    set_spacing(p_sum, before=0, after=120, line=240)
    set_indent(p_sum, start=0)
    style_run(p_sum.add_run(
        "Full-stack developer and Computer Science graduate with hands-on experience in web development, "
        "mobile development and data science. Proven track record building high-precision computation engines "
        "and open-source libraries published on Packagist and PyPI. Adept at delivering clean, maintainable "
        "code and integrating AI APIs into production systems."
    ))

    # ── Technical Skills ──────────────────────────────────────────────────────
    add_section_header(doc, "Technical Skills")
    skills_data = [
        ("Languages", "Python, PHP, JavaScript, Java, Go, C, C++, Dart"),
        ("Frontend", "React, Next.js, Vue.js, AngularJS, Tailwind CSS, Bootstrap, SCSS, WebGL, HTML, CSS"),
        ("Backend", "Laravel, Node.js, Express.js, FastAPI, Flask, Django, JWT"),
        ("Databases", "MySQL, PostgreSQL, SQLite, MongoDB"),
        ("Mobile", "Flutter, Android (WebView/Java)"),
        ("DevOps & Tools", "Git, GitHub, GitLab, Nginx, Postman, Vite, VS Code, Linux, PowerShell"),
        ("AI/ML & Data Science", "PyTorch, TensorFlow, Keras, OpenCV, scikit-learn, Pandas, HuggingFace, NLP"),
        ("AI Media & Generative", "Stable Diffusion, GFPGAN, RealESRGAN, CodeFormer, UVR"),
        ("Design & Creative", "Figma, Adobe Creative Cloud, Canva"),
        ("Other", "FFI, ctypes, REST API design, SQLAlchemy, Alembic, AI API integration"),
    ]
    for cat, val in skills_data:
        p = doc.add_paragraph()
        set_spacing(p, before=0, after=20, line=240)
        set_indent(p, start=0)
        style_run(p.add_run(f"{cat}: "), size=SKILL_SIZE, bold=True)
        style_run(p.add_run(val), size=SKILL_SIZE)

    # ── Work Experience ───────────────────────────────────────────────────────
    add_section_header(doc, "Work Experience")

    add_experience_header(doc, "Shreesoftech", "Dec 2024 – Present", "Laravel Developer", "Hybrid", first=True)

    add_experience_header(doc, "WRTeam", "May 2024 – June 2024", "PHP Developer Intern", "Remote")
    add_bullet(doc, "Engineered and maintained a PHP web application, improving codebase efficiency by 50%+ through dynamic fetching optimizations that significantly reduced file count and code volume.")
    add_bullet(doc, "Collaborated on integrating front-end and back-end systems, accelerating delivery timelines.")

    add_experience_header(doc, "CodSoft", "Jun 2024 – Jul 2024", "Flutter Developer Intern", "Remote")
    add_bullet(doc, "Built 4 cross-platform Flutter applications covering diverse domains, enhancing user engagement through polished UI and smooth navigation.")
    add_bullet(doc, "Conducted code reviews and optimized app performance across Android and iOS targets.")

    add_experience_header(doc, "CodSoft", "May 2024 – Jun 2024", "Python Programming Intern", "Remote")
    add_bullet(doc, "Developed 5 Python applications spanning user management, game logic, security, arithmetic, and task management, implementing 3 new features that improved robustness by 30%.")

    add_experience_header(doc, "CodSoft", "May 2024 – Jun 2024", "Data Science Intern", "Remote")
    add_bullet(doc, "Analyzed 5 datasets and produced 55 visualizations using Pandas, Matplotlib, and Seaborn to surface actionable insights.")
    add_bullet(doc, "Trained and evaluated predictive ML models achieving 85%+ accuracy.")

    # ── Projects ──────────────────────────────────────────────────────────────
    add_section_header(doc, "Projects")

    add_project_header(
        doc,
        "Panchang Core",
        [("GitHub", "https://github.com/jayeshmepani/panchang-core")],
        "PHP, FFI, JME Ephemeris",
        first=True,
    )
    add_bullet(doc, "Architected a high-precision Hindu calendar engine using a JME Ephemeris FFI bridge and IEEE 754 doubles to compute Tithi, Nakṣatra, Yoga, Karaṇa, and 30 Muhūrtas with 0.001 arcsecond accuracy.")
    add_bullet(doc, "Implemented KalaNirnaya logic orchestrating 323 unique festivals and 85 unique vrat identities across Amanta/Purnimanta calendars with English, Hindi, and Gujarati output.")
    add_bullet(doc, "Designed a framework-agnostic architecture deployable as a standalone CLI or as a Laravel package via native Facades and Service Providers.")

    add_project_header(
        doc,
        "JME Ephemeris Engine",
        [("GitHub", "https://github.com/jayeshmepani/jpl-ephemeris")],
        "C, Astronomy, JPL, CALCEPH",
    )
    add_bullet(doc, "Developed an independent MIT-licensed ephemeris engine with 204 public functions and 462 constants.")
    add_bullet(doc, "Implemented multiple computation backends including JPL/CALCEPH, Moshier, VSOP87, ELP2000, and Meeus.")
    add_bullet(doc, "Designed strict engine-selection architecture supporting JPL, MOSHIER, VSOP_ELP_MEEUS, and AUTO modes.")
    add_bullet(doc, "Built the native foundation powering PHP, Python, and Dart language ecosystems.")

    add_project_header(
        doc,
        "JME Cross-Language SDK Ecosystem",
        [
            ("GitHub (PHP)", "https://github.com/jayeshmepani/jpl-moshier-ephemeris-php"),
            ("GitHub (Python)", "https://github.com/jayeshmepani/jpl-moshier-ephemeris-python"),
            ("GitHub (Dart)", "https://github.com/jayeshmepani/jpl-moshier-ephemeris-dart"),
        ],
        "PHP, Python, Dart, C",
    )
    add_bullet(doc, "Published native bindings and packaged runtimes across PHP, Python, and Flutter/Dart.")
    add_bullet(doc, "Delivered consistent access to the same C API across multiple programming languages and operating systems.")
    add_bullet(doc, "Eliminated manual compilation by distributing platform-specific binaries for end users.")

    add_project_header(
        doc,
        "Hindu Scriptures",
        [
            ("GitHub", "https://github.com/jayeshmepani/HinduScriptures/"),
            ("Live demo", "https://hinduscriptures.onrender.com/"),
        ],
        "Node.js, Express.js, JavaScript, Google Gemini AI, Java",
    )
    add_bullet(doc, "Built a full-text scripture search platform with AI-powered search via Google Gemini 2.5 Flash API and URL-rewriting-based multilingual translation through Google Translate.")
    add_bullet(doc, "Delivered both a web app and an Android WebView app, serving original Devanagari content with on-demand translation to multiple languages.")

    add_project_header(
        doc,
        "Enhanced Precision Grayscale Converter",
        [
            ("GitHub (Web)", "https://github.com/jayeshmepani/PrecisionGrayscaleConverter-Web"),
            ("Live demo", "https://precisiongrayscaleconverter-web.onrender.com/"),
        ],
        "Python, FastAPI, Tailwind CSS, JavaScript, Axios",
    )
    add_bullet(doc, "Engineered a FastAPI backend supporting 7 color-science modes (Rec.709, BT.601, BT.2100, HSL, HSV, L*a*b*, Gamma) with 8/16-bit output in PNG, JPEG, HEIC, TIFF, WEBP, and BMP.")
    add_bullet(doc, "Developed a responsive frontend with Axios-powered live previews, drag-and-drop, and EXIF/ICC preservation toggles; fully self-hosted with no third-party uploads.")

    add_project_header(
        doc,
        "Laravel Gemini AI Translation Extractor",
        [("GitHub", "https://github.com/jayeshmepani/laravel-gemini-translator")],
        "PHP, Laravel, Google Gemini AI, spatie/fork",
    )
    add_bullet(doc, "Developed an Artisan command that scans Blade/PHP/JS/TS sources for translation keys, generates Laravel PHP & JSON language files via Gemini 2.0 Flash-Lite, and runs concurrent fork-based requests with auto-retry on rate limits.")

    add_project_header(
        doc,
        "PostalKit",
        [("GitHub", "https://github.com/jayeshmepani/postalkit")],
        "Python, ctypes, FFI, libpostal",
    )
    add_bullet(doc, "Delivered a strict 1:1 ctypes wrapper for the OpenVenues libpostal C library (46 functions, 10 structs, 42 flags) with first-run auto-download of ~2 GB ML models and OS-specific binaries, bypassing all manual toolchain setup.")

    add_project_header(
        doc,
        "Literary & Linguistic Poetry Analyzer",
        [("GitHub", "https://github.com/jayeshmepani/poetry-analyzer")],
        "Python, FastAPI, PyTorch, HuggingFace",
    )
    add_bullet(doc, "Designed an async FastAPI backend orchestrating 1.5 GB+ HuggingFace Transformer models, spaCy, NLTK, and Stanza for multilingual sentiment, emotion, and phonological classification.")
    add_bullet(doc, "Implemented SQLAlchemy ORM connection pooling for SQLite, PostgreSQL, and MySQL/MariaDB, with Alembic schema migrations for production-ready scalability.")

    add_project_header(
        doc,
        "Crop & Nutrient Recommendations Apps",
        [
            ("GitHub (Crop)", "https://github.com/jayeshmepani/Crop-Recommendations-App"),
            ("GitHub (Nutrient)", "https://github.com/jayeshmepani/Nutrient-Recommendations-App"),
        ],
        "Python, Flask, Google Gemini AI, HTML, CSS, JavaScript",
    )
    add_bullet(doc, "Built two Flask applications powered by Google Gemini 2.0 Flash Lite: one recommending crops by factoring in weather, soil, and water needs; the other generating personalized daily caloric and nutrient targets from user biometric inputs.")

    add_project_header(
        doc,
        "Recipe App",
        [("GitHub", "https://github.com/jayeshmepani/Recipe-App")],
        "Flutter",
    )
    add_bullet(doc, "Built a cross-platform Flutter recipe browser with search, filtering, and a user-friendly detail view.")

    add_project_header(
        doc,
        "Portfolio",
        [
            ("GitHub", "https://github.com/jayeshmepani/Portfolio"),
            ("Live demo", "https://jayeshmepani.github.io/Portfolio/"),
        ],
        "HTML, CSS, JavaScript, Tailwind CSS",
    )
    add_bullet(doc, "Designed and deployed a personal portfolio showcasing projects, skills, and professional background.")

    # ── Education ─────────────────────────────────────────────────────────────
    add_section_header(doc, "Education")

    p_inst = doc.add_paragraph()
    set_keep_with_next(p_inst)
    set_right_tabs(p_inst)
    set_spacing(p_inst, before=0, after=0, line=240)
    set_indent(p_inst, start=0)
    style_run(p_inst.add_run("Parul University"), bold=True)
    add_tab(p_inst)
    style_run(p_inst.add_run("Vadodara, Gujarat, India"))

    p_deg = doc.add_paragraph()
    set_keep_with_next(p_deg)
    set_right_tabs(p_deg)
    set_spacing(p_deg, before=0, after=0, line=240)
    set_indent(p_deg, start=0)
    style_run(p_deg.add_run("B.Tech in Computer Science and Engineering"), italic=True)
    add_tab(p_deg)
    style_run(p_deg.add_run("2021 – 2025"))

    p_cgpa = doc.add_paragraph()
    set_spacing(p_cgpa, before=0, after=80, line=None)
    set_indent(p_cgpa, start=0)
    style_run(p_cgpa.add_run("CGPA: 7.29"))

    # ── Certifications ────────────────────────────────────────────────────────
    add_section_header(doc, "Certifications")
    certs = [
        ("PHP Developer", "https://drive.google.com/file/d/1L1zCEEWwPwZR9s1vSDAtiGP-Eao2AlCV/view"),
        ("Python Programming", "https://drive.google.com/file/d/1L0sXZx5_cM2NbqPqMxu9LT66k9NIc714/view"),
        ("Data Science", "https://drive.google.com/file/d/1Kf9wefWCrOgYh_YBgHKEjPQgd8nGajpE/view"),
        ("Flutter Developer", "https://drive.google.com/file/d/1JvQcnijk_f-0-ApsC_HS0jfB2LpWnHAC/view"),
        ("Data Analytics with Python", "https://drive.google.com/file/d/1KsSZirAqiWB7n5yVZ7ywfdsdEItlR7dt/view"),
        ("Laravel", "https://drive.google.com/file/d/1h3f5_pZ8GIM2jUCLM_1oN1BcB0Qxi2Sg/view"),
    ]
    for name, url in certs:
        add_cert_bullet(doc, name, url)

    # ── Soft Skills ───────────────────────────────────────────────────────────
    add_section_header(doc, "Soft Skills")
    p_soft = doc.add_paragraph()
    set_spacing(p_soft, before=0, after=0, line=240)
    set_indent(p_soft, start=0)
    style_run(p_soft.add_run(
        "Analytical Thinking, Problem Solving, Attention to Detail, Research, Time Management, "
        "Adaptability, Communication, Teamwork, Leadership"
    ))

    output_path = "cv_native.docx"
    doc.save(output_path)
    print(f"[SUCCESS] Native DOCX generated cleanly at: {os.path.abspath(output_path)}")


if __name__ == "__main__":
    build_docx()
