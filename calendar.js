function CalendarJs(el) {
    var selectedDate = new Date();

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    /**
     * Get calendar js object associated with the given element
     * @param {*} element 
     */
    window.getCalendarJs = function(element) {
        var calendarJsElement = element.closest('[calendar]');
        return calendarJsElement.calendarjs;
    }

    this.drawYearCalendar = function(targetDate = selectedDate) {
        var years = '';

        var targetFullYear = targetDate.getFullYear();
        var targetFullYearLastDigit = (targetFullYear % 1000) % 10;

        for (let i = 1; i <= targetFullYearLastDigit; i++) {
            var year = targetFullYear - i;
            years = `<div onclick="getCalendarJs(this).selectYear(${year})">${year}</div>` + years;
        }
        years += `<div onclick="getCalendarJs(this).selectYear(${targetFullYear})">${targetFullYear}</div>`;
        for (let i = targetFullYearLastDigit; i <= (10 - targetFullYearLastDigit); i++) {
            var year = targetFullYear + i;
            years += `<div onclick="getCalendarJs(this).selectYear(${year})">${year}</div>`;
        }

        var yearsRange = `${targetFullYear - targetFullYearLastDigit} - ${targetFullYear + (10 - targetFullYearLastDigit)}`;

        el.innerHTML = `
        <div calendar-head>
            <div>«</div>
            <div>‹</div>
            <div>${yearsRange}</div>
            <div>›</div>
            <div>»</div>
        </div>
        <div calendar-body years>
            ${years}
        </div>
        `;
    }

    this.drawMonthCalendar = function(targetDate = selectedDate) {
        var months = '';
        for (let i = 0; i < monthNames.length; i++) {
            const monthName = monthNames[i];
            months += `<div onclick="getCalendarJs(this).selectMonth(i)">${monthName}</div>`;
        }

        el.innerHTML = `
        <div calendar-head>
            <div>«</div>
            <div>‹</div>
            <div onclick="getCalendarJs(this).drawYearCalendar()">
                ${targetDate.getFullYear()}
            </div>
            <div>›</div>
            <div>»</div>
        </div>
        <div calendar-body months>
            ${months}
        </div>
        `;
    }

    this.drawDateCalendar = function(targetDate = selectedDate) {
        const NUM_DAYS_IN_WEEK = 7;

        var firstDayDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        var lastDayDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

        var dates = '';
        for (let i = 0; i < firstDayDate.getDay(); i++) {
            dates += `<div class="date"></div>`;
        }
        var lastDate = lastDayDate.getDate();
        for (let i = 1; i <= lastDate; i++) {
            dates += `<div onclick="getCalendarJs(this).selectDate(${i})" class="date" data-date="${i}">${i}</div>`;
        }
        for (let i = lastDayDate.getDay(); i < NUM_DAYS_IN_WEEK; i++) {
            dates += `<div class="date"></div>`;
        }

        el.innerHTML =  `
        <div calendar-head>
            <div>«</div>
            <div>‹</div>
            <div onclick="getCalendarJs(this).drawMonthCalendar()">
                ${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}
            </div>
            <div>›</div>
            <div>»</div>
        </div>
        <div calendar-body dates>
            <div class="day">S</div>
            <div class="day">M</div>
            <div class="day">T</div>
            <div class="day">W</div>
            <div class="day">T</div>
            <div class="day">F</div>
            <div class="day">S</div>
            ${dates}
        </div>
        `;
    }

    this.highlightSelectedDate = function() {
        el.querySelector(`[data-date].selected`)?.classList.remove('selected');
        el.querySelector(`[data-date="${selectedDate.getDate()}"]`)?.classList.add('selected');
    }

    this.selectDate = function(date) {
        selectedDate.setDate(date);
        this.highlightSelectedDate();
    }

    this.init = function() {
        this.drawDateCalendar();
        this.highlightSelectedDate();
        el.calendarjs = this;
    }

    this.init();
}