
img.addEventListener("click", () => {
  modal.style.display = "flex";
  modalImg.src = img.src;
  modalTitle.textContent = img.alt; // ← This sets the title
  modalCaption.textContent = getDescription(img.alt);
  modalDrafts.innerHTML = getDraftImages(img.alt);
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalCaption = document.getElementById("modalCaption");
  const modalDrafts = document.getElementById("modalDrafts");
  const closeBtn = document.querySelector(".close");

  let zoomed = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX, startY;

document.querySelectorAll(".carousel img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    modalTitle.textContent = img.alt;
    modalCaption.textContent = getDescription(img.alt);
    modalDrafts.innerHTML = getDraftImages(img.alt);
    
    modalDrafts.querySelectorAll("img").forEach(draftImg => {
  draftImg.addEventListener("click", () => {
    modalImg.src = draftImg.src;
    modalDrafts.querySelectorAll("img").forEach(img => img.classList.remove("active"));
    draftImg.classList.add("active");
  });
});


    // Reset zoom state
    zoomed = false;
    modalImg.style.transform = "scale(1)";
    modalImg.style.cursor = "grab";
  });
});


  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  modalImg.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing modal when clicking image
    zoomed = !zoomed;
    if (zoomed) {
      modalImg.classList.add("zoomed");
      modalImg.style.transform = "scale(2)";
      modalImg.style.cursor = "grabbing";
      modalImg.style.position = "relative";
    } else {
      modalImg.classList.remove("zoomed");
      modalImg.style.transform = "scale(1)";
      modalImg.style.left = "0px";
      modalImg.style.top = "0px";
      offsetX = 0;
      offsetY = 0;
    }
  });

  modalImg.addEventListener("mousedown", (e) => {
    if (!zoomed) return;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    modalImg.style.cursor = "grabbing";

    const onMouseMove = (e) => {
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      modalImg.style.transform = `scale(2) translate(${offsetX}px, ${offsetY}px)`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      modalImg.style.cursor = "grab";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function getDescription(title) {
    const descriptions = {
      "3D Print PH": "This 3D print project, codenamed 'PH', involved iterative prototyping of a mechanical part designed for modular assembly...",
      "3D Print SM": "The 'SM' project focused on creating a compact structural module with interlocking features. The final print used PETG for durability and flexibility. SM1 and SM2 document early attempts with different wall thicknesses and connector geometries.",
      "3D Print SH": "The 'SH' series explored shell-based geometries for lightweight enclosures. SH (Final) represents the final iteration, while SH1–SH3 show earlier versions with incomplete edge resolution and uneven layering.",
      "3D Print GCH": "The 'GCH' series focused on geometric channel housing for fluid or wire routing. GCH1 represents the final optimized print, while GCH2 through GCH7 show earlier iterations with varying channel widths, wall thicknesses, and support strategies. The project emphasized internal flow efficiency and print reliability across multiple slicing profiles.",
    };
    return descriptions[title] || "No description available.";
  }


  
function getDraftImages(title) {
  const drafts = {
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
      "3DPrintImages/GCH1.jpg",
      "3DPrintImages/GCH2.jpg",
      "3DPrintImages/GCH3.jpg",
      "3DPrintImages/GCH4.jpg",
      "3DPrintImages/GCH5.jpg",
      "3DPrintImages/GCH6.jpg",
      "3DPrintImages/GCH7.jpg"
    ]
  };
  if (!drafts[title]) return "";
  return drafts[title].map(src => `<img src="${src}" alt="Draft of ${title}" />`).join("");
}

});

document.getElementById("resetZoom").addEventListener("click", () => {
  zoomed = false;
  modalImg.classList.remove("zoomed");
  modalImg.style.transform = "scale(1)";
  offsetX = 0;
  offsetY = 0;
});
