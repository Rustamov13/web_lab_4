document.addEventListener("DOMContentLoaded", () => {
  const resumeData = {
    education: [],
    skills: [],
    languages: [],
    workExperience: [],
    references: [],
    profile: "",
    contact: ""
  };


  const nameEl = document.getElementById("name");
  const nameText = nameEl.textContent.trim();
  nameEl.textContent = "";
  nameText.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.display = "inline-block";
    span.style.opacity = "0";
    span.style.transform = "translateX(-50px)";
    span.style.animation = `slideIn 0.5s ease-out forwards ${i * 0.105}s`;
    nameEl.appendChild(span);
  });


  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".section").forEach(section => {
    const sectionName = section.dataset.section;
    const contentEl = section.querySelector(".content");


    if (!section.querySelector(".save-btn")) {
      if (sectionName !== "profile" && sectionName !== "contact") {
        const addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.textContent = "Add";
        section.appendChild(addBtn);
      }

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-btn";
      saveBtn.textContent = "Save";
      section.appendChild(saveBtn);

      if (sectionName === "profile" || sectionName === "contact") {
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        section.appendChild(editBtn);
      }
    }


    const saved = localStorage.getItem("resume-" + sectionName);
    if (saved) {
      contentEl.innerHTML = saved;
    }


    if (!["profile", "contact"].includes(sectionName)) {
      const items = contentEl.querySelectorAll("div, p");
      items.forEach(el => {
        resumeData[sectionName].push(el.innerText.trim());
      });
    } else {
      resumeData[sectionName] = contentEl.innerText.trim();
    }
  });


  document.body.addEventListener("click", e => {
    const sectionEl = e.target.closest(".section");
    if (!sectionEl) return;
    const sectionName = sectionEl.dataset.section;
    const contentEl = sectionEl.querySelector(".content");

    // Save
    if (e.target.classList.contains("save-btn")) {
      const html = contentEl.innerHTML;
      localStorage.setItem("resume-" + sectionName, html);
      alert("Saved!");
      return;
    }

    // Add
    if (e.target.classList.contains("add-btn")) {
      const text = prompt("Enter new item:");
      if (text) {
        const div = document.createElement("div");
        div.textContent = text + " ";
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        div.appendChild(editBtn);
        contentEl.appendChild(div);
      }
      return;
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {
      const target = e.target.closest(".section");
      const content = target.querySelector(".content");

      if (sectionName === "profile" || sectionName === "contact") {
        const text = prompt("Edit text:", content.innerText.trim());
        if (text != null) {
          content.innerHTML = `<p>${text}</p>`;
        }
      } else {
        const div = e.target.closest("div");
        const newText = prompt("Edit item:", div.firstChild.textContent.trim());
        if (newText) {
          div.firstChild.textContent = newText + " ";
        }
      }
      return;
    }
  });
});
