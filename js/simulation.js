// Video Database with Technical Specifications, Methodology, and Code Snippets
const videosData = [
  {
    id: "addc_2025_drone",
    filename: "videos/addc_2025_drone.mp4",
    thumbnail: "images/ADDC2025DRONE.jpg",
    title: "Autonomous Drone Delivery Competition (ADDC 2025)",
    category: "drone",
    duration: "04:02",
    durationSeconds: 242,
    size: "83.9 MB",
    resolution: "1280x720 (Web Optimized)",
    codec: "H.264 / AAC",
    fps: 30,
    description: "Complete simulation run in Gazebo for the 2025 Autonomous Drone Delivery Competition. The video illustrates waypoint navigation, obstacle detection/avoidance, path planning under external wind disturbance, and high-accuracy downward-facing camera tracking of target landing rings.",
    telemetryType: "drone_addc",
    methodology: "<strong>Precision Landing Subsystem:</strong> Uses a downward-facing RGB camera processing feed at 30 FPS. Applies Hough Circle Transform to isolate concentric target landing rings. Tracks centroid offset and calculates horizontal velocity correction using an adaptive PID control loop to stabilize the drone before executing precision touchdown commands.",
    codeSnippet: `# ROS 2 Landing Target Detection Node
def detect_target_centroid(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    circles = cv2.HoughCircles(
        blurred, cv2.HOUGH_GRADIENT, dp=1.2, 
        minDist=100, param1=50, param2=30, 
        minRadius=20, maxRadius=150
    )
    if circles is not None:
        # Extract target center coordinates
        x, y, r = circles[0][0]
        return float(x), float(y), float(r)
    return None`
  },
  {
    id: "aerothon_serpent",
    filename: "videos/aerothon_serpent.mp4",
    thumbnail: "images/Aerthon2024surpentm4.jpg",
    title: "Aerothon 2024 Serpent M4 Slalom Run",
    category: "path_planning",
    duration: "06:31",
    durationSeconds: 391,
    size: "64.7 MB",
    resolution: "1280x720 (Web Optimized)",
    codec: "H.264 / AAC",
    fps: 30,
    description: "A comprehensive trajectory tracking validation showing the Serpent M4 drone executing serpentine and slalom maneuvers. Employs advanced curvature-based path-following controls, showcasing high-frequency orientation adjustments and flight trajectory corrections.",
    telemetryType: "drone_serpent",
    methodology: "<strong>Slalom Path Generator:</strong> Integrates cubic Hermite splines to compute smooth path curves passing through narrow slalom gate waypoints. Adjusts forward speed dynamically as a function of local path curvature. Attitude commands are mapped directly to PX4 rate targets via MAVROS.",
    codeSnippet: `// Slalom Path Correction Node (C++)
double calculate_target_yaw(Point current, Point target) {
    double dy = target.y - current.y;
    double dx = target.x - current.x;
    double desired_yaw = atan2(dy, dx);
    
    // Apply banking thresholds
    double diff = desired_yaw - current.yaw;
    while (diff < -M_PI) diff += 2 * M_PI;
    while (diff > M_PI) diff -= 2 * M_PI;
    
    return current.yaw + clamp(diff, -0.15, 0.15);
}`
  },
  {
    id: "aerothon_bug",
    filename: "videos/aerothon_bug.mp4",
    thumbnail: "images/aerothonbug.jpg",
    title: "Aerothon Bug & Crash Analysis",
    category: "bug",
    duration: "04:53",
    durationSeconds: 293,
    size: "24.5 MB",
    resolution: "1280x720 (Web Optimized)",
    codec: "H.264 / AAC",
    fps: 30,
    description: "Diagnostic flight recording capturing a control loop failure during autonomous execution. The run displays initial stable hovering followed by increasing PID oscillations in roll and pitch, resulting in orientation loss, failsafe trigger failure, and collision sequence.",
    telemetryType: "drone_bug",
    methodology: "<strong>Loop Instability Diagnostics:</strong> Post-flight logs show that the attitude rate controller gains ($K_p$) caused a harmonic feedback loop resonance when exposed to wind shear. The resulting high-frequency oscillations saturated the ESC motor outputs, preventing attitude correction and causing flight-state machine lockup.",
    codeSnippet: `# PID Saturation & Failsafe Watchdog
def monitor_actuator_status(esc_signals):
    saturated_actuators = [s for s in esc_signals if s >= 0.99]
    if len(saturated_actuators) >= 2:
        # Actuator saturation detected! Trigger emergency mode
        publish_safety_status("FAILSAFE_ACTIVE")
        abort_and_disarm()
        return True
    return False`
  },
  {
    id: "agribot_nav",
    filename: "videos/agribot_nav.mp4",
    thumbnail: "images/agribotnagavation.jpg",
    title: "Agribot Crop Row Navigation",
    category: "agricultural",
    duration: "00:19",
    durationSeconds: 19,
    size: "3.5 MB",
    resolution: "478x850 (Web Optimized)",
    codec: "H.264 / AAC",
    fps: 30,
    description: "Crop row centring demonstration of an agricultural robot (Agribot). Using downward and forward stereoscopic cameras combined with Hough transform lane detection, the ground robot steers autonomously through dense crop fields without damaging rows.",
    telemetryType: "agribot",
    methodology: "<strong>Vision-guided Row Centering:</strong> Isolates vegetation crop lanes using a green-channel chromaticity enhancement mask. Performs Probabilistic Hough Line Transform to locate structural crop rows, estimating the road centerline and outputting differential steering commands to the chassis motor controller.",
    codeSnippet: `# Crop Row Segmentation Pipeline
def extract_row_steering(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    # Target green vegetation range
    green_mask = cv2.inRange(hsv, (35, 40, 40), (85, 255, 255))
    lines = cv2.HoughLinesP(green_mask, 1, np.pi/180, 50, minLineLength=80, maxLineGap=15)
    
    left_lane_x, right_lane_x = segment_lines(lines)
    field_center = (left_lane_x + right_lane_x) / 2
    
    return compute_steering_offset(field_center)`
  }
];

// Reference files from Screenshot
const referenceItems = [
  {
    title: "FINAL2025addc.webm",
    status: "success",
    description: "Fully completed target detection, alignment, descent, and landing sequence. Zero error tolerance achieved."
  },
  {
    title: "drone_view_hotspot_landing.webm",
    status: "success",
    description: "First-person gimbal camera stream of bulls-eye target center tracking during the final approach phase."
  },
  {
    title: "Addc2024_QR.webm",
    status: "warning",
    description: "Successful QR localization but slightly slow target alignment. Legacy yaw control coefficients used."
  },
  {
    title: "No_Qr_Match.webm",
    status: "fail",
    description: "QR target located but verification signature failed. Target mismatch flagged, vehicle hovered in hold mode."
  },
  {
    title: "NOqrdection.webm",
    status: "fail",
    description: "Vision occlusion or camera exposure issues. Unable to detect target QR code within search timeout window."
  },
  {
    title: "1cam_noqrdection.webm",
    status: "fail",
    description: "Single monocular camera backup failure. Lost optical flow orientation during high-altitude descent."
  }
];

// App State
let currentTab = "overview";
let searchQuery = "";
let selectedCategory = "all";
let activeVideo = null;
let syncCompare = false;

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSidebar();
  initVideoGrid();
  initSearch();
  initModal();
  initCompare();
  initTerminal();
  updateStats();

  // Handle URL query parameters for deep linking
  const urlParams = new URLSearchParams(window.location.search);
  const runParam = urlParams.get('run');
  const tabParam = urlParams.get('tab');
  
  if (tabParam) {
    const tabBtn = document.querySelector(`.nav-btn[data-tab="${tabParam}"]`);
    if (tabBtn) {
      tabBtn.click();
    }
  }
  
  if (runParam) {
    const video = videosData.find(v => v.id === runParam);
    if (video) {
      setTimeout(() => {
        openVideoModal(video);
      }, 300);
    }
  }
});

// Navigation / Tabs
function initNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (!tab) return;
      
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      document.querySelectorAll(".page-view").forEach(view => {
        view.classList.remove("active");
      });
      
      const targetView = document.getElementById(`${tab}-view`);
      if (targetView) {
        targetView.classList.add("active");
      }
      
      currentTab = tab;
      
      // Stop running modal video if active
      if (tab !== "overview" && activeVideo) {
        closeVideoModal();
      }
      
      // Pause comparison videos if navigating away
      if (tab !== "compare") {
        const compV1 = document.getElementById("compare-video-1");
        const compV2 = document.getElementById("compare-video-2");
        if (compV1) compV1.pause();
        if (compV2) compV2.pause();
      }
    });
  });

  // Mobile Nav Toggle
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = navToggle.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });

    // Close mobile nav when any link is clicked
    const links = navLinks.querySelectorAll("a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = navToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        const icon = navToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }
}

// Sidebar Category Filter
function initSidebar() {
  const categoryFilters = document.querySelectorAll("[data-category]");
  categoryFilters.forEach(filter => {
    filter.addEventListener("click", () => {
      categoryFilters.forEach(f => f.classList.remove("active"));
      filter.classList.add("active");
      selectedCategory = filter.dataset.category;
      renderVideoGrid();
    });
  });
}

// Stats counter updater
function updateStats() {
  const elTotal = document.getElementById("stat-total-count");
  if (elTotal) elTotal.textContent = videosData.length;
  
  const totalDuration = videosData.reduce((acc, v) => acc + v.durationSeconds, 0);
  const min = Math.floor(totalDuration / 60);
  const sec = totalDuration % 60;
  const elDuration = document.getElementById("stat-duration");
  if (elDuration) elDuration.textContent = `${min}m ${sec}s`;
  
  const bugsCount = videosData.filter(v => v.category === "bug").length;
  const elBugs = document.getElementById("stat-bugs");
  if (elBugs) elBugs.textContent = bugsCount;
  
  const totalSize = videosData.reduce((acc, v) => {
    const sizeVal = parseFloat(v.size);
    if (v.size.includes("GB")) {
      return acc + (sizeVal * 1024);
    }
    return acc + sizeVal;
  }, 0);
  const elStorage = document.getElementById("stat-storage");
  if (elStorage) elStorage.textContent = (totalSize / 1024).toFixed(2) + " GB";
}

// Render Videos Grid
function initVideoGrid() {
  renderVideoGrid();
  renderReferencePanel();
}

function renderVideoGrid() {
  const gridContainer = document.getElementById("videos-grid");
  if (!gridContainer) return;
  
  gridContainer.innerHTML = "";
  
  const filtered = videosData.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <svg style="width: 48px; height: 48px; stroke: currentColor; fill: none; margin-bottom: 12px;" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9a2.25 2.25 0 00-2.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p>No video files match your current filters or search term.</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card glass-panel glass-panel-hover";
    card.addEventListener("click", () => openVideoModal(video));
    
    // Add default fallback thumbnail path
    let thumbSrc = video.thumbnail;
    
    card.innerHTML = `
      <div class="video-thumbnail-container">
        <img class="video-thumbnail" src="${thumbSrc}" alt="${video.title}" onerror="this.src='images/24-aerothon.jpg';">
        <span class="video-tag">${formatCategory(video.category)}</span>
        <span class="video-duration">${video.duration}</span>
        <div class="play-hover-btn">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div class="video-info">
        <div class="video-meta">
          <span>${video.resolution}</span>
          <span>•</span>
          <span>${video.size}</span>
        </div>
        <h3 class="video-title">${video.title}</h3>
        <p class="video-desc">${video.description}</p>
        <div class="video-tech-specs">
          <span class="tech-tag">${video.codec}</span>
          <span class="tech-tag">${video.fps} FPS</span>
          <span class="tech-tag">${video.filename.split('/').pop()}</span>
        </div>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

function renderReferencePanel() {
  const refList = document.getElementById("reference-list");
  if (!refList) return;
  
  refList.innerHTML = "";
  referenceItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "reference-item glass-panel";
    
    const statusLabel = item.status.toUpperCase();
    
    div.innerHTML = `
      <div class="reference-head">
        <span class="ref-title">${item.title}</span>
        <span class="ref-status-tag ${item.status}">${statusLabel}</span>
      </div>
      <p class="ref-desc">${item.description}</p>
    `;
    refList.appendChild(div);
  });
}

function formatCategory(cat) {
  const map = {
    drone: "Drone flight",
    path_planning: "Path Planning",
    bug: "Issue / Bug",
    agricultural: "Agricultural"
  };
  return map[cat] || cat;
}

// Search Handler
function initSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderVideoGrid();
    });
  }
}

// Modal Player Functionality
let telemetryInterval = null;
let isUserDraggingSlider = false;

// Modal Player Helpers
function formatSliderTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayPauseUI() {
  const mainVideo = document.getElementById("modal-main-video");
  const playPauseIcon = document.getElementById("play-pause-icon");
  if (!mainVideo || !playPauseIcon) return;
  
  if (mainVideo.paused) {
    playPauseIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
  } else {
    playPauseIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
  }
}

function updatePlayerUI() {
  const mainVideo = document.getElementById("modal-main-video");
  const seekSlider = document.getElementById("control-seek");
  const currentTimeSpan = document.getElementById("control-current-time");
  const durationSpan = document.getElementById("control-duration");
  
  if (!mainVideo) return;
  
  const duration = mainVideo.duration || 0;
  const currentTime = mainVideo.currentTime || 0;
  
  if (!isUserDraggingSlider) {
    if (seekSlider && duration > 0) {
      seekSlider.value = (currentTime / duration) * 100;
    }
    if (currentTimeSpan) {
      currentTimeSpan.textContent = formatSliderTime(currentTime);
    }
  }
  
  if (durationSpan && duration > 0) {
    durationSpan.textContent = formatSliderTime(duration);
  }
}

function initModal() {
  const modal = document.getElementById("video-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", closeVideoModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeVideoModal();
      }
    });
  }
  
  // Custom Controls Setup
  const mainVideo = document.getElementById("modal-main-video");
  const playPauseBtn = document.getElementById("control-play-pause");
  const seekSlider = document.getElementById("control-seek");
  const stepBackBtn = document.getElementById("control-step-back");
  const stepForwardBtn = document.getElementById("control-step-forward");
  const speedSelector = document.getElementById("control-speed");
  const qualitySelector = document.getElementById("control-quality");
  
  if (mainVideo) {
    // Play/Pause button click
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        if (mainVideo.paused) {
          mainVideo.play().catch(err => console.log(err));
        } else {
          mainVideo.pause();
        }
      });
    }
    
    // Video element click (toggle play/pause)
    mainVideo.addEventListener("click", () => {
      if (mainVideo.paused) {
        mainVideo.play().catch(err => console.log(err));
      } else {
        mainVideo.pause();
      }
    });
    
    // Sync play/pause state to UI
    mainVideo.addEventListener("play", updatePlayPauseUI);
    mainVideo.addEventListener("pause", updatePlayPauseUI);
    
    // Step buttons
    if (stepBackBtn) {
      stepBackBtn.addEventListener("click", () => {
        mainVideo.currentTime = Math.max(0, mainVideo.currentTime - (1 / 30));
      });
    }
    if (stepForwardBtn) {
      stepForwardBtn.addEventListener("click", () => {
        mainVideo.currentTime = Math.min(mainVideo.duration || 9999, mainVideo.currentTime + (1 / 30));
      });
    }
    
    // Speed control
    if (speedSelector) {
      speedSelector.addEventListener("change", (e) => {
        mainVideo.playbackRate = parseFloat(e.target.value);
      });
    }
    
    // Quality control
    if (qualitySelector) {
      qualitySelector.addEventListener("change", (e) => {
        if (!activeVideo) return;
        const quality = e.target.value;
        const curTime = mainVideo.currentTime;
        const isPaused = mainVideo.paused;
        
        let newSrc = activeVideo.filename;
        if (quality === "low") {
          newSrc = newSrc.replace(".mp4", "_360p.mp4");
        }
        
        mainVideo.src = newSrc;
        mainVideo.load();
        
        mainVideo.addEventListener("loadedmetadata", function onMetadata() {
          mainVideo.currentTime = curTime;
          if (speedSelector) {
            mainVideo.playbackRate = parseFloat(speedSelector.value);
          }
          updatePlayerUI();
          if (!isPaused) {
            mainVideo.play().catch(err => console.log(err));
          }
          mainVideo.removeEventListener("loadedmetadata", onMetadata);
        });
        
        updateSpecsDisplay(activeVideo, quality);
      });
    }
    
    // Slider timeline support
    mainVideo.addEventListener("timeupdate", updatePlayerUI);
    mainVideo.addEventListener("loadedmetadata", updatePlayerUI);
    mainVideo.addEventListener("durationchange", updatePlayerUI);
    
    if (seekSlider) {
      seekSlider.addEventListener("input", (e) => {
        isUserDraggingSlider = true;
        const duration = mainVideo.duration || 0;
        const pct = parseFloat(e.target.value);
        const targetTime = (pct / 100) * duration;
        const currentTimeSpan = document.getElementById("control-current-time");
        if (currentTimeSpan) {
          currentTimeSpan.textContent = formatSliderTime(targetTime);
        }
      });
      
      seekSlider.addEventListener("change", (e) => {
        const duration = mainVideo.duration || 0;
        const pct = parseFloat(e.target.value);
        mainVideo.currentTime = (pct / 100) * duration;
        
        // Brief delay before releasing control to let the browser execute the seek operation
        setTimeout(() => {
          isUserDraggingSlider = false;
        }, 150);
      });
    }
    
    // Telemetry and video update bindings
    mainVideo.addEventListener("play", startTelemetryUpdate);
    mainVideo.addEventListener("pause", stopTelemetryUpdate);
    mainVideo.addEventListener("timeupdate", updateTelemetryValues);
  }
  
  // Note Submission Setup
  const noteForm = document.getElementById("note-submit-form");
  if (noteForm) {
    noteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitNote();
    });
  }
  
  // Tab Switching inside Modal Sidebar
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tabId = btn.dataset.sidebarTab;
      document.querySelectorAll(".sidebar-tab-content").forEach(content => {
        content.classList.remove("active");
      });
      
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

function openVideoModal(video) {
  activeVideo = video;
  isUserDraggingSlider = false;
  const modal = document.getElementById("video-modal");
  const mainVideo = document.getElementById("modal-main-video");
  
  if (!modal || !mainVideo) return;
  
  // Set video source
  mainVideo.src = video.filename;
  mainVideo.load();
  
  // Reset speed selector
  const speedSelector = document.getElementById("control-speed");
  if (speedSelector) {
    speedSelector.value = "1";
    mainVideo.playbackRate = 1.0;
  }
  
  // Reset quality selector
  const qualitySelector = document.getElementById("control-quality");
  if (qualitySelector) {
    qualitySelector.value = "high";
  }
  
  // Reset play/pause UI and player times
  updatePlayPauseUI();
  updatePlayerUI();
  
  // Populate specifications tab
  updateSpecsDisplay(video, "high");
  
  // Populate Analysis & Code block tab
  const analysisMethod = document.getElementById("analysis-methodology");
  const analysisCode = document.getElementById("analysis-code-block");
  if (analysisMethod) analysisMethod.innerHTML = video.methodology;
  if (analysisCode) analysisCode.textContent = video.codeSnippet;
  
  // Enable HUD
  const hud = document.getElementById("video-hud");
  if (hud) {
    hud.className = "hud-overlay active";
  }
  
  // Load and render existing notes
  renderNotesList();
  
  // Open modal
  modal.classList.add("active");
  mainVideo.play().catch(err => console.log("Auto-play blocked or failed", err));
}

function closeVideoModal() {
  const modal = document.getElementById("video-modal");
  const mainVideo = document.getElementById("modal-main-video");
  
  if (mainVideo) {
    mainVideo.pause();
    mainVideo.src = "";
  }
  
  if (modal) {
    modal.classList.remove("active");
  }
  
  stopTelemetryUpdate();
  activeVideo = null;
}

// Note System
function getNotesKey() {
  return `docketrun_notes_${activeVideo ? activeVideo.id : 'unknown'}`;
}

function getNotes() {
  const key = getNotesKey();
  const notes = localStorage.getItem(key);
  return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
  const key = getNotesKey();
  localStorage.setItem(key, JSON.stringify(notes));
}

function renderNotesList() {
  const notesList = document.getElementById("notes-list");
  if (!notesList) return;
  
  notesList.innerHTML = "";
  const notes = getNotes();
  
  if (notes.length === 0) {
    notesList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 24px; font-size: 0.85rem;">
        No analysis notes yet. Enter a note below to log observations.
      </div>
    `;
    return;
  }
  
  // Sort notes by timestamp
  notes.sort((a, b) => a.time - b.time);
  
  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-item";
    
    div.innerHTML = `
      <div class="note-header">
        <span class="note-time" onclick="seekToTime(${note.time})">${formatTime(note.time)}</span>
        <button class="note-delete" onclick="deleteNote(${index})">Delete</button>
      </div>
      <div class="note-body">${escapeHTML(note.text)}</div>
    `;
    notesList.appendChild(div);
  });
}

function submitNote() {
  const noteInput = document.getElementById("note-text-input");
  const mainVideo = document.getElementById("modal-main-video");
  if (!noteInput || !mainVideo) return;
  
  const text = noteInput.value.trim();
  if (!text) return;
  
  const time = mainVideo.currentTime;
  const notes = getNotes();
  notes.push({ time, text });
  saveNotes(notes);
  
  noteInput.value = "";
  renderNotesList();
}

window.deleteNote = function(index) {
  const notes = getNotes();
  notes.splice(index, 1);
  saveNotes(notes);
  renderNotesList();
};

window.seekToTime = function(seconds) {
  const mainVideo = document.getElementById("modal-main-video");
  if (mainVideo) {
    mainVideo.currentTime = seconds;
    mainVideo.play().catch(e => {});
  }
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Custom Simulation Telemetry Generator
function startTelemetryUpdate() {
  if (telemetryInterval) clearInterval(telemetryInterval);
  telemetryInterval = setInterval(updateTelemetryValues, 100);
}

function stopTelemetryUpdate() {
  if (telemetryInterval) {
    clearInterval(telemetryInterval);
    telemetryInterval = null;
  }
}

function updateTelemetryValues() {
  const mainVideo = document.getElementById("modal-main-video");
  if (!mainVideo || !activeVideo) return;
  
  const t = mainVideo.currentTime;
  const pct = t / (mainVideo.duration || activeVideo.durationSeconds);
  
  let altitude = 0.00;
  let speed = 0.00;
  let pitch = 0.0;
  let roll = 0.0;
  let yaw = 0.0;
  let battery = 99.5;
  let satellites = 12;
  let flightMode = "STANDBY";
  let wifiStrength = 100;
  
  const type = activeVideo.telemetryType;
  
  if (type === "drone_addc") {
    satellites = 16;
    battery = Math.max(12.0, 98.4 - (pct * 25));
    
    if (pct < 0.05) {
      flightMode = "TAKEOFF";
      altitude = pct * 20 * 15;
      speed = pct * 20 * 2.5;
      pitch = 2.4;
      yaw = 45.2;
    } else if (pct < 0.85) {
      flightMode = "WAYPOINT";
      altitude = 15.0 + Math.sin(t * 0.1) * 0.4;
      speed = 7.2 + Math.cos(t * 0.2) * 0.5;
      pitch = -4.5 + Math.sin(t * 0.5) * 1.5;
      roll = 2.1 + Math.cos(t * 0.5) * 2.0;
      yaw = (45.2 + t * 2) % 360;
    } else if (pct < 0.98) {
      flightMode = "LANDING";
      const landPct = (pct - 0.85) / 0.13;
      altitude = 15.0 * (1 - landPct);
      speed = 1.2 * (1 - landPct);
      pitch = 0.5;
      roll = -0.5;
      yaw = 180.0;
    } else {
      flightMode = "LANDED";
      altitude = 0.0;
      speed = 0.0;
      pitch = 0.0;
      roll = 0.0;
      yaw = 180.0;
    }
  } 
  else if (type === "drone_serpent") {
    satellites = 14;
    battery = Math.max(8.0, 96.0 - (pct * 40));
    flightMode = "AUTO_PATH";
    
    altitude = 4.2 + Math.sin(t * 0.05) * 0.2;
    speed = 5.2 + Math.abs(Math.sin(t * 0.4)) * 1.8;
    roll = Math.sin(t * 0.3) * 18.5; 
    pitch = -5.0 + Math.cos(t * 0.3) * 4.0;
    yaw = (90 + Math.sin(t * 0.15) * 45) % 360;
    
    if (Math.abs(roll) > 15.0) {
      wifiStrength = 85;
    }
  } 
  else if (type === "drone_bug") {
    satellites = 15;
    battery = 88.2 - (pct * 12);
    
    if (pct < 0.10) {
      flightMode = "GUIDED";
      altitude = t * 1.5;
      speed = 2.0;
      roll = 0.5;
      pitch = 1.2;
      yaw = 12.0;
    } else if (pct < 0.70) {
      flightMode = "AUTO_NAV";
      altitude = 12.0 + Math.sin(t * 0.2) * 0.3;
      speed = 6.8;
      roll = 1.5 + Math.sin(t * 0.5) * 1.0;
      pitch = -3.2 + Math.cos(t * 0.5) * 1.0;
      yaw = 15.2;
    } else if (pct < 0.90) {
      flightMode = "ATTITUDE_FAIL";
      altitude = 11.2 + Math.sin(t * 1.2) * 1.8;
      speed = 4.5 + Math.cos(t * 1.5) * 2.0;
      
      const oscFactor = (pct - 0.70) / 0.20;
      roll = Math.sin(t * 4.0) * (5.0 + oscFactor * 45.0);
      pitch = Math.cos(t * 4.5) * (3.0 + oscFactor * 35.0);
      yaw = (15.2 + t * 45) % 360;
      satellites = Math.max(6, 15 - Math.floor(oscFactor * 8));
    } else {
      flightMode = "CRASHED";
      altitude = 0.0;
      speed = 0.0;
      roll = 0.0;
      pitch = 0.0;
      yaw = 0.0;
      satellites = 0;
      battery = 18.5;
      wifiStrength = 0;
    }
  } 
  else if (type === "agribot") {
    satellites = 18;
    battery = 94.2 - (pct * 5);
    flightMode = "ROW_ALIGN";
    altitude = 0.05;
    
    speed = 1.2 + Math.sin(t * 0.3) * 0.15;
    roll = 0.8 * Math.sin(t * 0.5);
    pitch = -0.5 + 0.4 * Math.cos(t * 0.8);
    yaw = (342.5 + Math.sin(t * 0.1) * 3) % 360;
  }
  
  const elAlt = document.getElementById("hud-alt");
  const elSpeed = document.getElementById("hud-speed");
  const elRoll = document.getElementById("hud-roll");
  const elPitch = document.getElementById("hud-pitch");
  const elYaw = document.getElementById("hud-yaw");
  const elSat = document.getElementById("hud-sat");
  const elMode = document.getElementById("hud-mode");
  const elBattery = document.getElementById("hud-battery");
  const elWifi = document.getElementById("hud-wifi");
  const elTime = document.getElementById("hud-flight-time");
  
  if (elAlt) elAlt.textContent = altitude.toFixed(2) + " m";
  if (elSpeed) elSpeed.textContent = speed.toFixed(2) + " m/s";
  if (elRoll) elRoll.textContent = roll.toFixed(1) + "°";
  if (elPitch) elPitch.textContent = pitch.toFixed(1) + "°";
  if (elYaw) elYaw.textContent = yaw.toFixed(1) + "°";
  if (elSat) elSat.textContent = satellites;
  if (elMode) {
    elMode.textContent = flightMode;
    elMode.className = "hud-val";
    if (flightMode.includes("FAIL") || flightMode === "ATTITUDE_FAIL") {
      elMode.classList.add("warning");
    } else if (flightMode === "CRASHED") {
      elMode.classList.add("critical");
    }
  }
  if (elBattery) elBattery.textContent = battery.toFixed(1) + "%";
  if (elWifi) elWifi.textContent = wifiStrength + "%";
  if (elTime) elTime.textContent = formatTime(t);
  
  const pitchLines = document.querySelectorAll(".pitch-line");
  pitchLines.forEach(line => {
    const deg = parseFloat(line.getAttribute("data-deg"));
    const offset = (deg - pitch) * 3;
    line.style.transform = `translateY(${offset}px)`;
  });
}

// Side-by-Side Video Comparison
function initCompare() {
  const select1 = document.getElementById("compare-select-1");
  const select2 = document.getElementById("compare-select-2");
  const video1 = document.getElementById("compare-video-1");
  const video2 = document.getElementById("compare-video-2");
  const syncBtn = document.getElementById("sync-compare-btn");
  
  if (!select1 || !select2 || !video1 || !video2) return;
  
  // Populate selectors
  const populate = (selectElement) => {
    selectElement.innerHTML = '<option value="">-- Choose Video Run --</option>';
    videosData.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v.filename;
      opt.textContent = v.title;
      selectElement.appendChild(opt);
    });
  };
  
  populate(select1);
  populate(select2);
  
  // Set defaults
  select1.value = "videos/addc_2025_drone.mp4";
  loadCompareVideo(1, "videos/addc_2025_drone.mp4");
  
  select2.value = "videos/aerothon_bug.mp4";
  loadCompareVideo(2, "videos/aerothon_bug.mp4");
  
  select1.addEventListener("change", (e) => loadCompareVideo(1, e.target.value));
  select2.addEventListener("change", (e) => loadCompareVideo(2, e.target.value));
  
  // Sync button logic
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      syncCompare = !syncCompare;
      if (syncCompare) {
        syncBtn.classList.add("active");
        video2.currentTime = video1.currentTime;
      } else {
        syncBtn.classList.remove("active");
      }
    });
  }
  
  // Synchronization event tracking
  video1.addEventListener("play", () => {
    if (syncCompare) video2.play().catch(e=>{});
  });
  video1.addEventListener("pause", () => {
    if (syncCompare) video2.pause();
  });
  video1.addEventListener("seeking", () => {
    if (syncCompare) video2.currentTime = video1.currentTime;
  });
  video1.addEventListener("ratechange", () => {
    if (syncCompare) video2.playbackRate = video1.playbackRate;
  });
  
  video2.addEventListener("play", () => {
    if (syncCompare) video1.play().catch(e=>{});
  });
  video2.addEventListener("pause", () => {
    if (syncCompare) video1.pause();
  });
  video2.addEventListener("seeking", () => {
    if (syncCompare) video1.currentTime = video2.currentTime;
  });
}

function loadCompareVideo(index, filename) {
  const container = document.getElementById(`compare-viewport-${index}`);
  const video = document.getElementById(`compare-video-${index}`);
  
  if (!container || !video) return;
  
  if (!filename) {
    video.src = "";
    video.style.display = "none";
    let placeholder = container.querySelector(".compare-placeholder");
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.className = "compare-placeholder";
      placeholder.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M15 10.5l4.7-4.7c.3-.3.8-.1.8.4v11.6c0 .5-.5.7-.8.4L15 13.5v-3zM4.5 18h9c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5h-9C3.7 6 3 6.7 3 7.5v9c0 .8.7 1.5 1.5 1.5z"/></svg>
        <p>No video loaded</p>
      `;
      container.appendChild(placeholder);
    } else {
      placeholder.style.display = "flex";
    }
    return;
  }
  
  const placeholder = container.querySelector(".compare-placeholder");
  if (placeholder) placeholder.style.display = "none";
  
  video.style.display = "block";
  video.src = filename;
  video.load();
}

// Interactive Simulation Logs (Terminal)
function initTerminal() {
  const term = document.getElementById("terminal-view-box");
  if (!term) return;
  
  const logEntries = [
    { type: "info", text: "[rosinit] Initializing ROS node logger..." },
    { type: "info", text: "[rosinit] Setting Master URI to http://127.0.0.1:11311/" },
    { type: "success", text: "[rosinit] Connected to ROS Master node. Status: ACTIVE" },
    { type: "info", text: "[rosrun] Spawning gazebo_ros physics simulator..." },
    { type: "success", text: "[gazebo] Sim world Loaded: 'docketrun_drone_arena.world'" },
    { type: "info", text: "[drone_controller] Initializing Mavlink interface on port 14540..." },
    { type: "success", text: "[drone_controller] Pixhawk telemetry established. Firmware PX4 v1.14" },
    { type: "cmd", text: "roslaunch docketrun_gazebo_sim drone_delivery_mission.launch" },
    { type: "info", text: "[drone_delivery] Launching vision processing pipelines..." },
    { type: "success", text: "[yolo_vision] YOLO11s license-plate/obstacle model loaded on GPU (0.015s latency)" },
    { type: "success", text: "[qr_detector] ZXing QR code detection initialized at 15Hz" },
    { type: "info", text: "[state_machine] State changed: STANDBY -> ARMED" },
    { type: "info", text: "[drone_controller] Executing Takeoff command to alt: 15.0m..." },
    { type: "success", text: "[drone_controller] Target altitude reached. Holding position (Error: +/-0.08m)" },
    { type: "info", text: "[state_machine] State changed: ARMED -> FLIGHT_WAYPOINT" },
    { type: "info", text: "[navigation] Tracking waypoint 1: lat=12.9716, lon=77.5946, alt=15m" },
    { type: "info", text: "[navigation] Waypoint 1 reached. Yaw correction: -12.4 deg" },
    { type: "info", text: "[navigation] Tracking waypoint 2: lat=12.9720, lon=77.5950, alt=15m" },
    { type: "warning", text: "[navigation] Wind gust detected (force=12.4 knots). Path deviation correction active." },
    { type: "info", text: "[navigation] Waypoint 2 reached. Searching target landing hotspot..." },
    { type: "success", text: "[qr_detector] Hotspot QR code localized! ID: TARGET_DOCK_2025" },
    { type: "info", text: "[state_machine] State changed: FLIGHT_WAYPOINT -> PRECISION_LAND" },
    { type: "info", text: "[drone_controller] Descending vertically. Camera lock: active" },
    { type: "info", text: "[drone_controller] Touchdown confirmation. Disarming motors..." },
    { type: "success", text: "[state_machine] Mission Completed. Flight telemetry files exported successfully." }
  ];
  
  let lineIdx = 0;
  term.innerHTML = "";
  
  function addLine() {
    if (lineIdx >= logEntries.length) {
      lineIdx = 0;
      term.innerHTML = "";
    }
    
    const item = logEntries[lineIdx];
    const div = document.createElement("div");
    div.className = `log-line`;
    
    // Add prefix timestamps and types to matching styling of the logs tab
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + now.getMilliseconds().toString().padStart(3, '0');
    
    let levelClass = "info";
    let levelText = "INFO";
    if (item.type === "success") { levelClass = "success"; levelText = "SUCCESS"; }
    else if (item.type === "warning") { levelClass = "warn"; levelText = "WARN"; }
    else if (item.type === "error") { levelClass = "error"; levelText = "ERROR"; }
    else if (item.type === "cmd") { levelClass = "info"; levelText = "CMD"; }
    
    div.innerHTML = `
      <span class="log-time">${timeStr}</span>
      <span class="log-node">[docketrun_node]</span>
      <span class="log-level ${levelClass}">${levelText}</span>
      <span class="log-msg">${item.text}</span>
    `;
    
    term.appendChild(div);
    term.scrollTop = term.scrollHeight;
    
    lineIdx++;
    setTimeout(addLine, item.type === "cmd" ? 2500 : 800 + Math.random() * 1000);
  }
  
  addLine();
}

function updateSpecsDisplay(video, quality) {
  const specFilename = document.getElementById("spec-filename");
  const specResolution = document.getElementById("spec-resolution");
  const specFilesize = document.getElementById("spec-filesize");
  const specCodec = document.getElementById("spec-codec");
  const specFps = document.getElementById("spec-fps");
  
  if (!video) return;
  
  let fname = video.filename.split('/').pop();
  let res = video.resolution;
  let size = video.size;
  
  if (quality === "low") {
    fname = fname.replace(".mp4", "_360p.mp4");
    res = "640x360 (Low Quality)";
    const sizeMap = {
      "addc_2025_drone": "10.4 MB",
      "aerothon_serpent": "22.1 MB",
      "aerothon_bug": "11.1 MB",
      "agribot_nav": "0.6 MB"
    };
    size = sizeMap[video.id] || "Low Quality";
  }
  
  if (specFilename) specFilename.textContent = fname;
  if (specResolution) specResolution.textContent = res;
  if (specFilesize) specFilesize.textContent = size;
  if (specCodec) specCodec.textContent = video.codec;
  if (specFps) specFps.textContent = video.fps + " FPS";
}
