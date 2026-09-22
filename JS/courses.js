// ===== بيانات المواد =====
// كل مادة إلها مفتاح (نفس قيمة data-course بالزر)
let courses = {
  java: {
    name: "Java",                                    // اسم المادة
    desc: "برمجة كائنية التوجه",                      // وصف قصير
    about: "تتعلم أساسيات البرمجة الكائنية باستخدام لغة Java مع تطبيقات عملية.", // شرح (غيّره لنصك)
    teacher: "د. أحمد",                              // الأستاذ
    hours: 3,                                        // الساعات
    room: 204,                                       // القاعة
    icon: "fa-brands fa-java",                       // كلاسات الأيقونة
    color: "card-blue",                              // كلاس اللون
    topics: ["المتغيرات", "الحلقات", "الكلاسات", "الوراثة", "معالجة الأخطاء"] // المواضيع
  },
  web: {
    name: "Web Design",
    desc: "تصميم وتطوير المواقع",
    about: "تتعلم بناء صفحات الويب باستخدام HTML وCSS وJavaScript.",
    teacher: "م. سارة",
    hours: 3,
    room: 301,
    icon: "fa-solid fa-code",
    color: "card-purple",
    topics: ["HTML", "CSS", "Flexbox وGrid", "التصميم المتجاوب", "JavaScript"]
  },
  database: {
    name: "Database",
    desc: "قواعد البيانات",
    about: "تتعلم تصميم قواعد البيانات العلائقية والتعامل معها بلغة SQL.",
    teacher: "د. محمد",
    hours: 3,
    room: 105,
    icon: "fa-solid fa-database",
    color: "card-green",
    topics: ["نمذجة البيانات", "SQL", "الجداول والعلاقات", "التطبيع", "الفهارس"]
  },
  networking: {
    name: "Networking",
    desc: "شبكات الحاسوب",
    about: "تتعرف على أساسيات الشبكات والبروتوكولات وكيفية انتقال البيانات.",
    teacher: "م. خالد",
    hours: 3,
    room: 210,
    icon: "fa-solid fa-network-wired",
    color: "card-red",
    topics: ["نموذج OSI", "عناوين IP", "الراوتر والسويتش", "TCP/IP", "أمن الشبكات"]
  }
};

// ===== العناصر اللي رح نتعامل معها =====
let modal = document.getElementById("courseModal");       // النافذة كلها (الخلفية السودا)
let modalBox = modal.querySelector(".modal-box");         // الصندوق الأبيض جواها
let closeBtn = document.getElementById("modalClose");     // زر ✕

// ===== فتح النافذة =====
function openModal(key) {                                   // key = اسم المادة مثل "java"
  let c = courses[key];                                   // بنجيب بيانات المادة من الكائن
  if (!c) return;                                           // لو المفتاح غلط، بنوقف ونطلع

  document.getElementById("modalTitle").textContent = c.name;      // اسم المادة
  document.getElementById("modalDesc").textContent = c.desc;       // الوصف القصير
  document.getElementById("modalAbout").textContent = c.about;     // الشرح
  document.getElementById("modalTeacher").textContent = c.teacher; // الأستاذ
  document.getElementById("modalHours").textContent = c.hours;     // الساعات
  document.getElementById("modalRoom").textContent = c.room;       // القاعة
  document.getElementById("modalIcon").className = c.icon;         // كلاسات الأيقونة

  document.getElementById("modalTopics").innerHTML =               // بنبني عناصر المواضيع
    c.topics.map(t => `<li>${t}</li>`).join("");                   // لكل موضوع <li> وبنجمعهم بنص واحد

  modalBox.className = "modal-box " + c.color;             // بنحط كلاس اللون (بيغيّر الشريط والأيقونة)
  modal.classList.add("open");                             // بنظهر النافذة
  modal.setAttribute("aria-hidden", "false");              // بنخبّر قارئات الشاشة إنها ظاهرة
  document.body.classList.add("no-scroll");                // بنمنع سكرول الصفحة الخلفية
  closeBtn.focus();                                        // بنحط التركيز على زر الإغلاق
}

// ===== إغلاق النافذة =====
function closeModal() {
  modal.classList.remove("open");                          // بنخفي النافذة
  modal.setAttribute("aria-hidden", "true");               // بنخبّر قارئات الشاشة إنها مخفية
  document.body.classList.remove("no-scroll");             // بنرجّع السكرول
}

// ===== ربط أزرار "عرض التفاصيل" =====
document.querySelectorAll("[data-course]").forEach(btn => { // بنجيب كل عنصر عنده data-course
  btn.addEventListener("click", () => {                     // لما يتضغط
    openModal(btn.dataset.course);                          // بنفتح النافذة بمفتاح مادته (dataset.course = قيمة data-course)
  });
});

// ===== طرق الإغلاق =====
closeBtn.addEventListener("click", closeModal);             // 1) الضغط على ✕

modal.addEventListener("click", (e) => {                    // 2) الضغط على الخلفية السودا
  if (e.target === modal) closeModal();                     // بس لو الضغطة على الخلفية نفسها مش على الصندوق
});

document.addEventListener("keydown", (e) => {               // 3) ضغط مفتاح
  if (e.key === "Escape") closeModal();                     // لو المفتاح Esc
});