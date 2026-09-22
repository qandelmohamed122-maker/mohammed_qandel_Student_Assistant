// ===== بيانات الجدول: لكل يوم مصفوفة محاضرات =====
const schedule = {
  sat: [                                                              // السبت
    { course: "Java",       time: "09:00 - 10:30", room: 204, teacher: "د. أحمد" },
    { course: "Web Design", time: "11:00 - 12:30", room: 301, teacher: "م. سارة" },
    { course: "Database",   time: "13:00 - 14:30", room: 105, teacher: "د. محمد" },
    { course: "Networking", time: "15:00 - 16:30", room: 210, teacher: "م. خالد" }
  ],
  sun: [                                                              // الأحد
    { course: "Database",   time: "09:00 - 10:30", room: 105, teacher: "د. محمد" },
    { course: "Java",       time: "11:00 - 12:30", room: 204, teacher: "د. أحمد" }
  ],
  mon: [                                                              // الاثنين
    { course: "Networking", time: "10:00 - 11:30", room: 210, teacher: "م. خالد" },
    { course: "Web Design", time: "13:00 - 14:30", room: 301, teacher: "م. سارة" }
  ],
  tue: [                                                              // الثلاثاء
    { course: "Java",       time: "09:00 - 10:30", room: 204, teacher: "د. أحمد" },
    { course: "Database",   time: "11:00 - 12:30", room: 105, teacher: "د. محمد" }
  ],
  wed: [                                                              // الأربعاء
    { course: "Web Design", time: "09:00 - 10:30", room: 301, teacher: "م. سارة" }
  ],
  thu: []                                                             // الخميس: بدون محاضرات
};

// ===== العناصر =====
const tabs = document.querySelectorAll(".day-btn");                   // كل أزرار الأيام
const titleEl = document.getElementById("scheduleTitle");             // عنوان الجدول
const bodyEl = document.getElementById("scheduleBody");               // جسم الجدول (tbody)

// ===== عرض جدول يوم معين =====
function showDay(day, label) {                                        // day = المفتاح مثل "sat"، label = الاسم بالعربي
  const lectures = schedule[day] || [];                               // محاضرات اليوم (أو مصفوفة فاضية لو ما لقى)
  titleEl.textContent = "جدول يوم " + label;                          // بنغيّر العنوان

  if (lectures.length === 0) {                                        // لو ما في محاضرات
    bodyEl.innerHTML =
      `<tr><td colspan="4" class="schedule-empty">لا توجد محاضرات في هذا اليوم 🎉</td></tr>`; // رسالة بدل الجدول
    return;                                                           // بنوقف هون
  }

  bodyEl.innerHTML = lectures.map(l => `
    <tr>
      <td data-label="المادة">${l.course}</td>
      <td data-label="الوقت"><span class="time">${l.time}</span></td>
      <td data-label="القاعة">${l.room}</td>
      <td data-label="الأستاذ">${l.teacher}</td>
    </tr>
  `).join("");                                                        // لكل محاضرة صف، وبنجمعهم بنص واحد ونحطهم بالجدول
}

// ===== لما تضغط على زر يوم =====
tabs.forEach(btn => {                                                 // لكل زر
  btn.addEventListener("click", () => {                               // لما ينضغط
    tabs.forEach(b => b.classList.remove("active"));                  // بنشيل active من كل الأزرار
    btn.classList.add("active");                                      // وبنحطه على الزر المضغوط
    showDay(btn.dataset.day, btn.textContent.trim());                 // بنعرض جدول اليوم (trim بتشيل المسافات الزايدة)
  });
});

// ===== أول تحميل للصفحة =====
const firstTab = document.querySelector(".day-btn.active");           // الزر اللي عليه active (السبت)
showDay(firstTab.dataset.day, firstTab.textContent.trim());           // بنعرض جدوله