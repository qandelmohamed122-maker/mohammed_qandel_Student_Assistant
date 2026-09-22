let menuToggle = document.getElementById("menuToggle"); // بنجيب زر الهامبرغر
let navLinks = document.getElementById("navLinks");     // بنجيب قائمة الروابط
menuToggle.addEventListener("click", () => {              // لما المستخدم يضغط الزر
  let isOpen = navLinks.classList.toggle("open");       // بنضيف/بنشيل كلاس open عن القائمة
  menuToggle.setAttribute("aria-expanded", isOpen);       // بنخبّر قارئات الشاشة إذا القائمة مفتوحة
});


