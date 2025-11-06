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
      "Art Hogwarts": "A digital illustration capturing the magical essence of Hogwarts School of Witchcraft and Wizardry, featuring its iconic architecture set against a mystical backdrop that evokes a sense of wonder and adventure.",
      "Laser Cut Hopper": "This project challenged me to combine bioinspired mechanics with a motorcycle-inspired form, resulting in a spring-powered hopper that jumps vertically using a rotating body. Inspired by a mixture of the leaping jaguar and the mechanism of a click beetle, the design taught me valuable skills in prototyping and laser cutting, while exploring how motion and energy interact in a compact system.",
      "3D Print SH": "This was my first project in 3D printing. I didn’t have enough hangers for my room, so I decided to print one myself. I found a design online and asked some of the scouts for help understanding the process. They introduced me to Bamboo Studio and Fusion 360. I started learning Fusion 360 and successfully imported the hanger file. I learned about the roots that hold the print together during printing, and how to remove them afterward. The hanger was adjustable, it could close inward to become portable, so it came in multiple parts. After printing, I removed the roots and added screws to assemble the bodies. Once it was put together, I was able to open and close it successfully. This project taught me the basics of slicing, importing, and assembling multi-part prints.",
      "3D Print SM": "This was my second project, and it was the first one I designed entirely from scratch. I found inspiration online for a toilet paper holder and decided to create a silhouette of a strong guy holding a barbell. The toilet paper rolls would sit on both ends of the bar, like weights. I modeled the figure and added my initials to the back. After printing, I had a fully functional and visually striking toilet paper holder. It was a creative blend of utility and sculpture, and it felt great to bring my own idea to life without relying on a pre-made file.",
      "3D Print PH": "The phone holder project was my first time editing an existing design. I found a model online that looked promising, but it was too small and short to be usable. I exported the file and brought it into Fusion 360, where I stretched it out, made it taller, and adjusted the dimensions to better fit my phone. I also customized it a bit to make it more personal. After some trial and error with scaling, I successfully printed the updated version. This was a big step for me, moving from using downloaded models to modifying them for my own needs.",
      "3D Print GCH": "This project started with a game card holder I found online. It was shaped like a toaster and designed to push out game cards. I really wanted one, so I printed the original model. It was more complex than my earlier projects because it didn’t come in separate parts. After printing it, I decided to create my own version from scratch. I modeled a new design that could hold a large number of game cards and scaled it precisely to fit them. This was one of my most advanced and useful prints, and it showed me how far I’d come in designing functional objects from the ground up.",
      "Art Hike1": "This digital drawing series captures the layered emotions and quiet solitude of hiking through foggy landscapes. Each piece explores different moods and compositions, from misty peaks to winding trails, using soft gradients and subtle textures to evoke depth and introspection.",
      "Art Fall": "This series of digital artworks explores the vibrant colors and dynamic forms of autumn. Each piece captures different aspects of the fall season, from swirling leaves to misty landscapes, using a mix of bold brushstrokes and delicate textures to evoke the feeling of change and transition.",
      "Art Game Friends": "A series exploring the cozy atmosphere of friends gathering to play games together, capturing the warm social connections and relaxed joy of shared gaming experiences.",
      "Art Bubbles": "An exploration of light, transparency, and playful forms through the simple subject of bubbles, experimenting with different lighting conditions and color palettes.",
      "Art Couch": "A cozy scene depicting a comfortable couch, emphasizing warmth and relaxation through soft textures and inviting colors.",
      "Art Food1": "A vibrant digital illustration showcasing a variety of delicious foods arranged artfully, highlighting textures and colors to evoke a sense of appetite and culinary delight.",
      "Art Mafia": "A comic series that delves into the humorous and dramatic escapades of a quirky group involved in the art world, blending satire with vibrant illustrations to bring the characters and their stories to life.",
      "Art Parodies": "A digital artwork portraying a character embodying strength and resilience, set against a dynamic backdrop that emphasizes movement and power through bold lines and contrasting colors.",
      "Art Cat": "A charming digital illustration capturing the playful and curious nature of a cat, using soft textures and warm colors to evoke a sense of comfort and companionship.",
      "Art Bus Wait": "This digital piece depicts the quiet anticipation of waiting for a bus, focusing on urban elements and subtle lighting to convey a mood of solitude amidst the hustle of city life.",
      "Art Christmas 1": "A festive digital artwork celebrating the holiday season, featuring vibrant colors and joyful themes that capture the warmth and excitement of Christmas festivities."
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
      "Art Parodies": [
        "Images/Art One Piece.png",
        "Images/Art Squid Game.png",
        "Images/Art Cowboy Bebop.png",
        "images/art adventure time.png",
        "Images/ARt South Park.png",

      ],
      "Art Christmas 1": [
        "Images/Art Christmas 2.png",
        "Images/Art Christmas 3.png"
      ],
      "Art Hogwarts": [

        "Images/Art Hogwarts 3.png",
        "Images/Art Hogwarts 2.jpg",

      ],
      "Art Mafia": [
        "Images/Art Mafia Comic1.png",
        "Images/Art Mafia Comic2.png",
        "Images/Art Mafia Comic3.png",
      ],
      "Art Food1": [
        "Images/Art Food2.jpg",
        "Images/Art Food3.jpg",
        "Images/Art Food4.jpg"
      ],
      "Art Game Channel": [
        "Images/Art Couch2.png",
        "Images/Art DN.png",
        "Images/Art DS.png"
      ],

      "Art Fall": [
        "Images/Art Fall2.jpg"
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