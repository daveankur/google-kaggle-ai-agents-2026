    // Centralized Google Drive links configuration.
    const PDF_DRIVE_LINKS = {
      // 2025 Cohort Papers
      "2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf": "https://drive.google.com/file/d/12YzTZ6bwFVa7KPozBUsb_257JoTG45w_/view",
      "2025_Day_2_Rewrite_v1_AgentTools.pdf": "https://drive.google.com/file/d/1sYIHw75lncCHgWBOH5yfqrYfeAou7Nh7/view",
      "2025_Day_3_Rewrite_v1_ContextEngineering.pdf": "https://drive.google.com/file/d/10sni6LV8uQF821-9WKVqVVOubE5QxAuI/view",
      "2025_Day_4_Rewrite_v1_AgentQuality.pdf": "https://drive.google.com/file/d/10-cdIRZw80Mu9bx1hVBYMiRCr9hXHTiy/view",
      "2025_Day_5_Rewrite_v1_Prototype.pdf": "https://drive.google.com/file/d/1CG7Z_SHDpAgeevDyCBiXlidfrVMt5kFD/view",

      // 2026 Cohort Papers
      "Day_1_v3.pdf": "https://drive.google.com/file/d/1IR7CddF_2FyQo_PdfBNTaEA50EGiVt2r/view",
      "Agent Tools & Interoperability_Day_2.pdf": "https://drive.google.com/file/d/1_emw2Pj1aecYZe4LKFcL8-zMDeBBRgQF/view",
      "Agent Skills_Day_3.pdf": "https://drive.google.com/file/d/1Wso-CM4aAvTxFZa5wjBntKM3IVSg7PWW/view",
      "Vibe Coding Agent Security and Evaluation_Day_4.pdf": "https://drive.google.com/file/d/1kEtWZmFMTGYqe12jMiZPOi9zYcyFXfHF/view",
      "Day_5_v3.pdf": "https://drive.google.com/file/d/1lCx0Lh06sK6j59nTNc_pYRdnoxgDtJcn/view"
    };

    // Helper to resolve local PDF path to Google Drive link
    function resolvePdfLink(localPath) {
      if (!localPath) return "#";
      const filename = localPath.split('/').pop();
      if (PDF_DRIVE_LINKS[filename]) {
        return PDF_DRIVE_LINKS[filename];
      }
      return localPath; // Fallback
    }

    // State management & LocalStorage hooks
    const state = {
      completedItems: JSON.parse(localStorage.getItem('course-progress') || '{}'),
      activeTab: 'dashboard',
      activeUnit: '1'
    };

    // DOM Elements
    const body = document.documentElement;
    const globalSearch = document.getElementById('globalSearch');
    
    // Tab Navigation Triggering
    const navItems = document.querySelectorAll('.sidebar .nav-list .nav-item');
    const contentViews = document.querySelectorAll('.content-view');
    const viewTitle = document.getElementById('viewTitle');
    const viewSubtitle = document.getElementById('viewSubtitle');

    // Toast Notification widget
    const toastBox = document.getElementById('toastBox');
    const toastMsg = document.getElementById('toastMsg');

    // Video modal triggers
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeVideoBtn = document.getElementById('closeVideoBtn');

    // 1. Initial State Sync
    function init() {
      // Force light theme
      body.setAttribute('data-theme', 'light');

      // Setup icons
      lucide.createIcons();

      // Bind global event listeners
      globalSearch.addEventListener('input', handleSearch);
      closeVideoBtn.addEventListener('click', closeVideo);
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideo();
      });
      document.getElementById('glossarySearch').addEventListener('input', filterGlossary);

      // Wire tab links
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          switchTab(item.getAttribute('data-tab'));
        });
      });

      // Render Views
      renderViews();
    }

    // Global Renderer based on unified datasets
    function renderViews() {
      const data = COURSE_DATA;

      // Update Overview Banner
      document.getElementById('heroTitle').innerText = data.title;
      document.getElementById('heroText').innerHTML = data.overview;



      // Update Syllabus subtabs (units)
      const subtabs = document.getElementById('syllabusSubtabs');
      subtabs.innerHTML = '';
      data.syllabus.forEach((unit, index) => {
        const btn = document.createElement('button');
        btn.className = `day-subtab ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-unit', unit.num);
        btn.innerText = unit.title;
        btn.addEventListener('click', () => {
          subtabs.querySelectorAll('.day-subtab').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          switchSyllabusUnit(unit.num);
        });
        subtabs.appendChild(btn);
      });

      // Update Syllabus unit view pane content
      switchSyllabusUnit('1');

      // Update Highlights grid card details
      const highlightsGrid = document.getElementById('highlightsGrid');
      highlightsGrid.innerHTML = '';
      data.highlights.forEach(hl => {
        const card = document.createElement('div');
        card.className = 'highlight-card';
        
        let listItems = '';
        hl.items.forEach(item => {
          listItems += `<li>${item}</li>`;
        });

        card.innerHTML = `
          <div class="highlight-card-header">
            <i data-lucide="award"></i>
            <h4>${hl.title}</h4>
          </div>
          <ul class="highlight-card-list">
            ${listItems}
          </ul>
        `;
        highlightsGrid.appendChild(card);
      });

      // Update Glossary Filter Pills
      const pillsContainer = document.getElementById('glossaryFilters');
      pillsContainer.innerHTML = '';
      
      const pillsConfig = [
        { label: 'All Terms', filter: 'all' },
        { label: 'SDLC & Paradigms', filter: 'sdlc' },
        { label: 'Protocols', filter: 'protocols' },
        { label: 'Context & Memory', filter: 'context' },
        { label: 'Security & Evals', filter: 'security' }
      ];

      pillsConfig.forEach((pill, index) => {
        const btn = document.createElement('button');
        btn.className = `glossary-pill ${index === 0 ? 'active' : ''}`;
        btn.setAttribute('data-filter', pill.filter);
        btn.innerText = pill.label;
        btn.addEventListener('click', () => {
          pillsContainer.querySelectorAll('.glossary-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          renderGlossary(pill.filter);
        });
        pillsContainer.appendChild(btn);
      });

      // Redraw Glossary list
      renderGlossary('all');

      // Update All Resources view tab list grid
      const resourcesGrid = document.getElementById('resourcesGrid');
      resourcesGrid.innerHTML = '';

      // Whitepapers
      const papersSection = document.createElement('div');
      papersSection.className = 'resource-category-section search-target-block';
      papersSection.setAttribute('data-type', 'whitepaper');
      papersSection.innerHTML = `<h3 class="resource-category-title">📄 Whitepapers</h3>`;
      
      const papersList = document.createElement('div');
      papersList.className = 'resource-list';
      
      data.syllabus.forEach(unit => {
        // Foundation
        const fPaper = unit.foundation.pdf;
        const fCard = document.createElement('div');
        fCard.className = 'resource-item-card';
        fCard.setAttribute('data-search-term', `${fPaper.title.toLowerCase()} unit ${unit.num} whitepaper dec 2025 foundation`);
        fCard.innerHTML = `
          <div class="resource-item-icon" style="color:#6366f1;"><i data-lucide="file"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${fPaper.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Dec 2025 Foundation</div>
            <a href="${resolvePdfLink(fPaper.link)}" target="_blank" class="resource-item-link">Open PDF <i data-lucide="external-link" style="width:12px;height:12px;"></i></a>
          </div>
        `;
        papersList.appendChild(fCard);

        // Advanced
        const aPaper = unit.advanced.pdf;
        const aCard = document.createElement('div');
        aCard.className = 'resource-item-card';
        aCard.setAttribute('data-search-term', `${aPaper.title.toLowerCase()} unit ${unit.num} whitepaper jun 2026 advanced`);
        aCard.innerHTML = `
          <div class="resource-item-icon" style="color:#a855f7;"><i data-lucide="file-text"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${aPaper.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Jun 2026 Advanced</div>
            <a href="${resolvePdfLink(aPaper.link)}" target="_blank" class="resource-item-link">Open PDF <i data-lucide="external-link" style="width:12px;height:12px;"></i></a>
          </div>
        `;
        papersList.appendChild(aCard);
      });
      papersSection.appendChild(papersList);
      resourcesGrid.appendChild(papersSection);

      // Podcasts
      const podcastsSection = document.createElement('div');
      podcastsSection.className = 'resource-category-section search-target-block';
      podcastsSection.setAttribute('data-type', 'podcast');
      podcastsSection.innerHTML = `<h3 class="resource-category-title">🎙️ Summary Podcasts</h3>`;
      
      const podcastsList = document.createElement('div');
      podcastsList.className = 'resource-list';

      data.syllabus.forEach(unit => {
        // Foundation podcast
        const fPod = unit.foundation.podcast;
        const fCard = document.createElement('div');
        fCard.className = 'resource-item-card';
        fCard.setAttribute('data-search-term', `${fPod.title.toLowerCase()} unit ${unit.num} podcast dec 2025 foundation`);
        fCard.innerHTML = `
          <div class="resource-item-icon" style="color:#6366f1;"><i data-lucide="youtube"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${fPod.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Dec 2025 Foundation</div>
            <button class="resource-item-link play-video-trigger" data-video-id="${fPod.videoId}" style="background:none;border:none;cursor:pointer;font-family:inherit;color:#6366f1;padding:0;">Listen Now <i data-lucide="play" style="width:10px;height:10px;"></i></button>
          </div>
        `;
        fCard.querySelector('.play-video-trigger').addEventListener('click', () => openVideo(fPod.videoId));
        podcastsList.appendChild(fCard);

        // Advanced podcast
        const aPod = unit.advanced.podcast;
        const aCard = document.createElement('div');
        aCard.className = 'resource-item-card';
        aCard.setAttribute('data-search-term', `${aPod.title.toLowerCase()} unit ${unit.num} podcast jun 2026 advanced`);
        aCard.innerHTML = `
          <div class="resource-item-icon" style="color:#a855f7;"><i data-lucide="youtube"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${aPod.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Jun 2026 Advanced</div>
            <button class="resource-item-link play-video-trigger" data-video-id="${aPod.videoId}" style="background:none;border:none;cursor:pointer;font-family:inherit;color:#a855f7;padding:0;">Listen Now <i data-lucide="play" style="width:10px;height:10px;"></i></button>
          </div>
        `;
        aCard.querySelector('.play-video-trigger').addEventListener('click', () => openVideo(aPod.videoId));
        podcastsList.appendChild(aCard);
      });
      podcastsSection.appendChild(podcastsList);
      resourcesGrid.appendChild(podcastsSection);

      // Livestreams
      const liveSection = document.createElement('div');
      liveSection.className = 'resource-category-section search-target-block';
      liveSection.setAttribute('data-type', 'livestream');
      liveSection.innerHTML = `<h3 class="resource-category-title">📺 Q&A YouTube Livestreams</h3>`;
      
      const liveList = document.createElement('div');
      liveList.className = 'resource-list';

      data.syllabus.forEach(unit => {
        // Foundation livestream
        const fLive = unit.foundation.livestream;
        const fCard = document.createElement('div');
        fCard.className = 'resource-item-card';
        fCard.setAttribute('data-search-term', `${fLive.title.toLowerCase()} unit ${unit.num} livestream dec 2025 foundation`);
        fCard.innerHTML = `
          <div class="resource-item-icon" style="color:#ef4444;"><i data-lucide="video"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${fLive.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Dec 2025 Foundation</div>
            <button class="resource-item-link play-video-trigger" data-video-id="${fLive.videoId}" style="background:none;border:none;cursor:pointer;font-family:inherit;color:#ef4444;padding:0;">Watch Panel <i data-lucide="external-link" style="width:10px;height:10px;"></i></button>
          </div>
        `;
        fCard.querySelector('.play-video-trigger').addEventListener('click', () => openVideo(fLive.videoId));
        liveList.appendChild(fCard);

        // Advanced livestream
        const aLive = unit.advanced.livestream;
        const aCard = document.createElement('div');
        aCard.className = 'resource-item-card';
        aCard.setAttribute('data-search-term', `${aLive.title.toLowerCase()} unit ${unit.num} livestream jun 2026 advanced`);
        aCard.innerHTML = `
          <div class="resource-item-icon" style="color:#ef4444;"><i data-lucide="video"></i></div>
          <div class="resource-item-details">
            <div class="resource-item-name">${aLive.title}</div>
            <div class="resource-item-meta">Unit ${unit.num} • Jun 2026 Advanced</div>
            <button class="resource-item-link play-video-trigger" data-video-id="${aLive.videoId}" style="background:none;border:none;cursor:pointer;font-family:inherit;color:#ef4444;padding:0;">Watch Panel <i data-lucide="external-link" style="width:10px;height:10px;"></i></button>
          </div>
        `;
        aCard.querySelector('.play-video-trigger').addEventListener('click', () => openVideo(aLive.videoId));
        liveList.appendChild(aCard);
      });
      liveSection.appendChild(liveList);
      resourcesGrid.appendChild(liveSection);

      // Codelabs
      const labsSection = document.createElement('div');
      labsSection.className = 'resource-category-section search-target-block';
      labsSection.setAttribute('data-type', 'codelab');
      labsSection.innerHTML = `<h3 class="resource-category-title">💻 Hands-on Codelabs</h3>`;
      
      const labsList = document.createElement('div');
      labsList.className = 'resource-list';

      data.syllabus.forEach(unit => {
        // Foundation labs
        unit.foundation.labs.forEach((lab, idx) => {
          const card = document.createElement('div');
          card.className = 'resource-item-card';
          card.setAttribute('data-search-term', `${lab.title.toLowerCase()} unit ${unit.num} codelab dec 2025 foundation`);
          card.innerHTML = `
            <div class="resource-item-icon" style="color:#10b981;"><i data-lucide="code-2"></i></div>
            <div class="resource-item-details">
              <div class="resource-item-name">${lab.title}</div>
              <div class="resource-item-meta">Unit ${unit.num} • Dec 2025 Foundation • Lab ${idx + 1}</div>
              <a href="${lab.url}" target="_blank" class="resource-item-link">Open Codelab <i data-lucide="external-link" style="width:12px;height:12px;"></i></a>
            </div>
          `;
          labsList.appendChild(card);
        });

        // Advanced labs
        unit.advanced.labs.forEach((lab, idx) => {
          const card = document.createElement('div');
          card.className = 'resource-item-card';
          card.setAttribute('data-search-term', `${lab.title.toLowerCase()} unit ${unit.num} codelab jun 2026 advanced`);
          card.innerHTML = `
            <div class="resource-item-icon" style="color:#059669;"><i data-lucide="code-2"></i></div>
            <div class="resource-item-details">
              <div class="resource-item-name">${lab.title}</div>
              <div class="resource-item-meta">Unit ${unit.num} • Jun 2026 Advanced • Lab ${idx + 1}</div>
              <a href="${lab.url}" target="_blank" class="resource-item-link">Open Codelab <i data-lucide="external-link" style="width:12px;height:12px;"></i></a>
            </div>
          `;
          labsList.appendChild(card);
        });
      });
      labsSection.appendChild(labsList);
      resourcesGrid.appendChild(labsSection);

      // Refresh icons & title heights
      lucide.createIcons();
      switchTab(state.activeTab);
    }

    // Switch Syllabus unit layout
    function switchSyllabusUnit(unitNum) {
      state.activeUnit = unitNum;
      const data = COURSE_DATA.syllabus.find(d => d.num === unitNum);
      if (!data) return;

      // Update objectives
      const objectivesBox = document.getElementById('syllabusObjectives');
      let bulletsList = '';
      data.bullets.forEach(b => {
        bulletsList += `
          <li>
            <i data-lucide="check-circle-2"></i>
            <span>${b}</span>
          </li>
        `;
      });

      objectivesBox.innerHTML = `
        <h3><i data-lucide="graduation-cap"></i> ${data.headerTitle}</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.25rem;">${data.intro}</p>
        <ul class="learning-objectives-list">
          ${bulletsList}
        </ul>
      `;

      // Update checklist tasks
      const checklistBox = document.getElementById('syllabusChecklist');
      checklistBox.innerHTML = '';
      
      const fTasks = data.tasks.filter(t => t.id.startsWith('25-'));
      const aTasks = data.tasks.filter(t => t.id.startsWith('26-'));

      function createChecklistItem(t) {
        const item = document.createElement('label');
        item.className = 'checklist-item';
        const isChecked = state.completedItems[t.id] ? 'checked' : '';
        item.innerHTML = `
          <input type="checkbox" class="checklist-checkbox tracker-cb" data-id="${t.id}" ${isChecked}>
          <span class="checklist-text">${t.text}</span>
        `;
        item.querySelector('.tracker-cb').addEventListener('change', handleProgressChange);
        return item;
      }

      if (fTasks.length > 0) {
        const header = document.createElement('div');
        header.style = "font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#6366f1; letter-spacing:0.5px; margin-bottom:0.5rem; border-bottom:1px solid rgba(99, 102, 241, 0.2); padding-bottom:2px;";
        header.innerText = "Dec 2025 Foundations Tasks";
        checklistBox.appendChild(header);
        
        fTasks.forEach(t => {
          checklistBox.appendChild(createChecklistItem(t));
        });
      }

      if (aTasks.length > 0) {
        const header = document.createElement('div');
        header.style = "font-size:0.75rem; font-weight:800; text-transform:uppercase; color:#a855f7; letter-spacing:0.5px; margin-top:1rem; margin-bottom:0.5rem; border-bottom:1px solid rgba(168, 85, 247, 0.2); padding-bottom:2px;";
        header.innerText = "Jun 2026 Advanced Tasks";
        checklistBox.appendChild(header);
        
        aTasks.forEach(t => {
          checklistBox.appendChild(createChecklistItem(t));
        });
      }

      // Update daily resource cards (Render both tracks)
      const resourcesBox = document.getElementById('syllabusResources');
      resourcesBox.innerHTML = `
        <div class="edition-header" style="display:flex; align-items:center; gap:0.5rem; margin: 1.5rem 0 1rem 0; color:#6366f1; font-weight:800; font-size:1.2rem; font-family:var(--font-display);">
          <i data-lucide="award" style="width:20px;height:20px;"></i> Dec 2025 Foundation Track
        </div>
        <div class="daily-grid" id="foundationGrid" style="margin-bottom:2rem;"></div>

        <div class="edition-header" style="display:flex; align-items:center; gap:0.5rem; margin: 2rem 0 1rem 0; color:#a855f7; font-weight:800; font-size:1.2rem; font-family:var(--font-display);">
          <i data-lucide="zap" style="width:20px;height:20px;"></i> Jun 2026 Advanced Track (Vibe Coding Stack)
        </div>
        <div class="daily-grid" id="advancedGrid" style="margin-bottom:1rem;"></div>
      `;

      const foundationGrid = document.getElementById('foundationGrid');
      const advancedGrid = document.getElementById('advancedGrid');

      // Populate Foundation track cards
      renderTrackCards(data.foundation, foundationGrid);
      // Populate Advanced track cards
      renderTrackCards(data.advanced, advancedGrid);

      lucide.createIcons();
    }

    // Helper to generate resources cards for a given track (foundation or advanced)
    function renderTrackCards(track, container) {
      // 1. Podcast Card
      const podCard = document.createElement('div');
      podCard.className = 'glass-card daily-section-card';
      podCard.innerHTML = `
        <div>
          <div class="card-header-icon">
            <span class="card-tag podcast">Podcast Summary</span>
            <i data-lucide="headphones" style="color: #a855f7;"></i>
          </div>
          <h3 class="card-title">${track.podcast.title}</h3>
          <p class="card-desc">${track.podcast.desc}</p>
          <div class="media-player-preview">
            <button class="media-play-btn play-video-trigger" data-video-id="${track.podcast.videoId}">
              <i data-lucide="play"></i>
            </button>
            <div class="media-track-info">
              <div class="media-track-title">Listen on YouTube</div>
              <div class="media-track-meta">Duration: ~20 mins</div>
            </div>
          </div>
        </div>
        <button class="card-action-btn play-video-trigger" data-video-id="${track.podcast.videoId}">
          <i data-lucide="youtube"></i> Play Podcast
        </button>
      `;
      podCard.querySelectorAll('.play-video-trigger').forEach(btn => {
        btn.addEventListener('click', () => openVideo(track.podcast.videoId));
      });
      container.appendChild(podCard);

      // 2. Whitepaper Card
      const paperCard = document.createElement('div');
      paperCard.className = 'glass-card daily-section-card';
      paperCard.innerHTML = `
        <div>
          <div class="card-header-icon">
            <span class="card-tag whitepaper">Core Whitepaper</span>
            <i data-lucide="file-text" style="color: #3b82f6;"></i>
          </div>
          <h3 class="card-title">${track.pdf.title}</h3>
          <p class="card-desc">${track.pdf.desc}</p>
        </div>
        <a href="${resolvePdfLink(track.pdf.link)}" target="_blank" class="card-action-btn">
          <i data-lucide="file-down"></i> Open PDF Document
        </a>
      `;
      container.appendChild(paperCard);

      // 3. Codelabs Card
      const labsCard = document.createElement('div');
      labsCard.className = 'glass-card daily-section-card';
      
      let buttonsHtml = '';
      track.labs.forEach((lab, idx) => {
        buttonsHtml += `
          <a href="${lab.url}" target="_blank" class="card-action-btn ${idx > 0 ? 'secondary' : ''}">
            <i data-lucide="link"></i> ${lab.title}
          </a>
        `;
      });
      labsCard.innerHTML = `
        <div>
          <div class="card-header-icon">
            <span class="card-tag codelab">Codelabs</span>
            <i data-lucide="code-2" style="color: #10b981;"></i>
          </div>
          <h3 class="card-title">Practice Notebooks</h3>
          <p class="card-desc">Execute hands-on exercises in notebook environments to implement developer steps.</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${buttonsHtml}
        </div>
      `;
      container.appendChild(labsCard);

      // 4. Livestream Card
      const liveCard = document.createElement('div');
      liveCard.className = 'glass-card daily-section-card';
      liveCard.innerHTML = `
        <div>
          <div class="card-header-icon">
            <span class="card-tag livestream" style="background: rgba(239, 68, 68, 0.08); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.15);">Q&A Livestream</span>
            <i data-lucide="video" style="color: #ef4444;"></i>
          </div>
          <h3 class="card-title">${track.livestream.title}</h3>
          <p class="card-desc">${track.livestream.desc}</p>
          <div class="media-player-preview">
            <button class="media-play-btn play-video-trigger" data-video-id="${track.livestream.videoId}" style="background: var(--red-grad); box-shadow: 0 4px 10px rgba(239, 68, 68, 0.25);">
              <i data-lucide="play"></i>
            </button>
            <div class="media-track-info">
              <div class="media-track-title">Watch Review Session</div>
              <div class="media-track-meta">YouTube livestream recording</div>
            </div>
          </div>
        </div>
        <button class="card-action-btn play-video-trigger" data-video-id="${track.livestream.videoId}" style="background: var(--red-grad);">
          <i data-lucide="youtube"></i> Watch Livestream
        </button>
      `;
      liveCard.querySelectorAll('.play-video-trigger').forEach(btn => {
        btn.addEventListener('click', () => openVideo(track.livestream.videoId));
      });
      container.appendChild(liveCard);
    }

    // 2. Navigation Actions
    function switchTab(tabName) {
      navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      contentViews.forEach(view => {
        if (view.id === `view-${tabName}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      state.activeTab = tabName;

      // Update titles
      const headers = {
        'dashboard': {
          title: 'Course Overview',
          sub: 'Welcome! Explore the self-paced materials and build structured AI agents.'
        },
        'daily-syllabus': {
          title: 'Syllabus by Topic',
          sub: 'Access the podcasts, read whitepapers, and build step-by-step developer codelabs.'
        },
        'knowledge-graph': {
          title: 'Interactive Knowledge Graph',
          sub: 'Hover to trace connections, and click nodes to view key takeaways and source whitepapers.'
        },
        'takeaways-glossary': {
          title: 'Highlights & Term Glossary',
          sub: 'Quick list cheat-sheets and a searchable glossary catalog summarizing the core papers.'
        },
        'all-resources': {
          title: 'All Resource Directory',
          sub: 'Search and inspect all downloadable items, links, tools, and readings in one view.'
        }
      };

      if (headers[tabName]) {
        viewTitle.innerText = headers[tabName].title;
        viewSubtitle.innerText = headers[tabName].sub;
      }

      if (tabName === 'knowledge-graph') {
        initGraph();
      }
    }

    // 3. Search / Filtering Functionality
    function handleSearch(e) {
      const query = e.target.value.toLowerCase().trim();

      if (query.length > 0 && state.activeTab !== 'all-resources') {
        switchTab('all-resources');
      }

      const resourceCards = document.querySelectorAll('.resource-item-card');
      resourceCards.forEach(card => {
        const text = card.getAttribute('data-search-term') || '';
        const name = card.querySelector('.resource-item-name').innerText.toLowerCase();
        const meta = card.querySelector('.resource-item-meta').innerText.toLowerCase();
        
        if (text.includes(query) || name.includes(query) || meta.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      const categories = document.querySelectorAll('.resource-category-section');
      categories.forEach(cat => {
        const visibleCards = cat.querySelectorAll('.resource-item-card[style="display: flex;"]');
        if (visibleCards.length === 0 && query.length > 0) {
          cat.style.display = 'none';
        } else {
          cat.style.display = 'block';
        }
      });
    }
    // 4. Glossary Rendering and Filtering
    function renderGlossary(filterCategory) {
      const data = COURSE_DATA;
      const tbody = document.getElementById('glossaryBody');
      tbody.innerHTML = '';
      
      const filtered = filterCategory === 'all' 
        ? data.glossary 
        : data.glossary.filter(d => d.cat === filterCategory);

      const categoryBadges = {
        sdlc: { bg: '#e0e7ff', color: '#4f46e5', label: 'SDLC & Paradigms' },
        protocols: { bg: '#e0f2fe', color: '#0369a1', label: 'Protocols' },
        context: { bg: '#dcfce7', color: '#15803d', label: 'Context & Memory' },
        security: { bg: '#fee2e2', color: '#b91c1c', label: 'Security & Evals' }
      };

      // Helper to map term to document link
      const getDocLink = (term, edition) => {
        const lowerTerm = term.toLowerCase();
        if (lowerTerm.includes("agent-to-user")) return "2026/FILES/Agent Tools & Interoperability_Day_2.pdf";
        if (lowerTerm.includes("payments")) return "2026/FILES/Agent Tools & Interoperability_Day_2.pdf";
        if (lowerTerm.includes("universal commerce")) return "2026/FILES/Agent Tools & Interoperability_Day_2.pdf";
        if (lowerTerm.includes("model context")) return "2026/FILES/Agent Tools & Interoperability_Day_2.pdf";
        if (lowerTerm.includes("agent-to-agent")) return "2026/FILES/Agent Tools & Interoperability_Day_2.pdf";
        if (lowerTerm.includes("spec-driven")) return "2026/FILES/Day_5_v3.pdf";
        if (lowerTerm.includes("adk framework")) return "2025/FILES/2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf";
        
        const node = data.graph.nodes.find(n => {
          const nId = n.id.toLowerCase();
          return lowerTerm.includes(nId) || nId.includes(lowerTerm);
        });
        if (node) return node.docLink;
        
        if (edition.includes("2025")) return "2025/FILES/2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf";
        return "2026/FILES/Day_1_v3.pdf";
      };

      filtered.forEach(item => {
        const badge = categoryBadges[item.cat];
        const tr = document.createElement('tr');
        tr.setAttribute('data-term-name', item.term.toLowerCase());
        tr.setAttribute('data-term-definition', item.definition.toLowerCase());
        tr.setAttribute('data-term-edition', item.edition.toLowerCase());
        
        let editionTagStyle = "font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.5rem; display:inline-block;";
        let editionTagColor = item.edition.includes('2025') 
          ? "background: rgba(99, 102, 241, 0.08); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.15);" 
          : item.edition.includes('2026') 
            ? "background: rgba(168, 85, 247, 0.08); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.15);"
            : "background: rgba(16, 185, 129, 0.08); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.15);";

        const localDocLink = getDocLink(item.term, item.edition);
        const resolvedDocLink = resolvePdfLink(localDocLink);
        const docFilename = localDocLink.split('/').pop() || "Document.pdf";

        tr.innerHTML = `
          <td>
            <span class="glossary-term-badge">${item.term}</span>
            <div style="display:flex; gap:0.25rem; margin-top:0.35rem; flex-wrap:wrap;">
              <span class="glossary-cat-tag" style="background:${badge.bg}; color:${badge.color}; font-size: 0.7rem; font-weight:600; padding: 0.1rem 0.35rem; border-radius:4px;">${badge.label}</span>
              <span style="${editionTagStyle} ${editionTagColor}">${item.edition}</span>
            </div>
          </td>
          <td style="font-size:0.92rem; line-height:1.5; color: var(--text-main);">${item.definition}</td>
          <td>
            <a href="${resolvedDocLink}" target="_blank" style="display:inline-flex; align-items:center; gap:0.35rem; color:#6366f1; text-decoration:none; font-size:0.8rem; font-weight:600; background:rgba(99,102,241,0.05); padding:0.4rem 0.75rem; border-radius:6px; border:1px solid rgba(99,102,241,0.1);" title="Open original whitepaper for ${item.term}">
              <i data-lucide="file-text" style="width:14px; height:14px;"></i>
              <span style="max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${docFilename}</span>
            </a>
          </td>
        `;
        tbody.appendChild(tr);
      });
      
      // Refresh icons for new document icons
      lucide.createIcons();
    }

    function filterGlossary(e) {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#glossaryBody tr');
      rows.forEach(row => {
        const term = row.getAttribute('data-term-name');
        const def = row.getAttribute('data-term-definition');
        const ed = row.getAttribute('data-term-edition');
        if (term.includes(query) || def.includes(query) || ed.includes(query)) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    }

    // 5. Progress Checkbox handler (Independent with localStorage memory, no calculations)
    function handleProgressChange(e) {
      const id = e.target.getAttribute('data-id');
      const isChecked = e.target.checked;

      if (isChecked) {
        state.completedItems[id] = true;
      } else {
        delete state.completedItems[id];
      }

      // Save to localStorage
      localStorage.setItem('course-progress', JSON.stringify(state.completedItems));
      showToast(isChecked ? "Marked as completed!" : "Marked as incomplete.");
    }

    // 6. Video Player Actions
    function openVideo(videoId) {
      videoPlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      videoModal.classList.add('active');
    }

    function closeVideo() {
      videoModal.classList.remove('active');
      videoPlayer.src = '';
    }

    // 7. Toast Alerts
    let toastTimeout;
    function showToast(msg) {
      toastMsg.innerText = msg;
      toastBox.classList.add('show');
      
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toastBox.classList.remove('show');
      }, 2500);
    }

    // 8. D3 KNOWLEDGE GRAPH ENGINE
    let graphInitialized = false;
    function initGraph() {
      if (graphInitialized) return;
      graphInitialized = true;

      const svg = d3.select("#conceptGraph");
      const container = svg.node().getBoundingClientRect();
      const width = container.width || 600;
      const height = container.height || 500;

      // Clear previous elements
      svg.selectAll("*").remove();

      // Get current course graph data
      const data = COURSE_DATA.graph;
      
      // Clone nodes and links
      const nodes = data.nodes.map(n => ({...n}));
      const links = data.links.map(l => ({...l}));

      // Groups colors
      const groupColors = {
        sdlc: "#8b5cf6", // Purple
        protocols: "#06b6d4", // Cyan
        context: "#10b981", // Green
        security: "#ef4444" // Red
      };

      // Zoom support
      const mainGroup = svg.append("g");
      const zoom = d3.zoom()
        .scaleExtent([0.3, 2.5])
        .on("zoom", (e) => {
          mainGroup.attr("transform", e.transform);
        });
      svg.call(zoom);

      // Links drawing
      const link = mainGroup.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

      // Nodes drawing
      const node = mainGroup.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", d => d.size)
        .attr("fill", d => groupColors[d.group])
        .on("click", (event, d) => {
          showNodeDetails(d);
          highlightConnectedNodes(d);
        });

      // Labels drawing
      const label = mainGroup.selectAll(".node-label")
        .data(nodes)
        .enter().append("text")
        .attr("class", "node-label")
        .attr("dy", d => d.size + 11)
        .text(d => d.id);

      // Simulation setup
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(140))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => d.size + 25));

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        label
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });

      // Drag support
      node.call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

      // Graph controls
      document.getElementById('graphZoomInBtn').onclick = () => svg.transition().call(zoom.scaleBy, 1.3);
      document.getElementById('graphZoomOutBtn').onclick = () => svg.transition().call(zoom.scaleBy, 0.7);
      document.getElementById('graphResetBtn').onclick = () => {
        svg.transition().call(zoom.transform, d3.zoomIdentity);
        node.style("opacity", 1);
        link.style("opacity", 0.65);
        document.getElementById('graphDetails').querySelector('#detailsPlaceholder').style.display = 'flex';
        document.getElementById('graphDetails').querySelector('#detailsContent').classList.remove('active');
      };

      // Node highlights logic
      function highlightConnectedNodes(selectedNode) {
        const connectedNodeIds = new Set([selectedNode.id]);
        
        links.forEach(l => {
          if (l.source.id === selectedNode.id) connectedNodeIds.add(l.target.id);
          if (l.target.id === selectedNode.id) connectedNodeIds.add(l.source.id);
        });

        node.style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.25);
        link.style("opacity", l => (l.source.id === selectedNode.id || l.target.id === selectedNode.id) ? 1 : 0.1);
      }
    }

    // Detail Panel update
    function showNodeDetails(nodeData) {
      document.getElementById('detailsPlaceholder').style.display = 'none';
      const content = document.getElementById('detailsContent');
      content.classList.add('active');

      const catLabels = {
        sdlc: 'SDLC & Paradigms',
        protocols: 'Interoperability Protocols',
        context: 'Context Engineering',
        security: 'Security & Verification'
      };

      document.getElementById('nodeName').innerText = nodeData.id;
      document.getElementById('nodeGroupTag').innerHTML = `
        <span>${catLabels[nodeData.group] || nodeData.group}</span>
        <span style="margin-left: 0.5rem; padding: 0.1rem 0.4rem; border-radius: 4px; background: rgba(99,102,241,0.08); color:#6366f1; font-size: 0.7rem; font-weight: 700; border: 1px solid rgba(99,102,241,0.15);">${nodeData.edition}</span>
      `;
      document.getElementById('nodeDefinition').innerText = nodeData.def;
      
      const takeawaysList = document.getElementById('nodeTakeaways');
      takeawaysList.innerHTML = '';
      nodeData.takeaways.forEach(t => {
        const li = document.createElement('li');
        li.innerText = t;
        takeawaysList.appendChild(li);
      });

      const docLink = document.getElementById('nodeDocLink');
      docLink.href = resolvePdfLink(nodeData.docLink);
    }
