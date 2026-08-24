let water = Number(localStorage.getItem("water")) || 0;
let goal = Number(localStorage.getItem("goal")) || 2000;
let reminder = localStorage.getItem("reminder") === "true";

const currentWater = document.getElementById("currentWater");
const goalWater = document.getElementById("goalWater");
const goalDisplay = document.getElementById("goalDisplay");
const percentage = document.getElementById("percentage");
const remaining = document.getElementById("remaining");
const cups = document.getElementById("cups");
const progressCircle = document.getElementById("progressCircle");

function updateUI() {
    const percent = Math.min(
        Math.round((water / goal) * 100),
        100
    );

    currentWater.textContent = water;
    goalWater.textContent = goal;
    goalDisplay.textContent = goal;
    percentage.textContent = percent + "%";

    remaining.textContent = Math.max(goal - water, 0);
    cups.textContent = Math.floor(water / 250);

    const circumference = 326.7;
    const offset =
        circumference - (percent / 100) * circumference;

    progressCircle.style.strokeDashoffset = offset;

    localStorage.setItem("water", water);
    localStorage.setItem("goal", goal);
}

// أزرار إضافة الماء
document.querySelectorAll(".buttons button").forEach(button => {
    button.addEventListener("click", () => {

        const amount = Number(button.dataset.amount);

        water += amount;

        updateUI();
    });
});

// زيادة الهدف
document.getElementById("plusGoal").addEventListener("click", () => {

    goal += 250;

    updateUI();
});

// إنقاص الهدف
document.getElementById("minusGoal").addEventListener("click", () => {

    if (goal > 500) {
        goal -= 250;
    }

    updateUI();
});

// الوضع الليلي
document.getElementById("themeBtn").addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem("darkMode", dark);

    document.getElementById("themeBtn").textContent =
        dark ? "☀️" : "🌙";
});

// تحميل الوضع الليلي
if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

    document.getElementById("themeBtn").textContent = "☀️";
}

// التذكيرات
const reminderBtn =
    document.getElementById("reminderBtn");

const reminderStatus =
    document.getElementById("reminderStatus");

function updateReminderUI() {

    if (reminder) {

        reminderStatus.textContent =
            "التذكيرات مفعلة 🔔";

        reminderBtn.textContent = "إيقاف";

    } else {

        reminderStatus.textContent =
            "التذكيرات متوقفة";

        reminderBtn.textContent = "تشغيل";
    }
}

reminderBtn.addEventListener("click", async () => {

    if (!reminder) {

        if ("Notification" in window) {

            const permission =
                await Notification.requestPermission();

            if (permission !== "granted") {

                alert(
                    "يجب السماح بالإشعارات لتفعيل التذكيرات."
                );

                return;
            }
        }

        reminder = true;

    } else {

        reminder = false;
    }

    localStorage.setItem("reminder", reminder);

    updateReminderUI();
});

// تشغيل التطبيق
updateUI();
updateReminderUI();
