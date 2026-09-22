// =====================================================
// tasks.js — صفحة المهام
// =====================================================

// جلب عناصر HTML
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMessage = document.getElementById("taskEmpty");
const filterButtons = document.querySelectorAll(".filter-btn");

// المهام المحفوظة (وإذا لم يوجد شيء محفوظ نبدأ بقائمة فارغة)
let tasks = JSON.parse(localStorage.getItem("sa_tasks")) || [];

// الفلتر الحالي: all (الكل) أو pending (غير مكتملة) أو done (مكتملة)
let currentFilter = "all";

// حفظ المهام في المتصفح
function saveTasks() {
  localStorage.setItem("sa_tasks", JSON.stringify(tasks));
}

// إنشاء زر أيقونة (للتعديل أو الحذف)
function createIconButton(iconClass, buttonClass, label) {
  // إنشاء الزر
  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-icon-btn " + buttonClass;
  button.setAttribute("aria-label", label);

  // إنشاء الأيقونة ووضعها داخل الزر
  const icon = document.createElement("i");
  icon.className = iconClass;
  button.appendChild(icon);

  return button;
}

// عرض المهام في الصفحة
function showTasks() {
  // تفريغ القائمة قبل إعادة رسمها
  list.innerHTML = "";

  // عدد المهام التي تم عرضها
  let shownCount = 0;

  // المرور على كل المهام
  for (const task of tasks) {
    // تخطي المهام التي لا تناسب الفلتر الحالي
    if (currentFilter === "done" && !task.done) continue;
    if (currentFilter === "pending" && task.done) continue;

    // إنشاء عنصر المهمة
    const li = document.createElement("li");
    li.className = "task-item";

    // مربع الاختيار (لتحديد المهمة كمكتملة)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "تمت المهمة");

    // نص المهمة
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    // شارة الحالة (مكتملة أو غير مكتملة)
    const badge = document.createElement("span");
    badge.className = "badge";

    if (task.done) {
      badge.textContent = "مكتملة";
      badge.classList.add("badge-success");
      li.classList.add("done"); // يضع خطًا على النص
    } else {
      badge.textContent = "غير مكتملة";
      badge.classList.add("badge-danger");
    }

    // زرا التعديل والحذف
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = createIconButton("fa-solid fa-pen-to-square", "is-edit", "تعديل");
    const deleteButton = createIconButton("fa-solid fa-trash", "is-delete", "حذف");

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    // عند الضغط على مربع الاختيار
    checkbox.addEventListener("change", function () {
      // عكس حالة المهمة (مكتملة ↔ غير مكتملة)
      task.done = !task.done;

      saveTasks();
      showTasks();
    });

    // عند الضغط على زر التعديل
    editButton.addEventListener("click", function () {
      // سؤال المستخدم عن النص الجديد (ويظهر النص القديم)
      const newText = prompt("عدّل المهمة:", task.text);

      // إذا ضغط المستخدم إلغاء
      if (newText === null) return;

      // التأكد أن النص ليس فارغًا
      if (newText.trim() === "") {
        alert("اكتب نص المهمة أولًا");
        return;
      }

      // تحديث النص
      task.text = newText.trim();

      saveTasks();
      showTasks();
    });

    // عند الضغط على زر الحذف
    deleteButton.addEventListener("click", function () {
      // سؤال المستخدم قبل الحذف
      const sure = confirm("هل تريد حذف هذه المهمة؟");

      // إذا ضغط المستخدم إلغاء
      if (!sure) return;

      // حذف المهمة من القائمة (نجد مكانها ثم نحذف عنصرًا واحدًا)
      const index = tasks.indexOf(task);
      tasks.splice(index, 1);

      saveTasks();
      showTasks();
    });

    // وضع العناصر داخل المهمة
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(badge);
    li.appendChild(actions);

    // إضافة المهمة للقائمة
    list.appendChild(li);

    // زيادة عدد المهام المعروضة
    shownCount++;
  }

  // إظهار رسالة إذا لم توجد مهام للعرض
  if (shownCount === 0) {
    emptyMessage.hidden = false;

    if (tasks.length === 0) {
      emptyMessage.textContent = "ما عندك مهام بعد، أضف أول مهمة!";
    } else {
      emptyMessage.textContent = "لا توجد مهام في هذا التصنيف";
    }
  } else {
    emptyMessage.hidden = true;
  }
}

// عند إضافة مهمة جديدة
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // منع تحديث الصفحة

  // التأكد أن المستخدم كتب مهمة
  if (taskInput.value.trim() === "") {
    alert("اكتب مهمة أولًا");
    return;
  }

  // إضافة المهمة الجديدة للقائمة (غير مكتملة في البداية)
  tasks.push({ text: taskInput.value.trim(), done: false });

  saveTasks();

  // تفريغ حقل الإدخال وإعادة المؤشر له
  taskInput.value = "";
  taskInput.focus();

  showTasks();
});

// عند الضغط على أحد أزرار الفلترة
for (const button of filterButtons) {
  button.addEventListener("click", function () {
    // تغيير الفلتر الحالي (القيمة مكتوبة في data-filter بالـ HTML)
    currentFilter = button.dataset.filter;

    // إزالة التحديد من كل الأزرار
    for (const other of filterButtons) {
      other.classList.remove("active");
    }

    // تحديد الزر الذي تم الضغط عليه
    button.classList.add("active");

    showTasks();
  });
}

// عرض المهام عند فتح الصفحة
showTasks();
