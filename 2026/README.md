# AI Agents Course Hub 🤖

Welcome to the **AI Agents Course Hub**! This repository compiles and organizes the resources, podcasts, whitepapers, and codelabs from the self-paced AI Agents course created by Google and Kaggle.

An interactive dashboard version of this resource list is hosted on GitHub Pages:
🔗 **[Launch the Interactive Dashboard](index.html)** *(Or view it live on your GitHub Pages site)*

---

## 📖 Course Overview

This curriculum explores building autonomous AI agents, moving from standard chatbot interfaces to intent-driven **"Vibe Coding"** workflows where natural language is the primary programming interface. Major themes include:
1. **Introduction & Vibe Coding**: Shifting from manual syntax typing to developer-as-orchestrator model design.
2. **Agent Tools & MCP**: Connecting models to external data sources using the Model Context Protocol (MCP) and Generative UI (A2UI).
3. **Agent Skills**: Optimizing LLM workspaces using modular skill directories (`SKILL.md`) and progressive context loading.
4. **Security & Evaluation**: Sandboxing, trajectory checking (OpenTelemetry), and guarding against package hallucinations ("slopsquatting").
5. **Production & Scaling**: Applying Spec-Driven Development (SDD) to deploy governed, observable fleets in the cloud.

---

## 🛠️ Repository Contents

* **`index.html`**: A fully self-contained, light-themed interactive dashboard featuring:
  * Categorized tabs to organize materials by syllabus units.
  * Live filter search to quickly lookup whitepapers, tools, or podcasts.
  * Dynamic, local-storage-backed checkboxes to track study progress.
  * A pop-up video lightbox player for YouTube podcast streams.
* **`Consolidated_Reference.md`**: A clean, single-page Markdown document containing all links, concepts, and downloads.
* **Course Day files (`Day 1.md` - `Final.md`)**: The raw daily emails, notifications, and study reminders.

---

## 🚀 How to Run Locally

Since the dashboard is completely client-side, you don't need to run any local build scripts or server installations:
1. Double-click the **[index.html](index.html)** file in your file explorer, OR
2. Open it in a browser using your terminal:
   ```bash
   # On macOS
   open index.html
   
   # On Windows
   start index.html
   ```

---

## 🌐 Deploy to GitHub Pages

To publish this index as your own online dashboard:
1. Push this repository to public GitHub.
2. Navigate to repository **Settings** -> **Pages**.
3. Under **Build and deployment**, set the source branch to `main` (or the default branch name) and directory to `/ (root)`.
4. Save and access your live page at `https://<your-username>.github.io/<your-repo-name>/`.
