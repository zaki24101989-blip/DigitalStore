/* =========================================
   MedTime - script.js
========================================= */

const addMedicineBtn = document.getElementById("addMedicineBtn");
const navAdd = document.getElementById("navAdd");

const medicineModal = document.getElementById("medicineModal");
const closeModal = document.getElementById("closeModal");
const saveMedicine = document.getElementById("saveMedicine");

const medicineName = document.getElementById("medicineName");
const medicineTime = document.getElementById("medicineTime");
const medicineNote = document.getElementById("medicineNote");

const medicineList = document.getElementById("medicineList");

const nextMedicineName =
    document.getElementById("nextMedicineName");

const nextMedicineTime =
    document.getElementById("nextMedicineTime");

const countdown =
    document.getElementById("countdown");

const themeBtn =
    document.getElementById("themeBtn");

const todayDate =
    document.getElementById("todayDate");


/* =========================================
   البيانات
========================================= */

let medicines =
    JSON.parse(localStorage.getItem("medTimeMedicines")) || [];


/* =========================================
   التاريخ
========================================= */

function updateDate() {

    const now = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "short"
    };

    todayDate.textContent =
        now.toLocaleDateString("ar-DZ", options);
}

updateDate();


/* =========================================
   فتح النافذة
========================================= */

function openModal() {

    medicineModal.classList.add("show");

    medicineName.focus();
}

function closeMedicineModal() {

    medicineModal.classList.remove("show");

    medicineName.value = "";
    medicineTime.value = "";
    medicineNote.value = "";
}

addMedicineBtn.addEventListener(
    "click",
    openModal
);

navAdd.addEventListener(
    "click",
    openModal
);

closeModal.addEventListener(
    "click",
    closeMedicineModal
);


/* =========================================
   إغلاق عند الضغط خارج النافذة
========================================= */

medicineModal.addEventListener(
    "click",
    function(event) {

        if (event.target === medicineModal) {
            closeMedicineModal();
        }

    }
);


/* =========================================
   حفظ البيانات
========================================= */

function saveData() {

    localStorage.setItem(
        "medTimeMedicines",
        JSON.stringify(medicines)
    );
}


/* =========================================
   إضافة دواء
========================================= */

saveMedicine.addEventListener(
    "click",
    function() {

        const name =
            medicineName.value.trim();

        const time =
            medicineTime.value;

        const note =
            medicineNote.value.trim();


        if (!name) {

            alert("اكتب اسم الدواء أولاً.");

            medicineName.focus();

            return;
        }


        if (!time) {

            alert("اختر وقت التذكير.");

            medicineTime.focus();

            return;
        }


        const medicine = {

            id: Date.now(),

            name: name,

            time: time,

            note: note,

            completed: false

        };


        medicines.push(medicine);

        medicines.sort(
            (a, b) =>
                a.time.localeCompare(b.time)
        );


        saveData();

        renderMedicines();

        closeMedicineModal();

        showNotification(
            "تم حفظ الموعد ✅"
        );

    }
);


/* =========================================
   عرض الأدوية
========================================= */

function renderMedicines() {

    medicineList.innerHTML = "";


    if (medicines.length === 0) {

        medicineList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💊
                </div>

                <h3>
                    لا توجد مواعيد
                </h3>

                <p>
                    اضغط على + لإضافة دواء
                    وتحديد وقت التذكير.
                </p>

            </div>

        `;

        updateNextMedicine();

        return;
    }


    medicines.forEach(
        medicine => {

            const item =
                document.createElement("div");

            item.className =
                "medicine-item";


            if (medicine.completed) {

                item.style.opacity = "0.55";

            }


            item.innerHTML = `

                <div class="item-icon">
                    💊
                </div>

                <div class="item-info">

                    <h3>
                        ${escapeHTML(medicine.name)}
                    </h3>

                    <p>
                        ⏰ ${formatTime(medicine.time)}
                        ${
                            medicine.note
                            ? " • " +
                              escapeHTML(medicine.note)
                            : ""
                        }
                    </p>

                </div>

                <div class="item-actions">

                    <button
                        class="action-btn complete-btn"
                        title="تم أخذه"
                    >
                        ${medicine.completed ? "↩️" : "✓"}
                    </button>

                    <button
                        class="action-btn delete-btn"
                        title="حذف"
                    >
                        🗑️
                    </button>

                </div>

            `;


            const completeBtn =
                item.querySelector(
                    ".complete-btn"
                );

            const deleteBtn =
                item.querySelector(
                    ".delete-btn"
                );


            completeBtn.addEventListener(
                "click",
                function() {

                    toggleComplete(
                        medicine.id
                    );

                }
            );


            deleteBtn.addEventListener(
                "click",
                function() {

                    deleteMedicine(
                        medicine.id
                    );

                }
            );


            medicineList.appendChild(item);

        }
    );


    updateNextMedicine();
}


/* =========================================
   إكمال الدواء
========================================= */

function toggleComplete(id) {

    const medicine =
        medicines.find(
            item => item.id === id
        );


    if (!medicine) return;


    medicine.completed =
        !medicine.completed;


    saveData();

    renderMedicines();


    if (medicine.completed) {

        showNotification(
            "تم تسجيل الدواء ✓"
        );

    }

}


/* =========================================
   حذف دواء
========================================= */

function deleteMedicine(id) {

    const confirmed =
        confirm(
            "هل تريد حذف هذا الموعد؟"
        );


    if (!confirmed) return;


    medicines =
        medicines.filter(
            item => item.id !== id
        );


    saveData();

    renderMedicines();

    showNotification(
        "تم حذف الموعد"
    );
}


/* =========================================
   الدواء القادم
========================================= */

function updateNextMedicine() {

    if (medicines.length === 0) {

        nextMedicineName.textContent =
            "لا توجد أدوية";

        nextMedicineTime.textContent =
            "أضف أول موعد لك";

        countdown.textContent =
            "--:--";

        return;
    }


    const now = new Date();


    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    let upcoming =
        medicines
            .filter(
                medicine =>
                    !medicine.completed &&
                    timeToMinutes(
                        medicine.time
                    ) >= currentMinutes
            )
            .sort(
                (a, b) =>
                    timeToMinutes(a.time) -
                    timeToMinutes(b.time)
            )[0];


    if (!upcoming) {

        upcoming =
            medicines.find(
                medicine =>
                    !medicine.completed
            );

    }


    if (!upcoming) {

        nextMedicineName.textContent =
            "تم الانتهاء 🎉";

        nextMedicineTime.textContent =
            "لا توجد مواعيد متبقية";

        countdown.textContent =
            "✓";

        return;
    }


    nextMedicineName.textContent =
        upcoming.name;

    nextMedicineTime.textContent =
        "الساعة " +
        formatTime(upcoming.time);


    updateCountdown(upcoming);

}


/* =========================================
   العد التنازلي
=========================================
