// Modal state and behavior
const modalState = {
  currentDraftSet: [],
  currentDraftIndex: 0,
  zoomed: false,
  offsetX: 0,
  offsetY: 0,
  startX: 0,
  startY: 0
};

document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCaption = document.getElementById("modalCaption");
  const modalDrafts = document.getElementById("modalDrafts");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.getElementById("prevDraft");
  const nextBtn = document.getElementById("nextDraft");
  const resetZoomBtn = document.getElementById("resetZoom");

  // Add click handlers to ALL images (gallery + carousel)
  document.querySelectorAll(".carousel img, .gallery img").forEach(img => {
    img.addEventListener("click", () => {
      openModal(img);
    });
  });

  function openModal(img) {
    // Set up initial modal content
    modal.style.display = "flex";
    modalTitle.textContent = img.alt;
    modalCaption.textContent = getDescription(img.alt);
    
    // Get draft images and set up thumbnails
    const draftsHtml = getDraftImages(img.alt);
    modalDrafts.innerHTML = draftsHtml;

    // Set up the draft set (main image + all drafts)
    const draftImgs = modalDrafts.querySelectorAll("img");
    modalState.currentDraftSet = [img.src, ...Array.from(draftImgs).map(d => d.src)];
    modalState.currentDraftIndex = 0;
    showDraft(0);

    // Add click handlers to thumbnails
    draftImgs.forEach((draftImg, i) => {
      draftImg.addEventListener("click", () => {
        showDraft(i + 1); // +1 because main image is index 0
      });
    });
  }

  function showDraft(index) {
    if (modalState.currentDraftSet.length === 0) return;
    
    // Update index with wrap-around
    modalState.currentDraftIndex = ((index % modalState.currentDraftSet.length) + modalState.currentDraftSet.length) % modalState.currentDraftSet.length;
    
    // Update main image
    modalImg.src = modalState.currentDraftSet[modalState.currentDraftIndex];
    
    // Reset zoom state
    modalState.zoomed = false;
    modalImg.classList.remove("zoomed");
    modalImg.style.transform = "scale(1)";
    modalImg.style.cursor = "grab";
    modalState.offsetX = 0;
    modalState.offsetY = 0;
    
    // Highlight active thumbnail
    modalDrafts.querySelectorAll("img").forEach((img, i) => {
      img.classList.toggle("active", i === modalState.currentDraftIndex - 1);
    });
  }

  // Navigation event listeners
  prevBtn.addEventListener("click", () => {
    showDraft(modalState.currentDraftIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showDraft(modalState.currentDraftIndex + 1);
  });

  // Close modal handlers
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Zoom functionality
  modalImg.addEventListener("click", (e) => {
    e.stopPropagation();
    modalState.zoomed = !modalState.zoomed;
    if (modalState.zoomed) {
      modalImg.classList.add("zoomed");
      modalImg.style.transform = "scale(2)";
      modalImg.style.cursor = "grab";
    } else {
      modalImg.classList.remove("zoomed");
      modalImg.style.transform = "scale(1)";
      modalState.offsetX = 0;
      modalState.offsetY = 0;
    }
  });

  // Pan functionality when zoomed
  modalImg.addEventListener("mousedown", (e) => {
    if (!modalState.zoomed) return;
    e.preventDefault();
    modalState.startX = e.clientX - modalState.offsetX;
    modalState.startY = e.clientY - modalState.offsetY;
    modalImg.style.cursor = "grabbing";

    const onMouseMove = (e) => {
      modalState.offsetX = e.clientX - modalState.startX;
      modalState.offsetY = e.clientY - modalState.startY;
      modalImg.style.transform = `scale(2) translate(${modalState.offsetX}px, ${modalState.offsetY}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (modalState.zoomed) {
        modalImg.style.cursor = "grab";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // Reset zoom button
  resetZoomBtn.addEventListener("click", () => {
    modalState.zoomed = false;
    modalImg.classList.remove("zoomed");
    modalImg.style.transform = "scale(1)";
    modalState.offsetX = 0;
    modalState.offsetY = 0;
    modalImg.style.cursor = "grab";
  });

  // Burger menu toggle
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }

  // Helper functions
  function getDescription(title) {
    const descriptions = {
      "Laser Cut Hopper": "This project challenged me to combine bioinspired mechanics with a motorcycle-inspired form, resulting in a spring-powered hopper that jumps vertically using a rotating body. Inspired by a mixture of the leaping jaguar and the mechanism of a click beetle, the design taught me valuable skills in prototyping and laser cutting, while exploring how motion and energy interact in a compact system.",
      "3D Print PH": "This 3D print project, codenamed 'PH', involved iterative prototyping of a mechanical part designed for modular assembly. The final iteration achieved optimal strength-to-weight ratio through strategic infill patterns and wall thickness adjustments.",
      "3D Print SM": "The 'SM' project focused on creating a compact structural module with interlocking features. The final print used PETG for durability and flexibility. SM1 and SM2 document early attempts with different wall thicknesses and connector geometries.",
      "3D Print SH": "The 'SH' series explored shell-based geometries for lightweight enclosures. SH (Final) represents the final iteration, while SH1–SH3 show earlier versions with incomplete edge resolution and uneven layering.",
      "3D Print GCH": "The 'GCH' series focused on geometric channel housing for fluid or wire routing. GCH1 represents the final optimized print, while GCH2 through GCH7 show earlier iterations with varying channel widths, wall thicknesses, and support strategies. The project emphasized internal flow efficiency and print reliability across multiple slicing profiles.",
      "Art Hike1": "This digital drawing series captures the layered emotions and quiet solitude of hiking through foggy landscapes. Each piece explores different moods and compositions, from misty peaks to winding trails, using soft gradients and subtle textures to evoke depth and introspection.",
      "Art Fall": "This series of digital artworks explores the vibrant colors and dynamic forms of autumn. Each piece captures different aspects of the fall season, from swirling leaves to misty landscapes, using a mix of bold brushstrokes and delicate textures to evoke the feeling of change and transition.",
      "Art Game Friends": "A series exploring the cozy atmosphere of friends gathering to play games together, capturing the warm social connections and relaxed joy of shared gaming experiences.",
      "Art Bubbles": "An exploration of light, transparency, and playful forms through the simple subject of bubbles, experimenting with different lighting conditions and color palettes."
    };
    return descriptions[title] || "No description available.";
  }

  function getDraftImages(title) {
    const drafts = {
      "Laser Cut Hopper": [
        "LaserCutImages/Hopper Springs.jpg",
        "LaserCutImages/Hopper Up.png",
        "LaserCutImages/Old.jpg",
        "LaserCutImages/Zoom in.jpg"
      ],
      "Art Game Friends": [
        "Images/Draft_GameFriends1.png",
        "Images/Draft_GameFriends2.png"
      ],
      "Art Fall": [
        "Images/Art Fall.png",
        "Images/Art Fall2.png"
      ],
      "Art Bubbles": [
        "Images/Draft_Bubbles1.png"
      ],
      "3D Print PH": [
        "3DPrintImages/PH1.jpg",
        "3DPrintImages/PH2.jpg",
        "3DPrintImages/PH3.jpg",
        "3DPrintImages/PH4.jpg",
        "3DPrintImages/PH5.jpg"
      ],
      "3D Print SM": [
        "3DPrintImages/SM1.jpg",
        "3DPrintImages/SM2.jpg"
      ],
      "3D Print SH": [
        "3DPrintImages/SH1.jpg",
        "3DPrintImages/SH2.jpg",
        "3DPrintImages/SH3.jpg"
      ],
      "3D Print GCH": [
        "3DPrintImages/GCH2.jpg",
        "3DPrintImages/GCH3.jpg",
        "3DPrintImages/GCH4.jpg",
        "3DPrintImages/GCH5.jpg",
        "3DPrintImages/GCH6.jpg",
        "3DPrintImages/GCH7.jpg"
      ],
      "Art Hike1": [
        "Images/Art Hike2.png",
        "Images/Art Hike3.png",
        "Images/Art Hike4.png"
      ]
    };
    if (!drafts[title]) return "";
    return drafts[title].map(src => `<img src="${src}" alt="Draft of ${title}" />`).join("");
  }
});