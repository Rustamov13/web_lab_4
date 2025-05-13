document.addEventListener('DOMContentLoaded', () => {
    // Verilerin yerel depolamadan alınması
    function loadDataFromLocalStorage() {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        return JSON.parse(savedData);
      } else {
        return {
          contact: { phone: '', email: '', location: '', website: '' },
          education: [],
          skills: [],
          languages: [],
          profile: '',
          workExperience: [],
          references: []
        };
      }
    }
  
    // Verilerin yerel depolamaya kaydedilmesi
    function saveDataToLocalStorage() {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  
    // Sayfa yüklendiğinde verileri yükle
    let resumeData = loadDataFromLocalStorage();
  
    // Dinamik olarak verileri render et
    function renderAll() {
      renderSection('.contact', `
        <h2>CONTACT</h2>
        <p>${resumeData.contact.phone}</p>
        <p>${resumeData.contact.email}</p>
        <p>${resumeData.contact.location}</p>
        <p>${resumeData.contact.website}</p>
      `);
  
      renderSection('#education', `
        <h2>EDUCATION</h2>
        ${resumeData.education.map((ed, i) => `
          <div class="edu-item">
            <strong>${ed.degree}</strong> @ ${ed.school} | ${ed.period}${ed.gpa ? ' | GPA: ' + ed.gpa : ''}
            <button class="edit-edu" data-index="${i}">Edit</button>
          </div>
        `).join('')}
        <button id="addEdu">Add Education</button>
      `);
  
      renderSection('.skills', `
        <h2>SKILLS</h2>
        ${resumeData.skills.map((skill, i) => `
          <div class="skill-item">
            <strong>${skill.name}</strong> - ${skill.level}%
            <button class="edit-skill" data-index="${i}">Edit</button>
          </div>
        `).join('')}
        <button id="addSkill">Add Skill</button>
      `);
  
      renderSection('#languages', `
        <h2>LANGUAGES</h2>
        ${resumeData.languages.map((lang, i) => `
          <div class="lang-item">
            ${lang}
            <button class="edit-lang" data-index="${i}">Edit</button>
          </div>
        `).join('')}
        <button id="addLang">Add Language</button>
      `);
  
      renderSection('#profile', `
        <h2>PROFILE</h2>
        <p>${resumeData.profile}</p>
        <button id="editProfile">Edit Profile</button>
      `);
  
      renderSection('#work-experience', `
        <h2>WORK EXPERIENCE</h2>
        ${resumeData.workExperience.map((we, i) => `
          <div class="we-item">
            <strong>${we.role}</strong> @ ${we.company} | ${we.period}
            <button class="edit-we" data-index="${i}">Edit</button>
          </div>
        `).join('')}
        <button id="addWE">Add Experience</button>
      `);
  
      renderSection('#reference', `
        <h2>REFERENCES</h2>
        ${resumeData.references.map((ref, i) => `
          <div class="ref-item">
            ${ref.name}, ${ref.title}<br>
            ${ref.phone} | ${ref.email}
            <button class="edit-ref" data-index="${i}">Edit</button>
          </div>
        `).join('')}
        <button id="addRef">Add Reference</button>
      `);
    }
  
    // Veriyi belirtilen seçiciye yerleştir
    function renderSection(selector, html) {
      document.querySelector(selector).innerHTML = html;
    }
  
    // Form doğrulama fonksiyonları
    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return re.test(email);
    }
  
    // Kullanıcı etkileşimleri
    document.body.addEventListener('click', (e) => {
      const idx = e.target.dataset.index;
  
      switch (true) {
        case e.target.matches('.edit-edu'):
          const ed = resumeData.education[idx];
          const deg = prompt('Degree:', ed.degree);
          const school = prompt('School:', ed.school);
          const period = prompt('Period:', ed.period);
          const gpa = prompt('GPA (optional):', ed.gpa || '');
          if (deg && school && period) {
            resumeData.education[idx] = { degree: deg, school, period, gpa: gpa || undefined };
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'addEdu':
          const newDeg = prompt('Degree:');
          const newSchool = prompt('School:');
          const newPeriod = prompt('Period:');
          const newGpa = prompt('GPA (optional):');
          if (newDeg && newSchool && newPeriod) {
            resumeData.education.push({ degree: newDeg, school: newSchool, period: newPeriod, gpa: newGpa || undefined });
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.matches('.edit-skill'):
          const sk = resumeData.skills[idx];
          const name = prompt('Skill name:', sk.name);
          const lvl = prompt('Level (0-100):', sk.level);
          if (name && lvl) {
            resumeData.skills[idx] = { name, level: parseInt(lvl) };
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'addSkill':
          const addName = prompt('Skill name:');
          const addLvl = prompt('Level (0-100):');
          if (addName && addLvl) {
            resumeData.skills.push({ name: addName, level: parseInt(addLvl) });
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.matches('.edit-lang'):
          const oldLang = resumeData.languages[idx];
          const updatedLang = prompt('Language:', oldLang);
          if (updatedLang) {
            resumeData.languages[idx] = updatedLang;
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'addLang':
          const newLang = prompt('Language:');
          if (newLang) {
            resumeData.languages.push(newLang);
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'editProfile':
          const newProf = prompt('Profile text:', resumeData.profile);
          if (newProf) {
            resumeData.profile = newProf;
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.matches('.edit-we'):
          const we = resumeData.workExperience[idx];
          const r = prompt('Role:', we.role);
          const c = prompt('Company:', we.company);
          const p = prompt('Period:', we.period);
          if (r && c && p) {
            resumeData.workExperience[idx] = { role: r, company: c, period: p };
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'addWE':
          const ar = prompt('Role:');
          const ac = prompt('Company:');
          const ap = prompt('Period:');
          if (ar && ac && ap) {
            resumeData.workExperience.push({ role: ar, company: ac, period: ap });
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.matches('.edit-ref'):
          const ref = resumeData.references[idx];
          const rn = prompt('Name:', ref.name);
          const rt = prompt('Title:', ref.title);
          const rp = prompt('Phone:', ref.phone);
          const re = prompt('Email:', ref.email);
          if (rn && rt) {
            resumeData.references[idx] = { name: rn, title: rt, phone: rp, email: re };
            saveDataToLocalStorage();
            renderAll();
          }
          break;
  
        case e.target.id === 'addRef':
          const newRefName = prompt('Name:');
          const newRefTitle = prompt('Title:');
          const newRefPhone = prompt('Phone:');
          const newRefEmail = prompt('Email:');
          if (newRefName && newRefTitle) {
            resumeData.references.push({ name: newRefName, title: newRefTitle, phone: newRefPhone, email: newRefEmail });
            saveDataToLocalStorage();
            renderAll();
          }
          break;
      }
    });
  
    // Sayfa yüklendiğinde başlat
    renderAll();
  });
