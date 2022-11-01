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

    this.drawYearCalendar = function(targetFullYear = selectedDate.getFullYear()) {
        const NUMBER_OF_YEAR_OPTIONS = 10;
        var yearsArray = [];
        var yearsHTML = '';

        // var targetFullYear = targetDate.getFullYear();
        var targetFullYearLastDigit = (targetFullYear % 1000) % 10;

        for (let i = 1; i <= targetFullYearLastDigit; i++) {
            var year = targetFullYear - i;
            yearsArray.unshift(year);
        }
        yearsArray.push(targetFullYear);
        for (let i = 1; i <= (NUMBER_OF_YEAR_OPTIONS - targetFullYearLastDigit); i++) {
            var year = targetFullYear + i;
            yearsArray.push(year);
        }

        for (let i = 0; i < yearsArray.length; i++) {
            var year = yearsArray[i];
            yearsHTML += `<div onclick="getCalendarJs(this).selectYear(${year})" class="year" data-year="${year}">${year}</div>`;
        }

        var yearsRange = `${yearsArray[0]} - ${yearsArray[NUMBER_OF_YEAR_OPTIONS]}`;

        var prev = new Date(yearsArray[0] - 1, 1, 1);
        var next = new Date(yearsArray[NUMBER_OF_YEAR_OPTIONS] + 1, 1, 1);

        el.innerHTML = `
        <div calendar-head>
            <div class="first">«</div>
            <div onclick="getCalendarJs(this).drawYearCalendar(${prev.getFullYear()})" class="prev">‹</div>
            <div class="title year">${yearsRange}</div>
            <div onclick="getCalendarJs(this).drawYearCalendar(${next.getFullYear()})" class="next">›</div>
            <div class="last">»</div>
        </div>
        <div calendar-body years>
            ${yearsHTML}
        </div>
        `;

        this.highlightSelectedYear();
    }

    this.drawMonthCalendar = function(targetDate = selectedDate) {
        var months = '';
        for (let i = 0; i < monthNames.length; i++) {
            const monthName = monthNames[i];
            months += `<div onclick="getCalendarJs(this).selectMonth(${i})" class="month" data-month="${i}">${monthName}</div>`;
        }

        el.innerHTML = `
        <div calendar-head>
            <div class="first">«</div>
            <div class="prev">‹</div>
            <div onclick="getCalendarJs(this).drawYearCalendar()" class="title">
                ${targetDate.getFullYear()}
            </div>
            <div class="next">›</div>
            <div class="last">»</div>
        </div>
        <div calendar-body months>
            ${months}
        </div>
        `;

        this.highlightSelectedMonth();
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
            <div class="first">«</div>
            <div class="prev">‹</div>
            <div onclick="getCalendarJs(this).drawMonthCalendar()" class="title">
                ${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}
            </div>
            <div class="next">›</div>
            <div class="last">»</div>
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

        this.highlightSelectedDate();
    }

    this.highlightSelectedDate = function() {
        el.querySelector(`[data-date].selected`)?.classList.remove('selected');
        el.querySelector(`[data-date="${selectedDate.getDate()}"]`)?.classList.add('selected');
    }

    this.highlightSelectedMonth = function() {
        el.querySelector(`[data-month].selected`)?.classList.remove('selected');
        el.querySelector(`[data-month="${selectedDate.getMonth()}"]`)?.classList.add('selected');
    }

    this.highlightSelectedYear = function() {
        el.querySelector(`[data-year].selected`)?.classList.remove('selected');
        el.querySelector(`[data-year="${selectedDate.getFullYear()}"]`)?.classList.add('selected');
    }

    this.selectDate = function(date) {
        selectedDate.setDate(date);
        this.highlightSelectedDate();
    }

    this.selectMonth = function(month) {
        selectedDate.setMonth(month);
        this.highlightSelectedMonth();

        this.drawDateCalendar();
    }

    this.selectYear = function(year) {
        selectedDate.setFullYear(year);
        this.highlightSelectedYear();

        this.drawMonthCalendar();
    }

    this.init = function() {
        this.drawDateCalendar();
        el.calendarjs = this;
    }

    this.init();
}