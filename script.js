let intervalId = null;
let timeData = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function updateCountdown() {
    timeData.seconds--;
    if (timeData.seconds < 0) {
        timeData.seconds = 59;
        timeData.minutes--;
        if (timeData.minutes < 0) {
            timeData.minutes = 59;
            timeData.hours--;
            if (timeData.hours < 0) {
                timeData.hours = 23;
                timeData.days--;
            }
        }
    }
    document.getElementById('remaining-time').textContent = 
        timeData.days >= 0 
            ? `${timeData.days} days, ${timeData.hours} hours, ${timeData.minutes} minutes, ${timeData.seconds} seconds`
            : `-${Math.abs(timeData.days)} days, ${timeData.hours} hours, ${timeData.minutes} minutes, ${timeData.seconds} seconds`;
}

async function startCountdown() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    const yearInput = document.getElementById('year-input').value;
    const year = yearInput ? parseInt(yearInput) : 2022;

    if (year < 1900 || year > 9999) {
        document.getElementById('remaining-time').textContent = 
            'Please enter a year between 1900 and 9999';
        return;
    }

    try {
        const response = await fetch('gsat_date.json');
        if (!response.ok) {
            throw new Error('Failed to load gsat_date.json');
        }
        const dates = await response.json();
        const gsatDateStr = dates[year];
        if (!gsatDateStr) {
            throw new Error(`No date found for year ${year}`);
        }

        const gsatDate = new Date(`${gsatDateStr}T09:20:00`);
        const now = new Date();
        const diffMs = now - gsatDate;

        const seconds = Math.abs(diffMs) / 1000;
        timeData.days = Math.floor(seconds / (24 * 3600));
        timeData.hours = Math.floor((seconds % (24 * 3600)) / 3600);
        timeData.minutes = Math.floor((seconds % 3600) / 60);
        timeData.seconds = Math.floor(seconds % 60);

        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
    } catch (error) {
        document.getElementById('remaining-time').textContent = 
            'Error: ' + error.message;
        console.error('Error:', error);
    }
}

startCountdown();