# Google & Kaggle AI Agents Course Hub

This repository consolidates the learning materials, whitepapers, podcasts, and codelabs from the two AI Agent intensive sessions presented by the Google Team on Kaggle:
*   **Dec 2025 Edition (Foundational Track)**: [Kaggle 5-Day AI Agents Course](https://www.kaggle.com/learn-guide/5-day-agents)
*   **Jun 2026 Edition (Advanced Track)**: [5-Day AI Agents Intensive - Vibe Coding](https://www.kaggle.com/competitions/5-day-ai-agents-intensive-vibecoding-course-with-google)

### 🔗 Live Demo
Explore the interactive dashboard live at:
👉 **[https://daveankur.github.io/google-kaggle-ai-agents-2026/index.html](https://daveankur.github.io/google-kaggle-ai-agents-2026/index.html)**
---

## Repository Structure

To keep the repository lightweight and clean, all course whitepapers and PDFs are hosted on Google Drive rather than checking raw binaries into Git.
*   **`scratch/`**: Contains the modular database source files (`unified_data.json`, `unified_functions.js`, and `compile_dashboard.py`) to easily modify or re-compile the dashboard database.
*   **`index.html`**: The fully compiled, interactive single-page course hub.

---
## Interactive Dashboard Sections

The live hub contains 5 key interactive views:
1.  **Course Overview**: A high-level introduction summarizing the unified tracks, linking directly to official Kaggle portals.
2.  **Learning Pathway**: The core syllabus split into 5 core thematic units, presenting Dec 2025 and Jun 2026 study materials (podcasts, whitepapers, codelabs) side-by-side.
3.  **Interactive Knowledge Graph**: An interactive D3.js force-directed graph connecting related concepts across both editions, featuring detail cards and source links on node clicks.
4.  **Highlights & Glossary**: Key takeaway summaries (e.g., guidelines, rules) and a fully searchable glossary with badges and click-to-open reference links for all core agent terms.
5.  **All Resources**: A searchable grid of all downloadable items (whitepapers, podcasts, livestreams, codelabs) filtered instantly by search queries.

---
## Version History

*   **v2.1.0 (2026-06-22)**:
    *   Integrated Google Tag Manager (`GTM-N4CDMXBJ`) for pageview, outbound link clicks, and event analytics.
    *   Implemented unique visitor counter widget in the sidebar footer using `localStorage` and `CounterAPI`.
    *   Optimized `.gitignore` settings to keep the local raw PDFs folder (`kaggle-google/`) untracked.
*   **v2.0.0 (2026-06-21)**:
    *   Consolidated the Dec 2025 Foundational Track and Jun 2026 Advanced Track into a single dashboard.
    *   Refactored the database into a modular JSON store under `scratch/`.
    *   Redesigned the learning pathway syllabus to display tracks side-by-side.
    *   Configured the D3.js force-directed graph to scale dynamically.
    *   Added searchable term glossary with click-to-open reference links.
    *   Centralized whitepaper files on Google Drive for repository optimization.
*   **v1.0.0 (2025-12-15)**:
    *   Initial release containing learning resources for the 5-day AI Agents course.
