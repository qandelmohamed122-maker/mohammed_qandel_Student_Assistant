// =====================================================
// gpa.js — حساب المعدل (بيشتغل بصفحة gpa.html فقط)
// بيعتمد على storage.js (لازم يتحمّل قبله)
// =====================================================


// ===== سلم العلامات =====
// مهم: هاد سلم شائع بالجامعات العربية، مش بالضرورة سلم جامعتك.
// عدّل الأرقام هون ليطابقوا سلم جامعتك، وكل شي تاني بيتغير لحاله.
// الترتيب مهم: من الأعلى للأدنى.
const scale = [
  { min: 90, points: 4.0, label: "من 90 إلى 100" },   // min = أقل علامة بهالمستوى، points = النقاط
  { min: 85, points: 3.5, label: "من 85 إلى 89" },
  { min: 80, points: 3.0, label: "من 80 إلى 84" },
  { min: 75, points: 2.5, label: "من 75 إلى 79" },
  { min: 70, points: 2.0, label: "من 70 إلى 74" },
  { min: 65, points: 1.5, label: "من 65 إلى 69" },
  { min: 60, points: 1.0, label: "من 60 إلى 64" },
  { min: 0,  points: 0.0, label: "أقل من 60" }
];


// ===== العناصر =====
const form = document.getElementById("gpaForm");            // الفورم
const tbody = document.getElementById("gpaBody");           // جسم الجدول
const addRowBtn = document.getElementById("addRowBtn");     // زر "إضافة مادة"
const message = document.getElementById("gpaMessage");     // رسالة الخطأ
const result = document.getElementById("gpaResult");        // صندوق النتيجة
const valueEl = document.getElementById("gpaValue");        // رقم المعدل
const hoursEl = document.getElementById("gpaHours");        // مجموع الساعات
const scaleList = document.getElementById("scaleList");     // قائمة السلم


// ===== إضافة صف مادة =====
function addRow(name, hours) {
  const tr = document.createElement("tr");                  // بنعمل صف جديد

  tr.innerHTML = `
    <td data-label="المادة">
      <input type="text" class="row-name" placeholder="اسم المادة" aria-label="اسم المادة">
    </td>
    <td data-label="العلامة">
      <input type="number" class="row-grade" min="0" max="100" step="any" inputmode="decimal" placeholder="0 - 100" aria-label="العلامة">
    </td>
    <td data-label="عدد الساعات">
      <input type="number" class="row-hours" min="1" max="10" step="any" aria-label="عدد الساعات">
    </td>
    <td>
      <button type="button" class="btn-icon row-delete" aria-label="حذف المادة">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </td>
  `;                                                        // الشكل الثابت للصف (الحقول فاضية لسا)

  tr.querySelector(".row-name").value = name;               // اسم المادة (value بتحطه كنص عادي، آمن)
  tr.querySelector(".row-hours").value = hours;             // عدد الساعات

  tr.querySelector(".row-delete").addEventListener("click", () => {
    tr.remove();                                            // بنحذف الصف
    hideResult();                                           // النتيجة القديمة ما عادت صحيحة
  });

  tbody.appendChild(tr);                                    // بنضيف الصف للجدول
  return tr;                                                // بنرجّع الصف عشان نقدر نركّز عليه
}


// ===== تحويل العلامة لنقاط =====
function pointsFromGrade(grade) {
  for (const level of scale) {                              // بنمر على السلم من الأعلى
    if (grade >= level.min) {                               // أول مستوى العلامة بتوصله
      return level.points;                                  // بنرجّع نقاطه
    }
  }
  return 0;                                                 // احتياط (ما المفروض توصل هون)
}


// ===== رسائل ونتيجة =====
function showMessage(text) {
  message.textContent = text;                               // نص الخطأ
  message.hidden = false;                                   // بنظهر الرسالة
  result.hidden = true;                                     // وبنخفي أي نتيجة قديمة
}

function hideResult() {
  result.hidden = true;                                     // بنخفي النتيجة
}


// ===== حساب المعدل =====
function calculate() {
  message.hidden = true;                                    // بنمسح أي رسالة قديمة

  let totalPoints = 0;                                      // مجموع (النقاط × الساعات)
  let totalHours = 0;                                       // مجموع الساعات

  for (const row of tbody.querySelectorAll("tr")) {         // بنمر على كل صف
    const gradeInput = row.querySelector(".row-grade");     // حقل العلامة
    const hoursInput = row.querySelector(".row-hours");     // حقل الساعات

    if (gradeInput.value === "") continue;                  // صف بدون علامة: بنتجاهله

    const grade = Number(gradeInput.value);                 // العلامة كرقم
    const hours = Number(hoursInput.value);                 // الساعات كرقم

    if (grade < 0 || grade > 100) {                         // علامة خارج المعقول
      showMessage("العلامة لازم تكون بين 0 و 100");
      gradeInput.focus();                                   // بنركّز على الحقل الغلط
      return;                                               // بنوقف الحساب
    }

    if (hours <= 0) {                                       // ساعات فاضية أو صفر
      showMessage("اكتب عدد الساعات للمادة");
      hoursInput.focus();
      return;
    }

    totalPoints += pointsFromGrade(grade) * hours;          // بنضيف نقاط المادة × ساعاتها
    totalHours += hours;                                    // وبنضيف ساعاتها للمجموع
  }

  if (totalHours === 0) {                                   // ما في ولا علامة
    showMessage("أدخل علامة مادة واحدة على الأقل");
    return;
  }

  const gpa = totalPoints / totalHours;                     // المعدل = مجموع النقاط ÷ مجموع الساعات

  valueEl.textContent = gpa.toFixed(2);                     // بنكتبه بخانتين عشريتين
  hoursEl.textContent = totalHours;                         // مجموع الساعات
  result.hidden = false;                                    // بنظهر النتيجة
  result.scrollIntoView({ behavior: "smooth", block: "nearest" }); // بنمرّر الصفحة للنتيجة (مفيد على الجوال)
}


// ===== الأحداث =====
form.addEventListener("submit", (e) => {                    // لما تضغط "احسب" أو Enter
  e.preventDefault();                                       // بنمنع إعادة تحميل الصفحة
  calculate();                                              // بنحسب
});

form.addEventListener("input", hideResult);                 // أي تعديل بالحقول بيخفي النتيجة القديمة

addRowBtn.addEventListener("click", () => {                 // زر "إضافة مادة"
  const tr = addRow("", 3);                                 // صف فاضي بـ 3 ساعات افتراضياً
  tr.querySelector(".row-name").focus();                    // بنركّز على حقل الاسم
});


// ===== أول تحميل =====
// ملاحظة: صفحة المواد (courses.js) حالياً بيانات ثابتة، مش محفوظة بالمتصفح،
// فما في طريقة نجيب منها المواد تلقائياً. بنبدأ بصف فاضي واحد ونضيف باقي المواد يدوياً بالزر.
addRow("", 3);

for (const level of scale) {                                // بنعرض سلم العلامات بالقائمة
  const li = document.createElement("li");
  li.innerHTML = "<span>" + level.label + "</span><strong>" + level.points.toFixed(1) + "</strong>";
  scaleList.appendChild(li);                                // (هون آمن لأن النص من عندنا، مش من المستخدم)
}
