let currentStadium = '실내';
let currentTimeFilter = 'all'; // 'all', 'morning', 'afternoon', 'night'
let weekDates = [];

// [예시 데이터] 실내, 야외1, 야외2, 야외3 4개 구장 매핑
const stadiumData = {
    '실내': {
        '06:00': [[{ name: '실내조기회', type: 'user' }], [], [], [], [], [], []],
        '07:00': [[{ name: '실내조기회', type: 'user' }], [], [], [], [], [], []],
        '08:00': [[], [], [], [], [], [], []],
        '09:00': [[], [{ name: '모닝레슨', type: 'lesson' }], [], [], [], [], []],
        '10:00': [[], [{ name: '모닝레슨', type: 'lesson' }], [], [], [], [], []],
        '11:00': [[], [], [], [], [], [], []],
        '12:00': [[{ name: '점심팀', type: 'user' }], [], [], [], [], [], []],
        '13:00': [[], [], [{ name: '직장인A', type: 'user' }], [], [], [], []],
        '14:00': [[], [], [], [], [], [{ name: '주말클럽', type: 'user' }], []],
        '15:00': [[], [], [], [], [], [{ name: '주말클럽', type: 'user' }], []],
        '16:00': [[], [{ name: '유소년반', type: 'lesson' }], [], [], [], [], []],
        '17:00': [[{ name: 'A회원', type: 'user' }, { name: 'B회원', type: 'user' }], [{ name: 'B회원', type: 'user' }], [], [{ name: '강습', type: 'lesson' }], [], [{ name: 'B회원', type: 'user' }], []],
        '18:00': [[{ name: 'A회원', type: 'user' }], [{ name: 'B회원', type: 'user' }], [], [{ name: '강습', type: 'lesson' }], [], [], []],
        '19:00': [[{ name: 'A회원', type: 'user' }, { name: 'C회원', type: 'user' }], [{ name: '강습', type: 'lesson' }], [], [{ name: '강습', type: 'lesson' }], [], [], []],
        '20:00': [[{ name: 'A회원', type: 'user' }], [], [], [{ name: '강습', type: 'lesson' }], [], [], []],
        '21:00': [[], [], [{ name: '심야클럽', type: 'user' }], [], [{ name: '불금팀', type: 'user' }], [], []],
        '22:00': [[], [], [{ name: '심야클럽', type: 'user' }], [], [{ name: '불금팀', type: 'user' }], [], []],
        '23:00': [[], [], [], [], [], [], []]
    },
    '야외1': {
        '06:00': [[], [], [], [], [], [], []],
        '07:00': [[], [], [], [], [], [], []],
        '08:00': [[], [], [], [], [], [], []],
        '09:00': [[], [], [], [], [], [], []],
        '10:00': [[{ name: '시니어반', type: 'lesson' }], [], [{ name: '시니어반', type: 'lesson' }], [], [], [], []],
        '11:00': [[{ name: '시니어반', type: 'lesson' }], [], [{ name: '시니어반', type: 'lesson' }], [], [], [], []],
        '12:00': [[], [], [], [], [], [], []],
        '13:00': [[], [], [], [], [], [], []],
        '14:00': [[], [{ name: '오후반', type: 'lesson' }], [], [{ name: '오후반', type: 'lesson' }], [], [], []],
        '15:00': [[], [{ name: '오후반', type: 'lesson' }], [], [{ name: '오후반', type: 'lesson' }], [], [], []],
        '16:00': [[], [], [], [], [], [], []],
        '17:00': [[], [{ name: '김철수', type: 'user' }], [{ name: '강습', type: 'lesson' }], [], [{ name: '이영희', type: 'user' }], [], []],
        '18:00': [[{ name: '강습', type: 'lesson' }], [{ name: '김철수', type: 'user' }], [{ name: '강습', type: 'lesson' }], [], [{ name: '이영희', type: 'user' }], [], []],
        '19:00': [[{ name: 'FC유나이티드', type: 'user' }], [], [{ name: 'FC유나이티드', type: 'user' }], [{ name: '최동원', type: 'user' }], [], [{ name: '강습', type: 'lesson' }], []],
        '20:00': [[{ name: 'FC유나이티드', type: 'user' }], [], [{ name: 'FC유나이티드', type: 'user' }], [], [], [{ name: '강습', type: 'lesson' }], []],
        '21:00': [[], [], [], [{ name: '나이트팀', type: 'user' }], [], [], []],
        '22:00': [[], [], [], [{ name: '나이트팀', type: 'user' }], [], [], []],
        '23:00': [[], [], [], [], [], [], []]
    },
    '야외2': {
        '06:00': [[], [], [], [], [], [], []],
        '07:00': [[], [], [], [], [], [], []],
        '08:00': [[], [], [], [], [], [], []],
        '09:00': [[], [], [], [], [], [], []],
        '10:00': [[], [], [], [], [], [], []],
        '11:00': [[], [], [], [], [], [], []],
        '12:00': [[], [], [], [], [], [], []],
        '13:00': [[{ name: '동호회', type: 'user' }], [{ name: '동호회', type: 'user' }], [], [], [], [], []],
        '14:00': [[], [], [], [], [], [], []],
        '15:00': [[], [], [], [], [], [], []],
        '16:00': [[], [], [], [], [], [], []],
        '17:00': [[{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [], []],
        '18:00': [[{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '유소년클럽', type: 'lesson' }], [{ name: '홍길동', type: 'user' }], [{ name: '홍길동', type: 'user' }]],
        '19:00': [[], [], [{ name: '야간조기회', type: 'user' }], [{ name: '야간조기회', type: 'user' }], [{ name: '야간조기회', type: 'user' }], [{ name: '정약용', type: 'user' }], []],
        '20:00': [[], [], [{ name: '야간조기회', type: 'user' }], [{ name: '야간조기회', type: 'user' }], [{ name: '야간조기회', type: 'user' }], [], []],
        '21:00': [[{ name: '심야풋살', type: 'user' }], [], [{ name: '심야풋살', type: 'user' }], [], [], [], []],
        '22:00': [[{ name: '심야풋살', type: 'user' }], [], [{ name: '심야풋살', type: 'user' }], [], [], [], []],
        '23:00': [[], [], [], [], [], [], []]
    },
    '야외3': {
        '06:00': [[], [], [], [], [], [], []],
        '07:00': [[], [], [], [], [], [], []],
        '08:00': [[{ name: '아침운동', type: 'user' }], [{ name: '아침운동', type: 'user' }], [], [], [], [], []],
        '09:00': [[], [], [], [], [], [], []],
        '10:00': [[], [], [], [], [], [], []],
        '11:00': [[], [], [], [], [], [], []],
        '12:00': [[], [], [], [], [], [], []],
        '13:00': [[], [], [], [], [], [], []],
        '14:00': [[], [], [{ name: '주말리그', type: 'user' }], [{ name: '주말리그', type: 'user' }], [], [], []],
        '15:00': [[], [], [{ name: '주말리그', type: 'user' }], [{ name: '주말리그', type: 'user' }], [], [], []],
        '16:00': [[], [], [], [], [], [], []],
        '17:00': [[], [], [], [], [], [], []],
        '18:00': [[], [], [], [], [], [], []],
        '19:00': [[{ name: '야외클럽3', type: 'user' }], [], [], [{ name: '야외클럽3', type: 'user' }], [], [], []],
        '20:00': [[{ name: '야외클럽3', type: 'user' }], [], [], [{ name: '야외클럽3', type: 'user' }], [], [], []],
        '21:00': [[], [], [], [], [], [], []],
        '22:00': [[], [], [], [], [], [], []],
        '23:00': [[], [], [], [], [], [], []]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initDynamicWeekCalendar();
    initStadiumTabs();
    initTimeOptions();
    renderTimetable(currentStadium);
});

function filterTime(type, btnElement) {
    currentTimeFilter = type;
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    renderTimetable(currentStadium);
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerText = '🔒';
    } else {
        input.type = 'password';
        btn.innerText = '👁️';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast-message');
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function submitCreate() {
    const agreeCheck = document.getElementById('create-agree');
    if (agreeCheck && !agreeCheck.checked) {
        alert('구장 이용 수칙 및 개인정보 이용에 동의해야 합니다.');
        return;
    }

    closeModal('modal-create');
    showToast('✓ 신규 예약이 등록되었습니다.');
}

function submitEdit() {
    closeModal('modal-edit');
    showToast('✓ 예약 정보가 수정되었습니다.');
}

function submitDelete() {
    closeModal('modal-edit');
    showToast('✓ 예약이 취소(삭제)되었습니다.');
}

function renderTimetable(stadiumName) {
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    const data = stadiumData[stadiumName] || {};
    let allTimes = Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

    if (currentTimeFilter === 'morning') {
        allTimes = allTimes.filter(t => parseInt(t) >= 6 && parseInt(t) <= 11);
    } else if (currentTimeFilter === 'afternoon') {
        allTimes = allTimes.filter(t => parseInt(t) >= 12 && parseInt(t) <= 17);
    } else if (currentTimeFilter === 'night') {
        allTimes = allTimes.filter(t => parseInt(t) >= 18 && parseInt(t) <= 23);
    }

    let html = '';

    allTimes.forEach(time => {
        html += `<tr>`;
        html += `<td class="time-col">${time}</td>`;

        const dayList = data[time] || [[], [], [], [], [], [], []];

        dayList.forEach((cellItems) => {
            html += `<td><div class="cell-content">`;
            
            cellItems.forEach(item => {
                if (item.type === 'user') {
                    html += `<span class="user-tag" onclick="openEditModal('${item.name}', '${time}', '')">${item.name}</span>`;
                } else if (item.type === 'lesson') {
                    html += `<span class="lesson-tag">${item.name}</span>`;
                }
            });

            html += `</div></td>`;
        });

        html += `</tr>`;
    });

    tbody.innerHTML = html;
}

function initDynamicWeekCalendar() {
    const today = new Date();
    const dayOfWeekNames = ['일', '월', '화', '수', '목', '금', '토'];
    weekDates = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i);
        
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        const dayName = dayOfWeekNames[currentDate.getDay()];
        
        const dateString = `${year}-${month}-${date}`;
        const displayLabel = `${month}/${date}(${dayName})`;
        
        weekDates.push({ dateString, displayLabel, dayName, isToday: i === 0 });
    }

    const headerButtons = document.querySelectorAll('.day-header-btn');
    const createSelect = document.getElementById('create-day');
    
    if (createSelect) createSelect.innerHTML = '';

    headerButtons.forEach((btn, index) => {
        if (weekDates[index]) {
            const dateInfo = weekDates[index];
            btn.innerHTML = `${dateInfo.displayLabel} ${dateInfo.isToday ? '<span style="color:#2563eb; font-weight:bold;">[오늘]</span>' : '<span>+신규</span>'}`;
            btn.setAttribute('onclick', `openCreateModal('${dateInfo.dateString}', '${dateInfo.displayLabel}')`);
            
            if (createSelect) {
                const option = document.createElement('option');
                option.value = dateInfo.dateString;
                option.text = dateInfo.displayLabel;
                createSelect.appendChild(option);
            }
        }
    });
}

function initStadiumTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentStadium = this.innerText.trim();
            
            const stadiumBadge = document.getElementById('create-stadium-badge');
            if (stadiumBadge) stadiumBadge.innerText = currentStadium;

            renderTimetable(currentStadium);
        });
    });
}

function initTimeOptions() {
    const createStart = document.getElementById('create-start');
    const createEnd = document.getElementById('create-end');
    
    if (createStart && createEnd) {
        createStart.innerHTML = '';
        createEnd.innerHTML = '';
        
        for (let i = 6; i <= 23; i++) {
            const timeStr = `${String(i).padStart(2, '0')}:00`;
            const nextTimeStr = `${String(i + 1).padStart(2, '0')}:00`;

            const optStart = document.createElement('option');
            optStart.value = timeStr;
            optStart.text = timeStr;
            createStart.appendChild(optStart);

            const optEnd = document.createElement('option');
            optEnd.value = nextTimeStr;
            optEnd.text = nextTimeStr;
            createEnd.appendChild(optEnd);
        }
    }
}

function openCreateModal(dateString, displayLabel) {
    const daySelect = document.getElementById('create-day');
    if (daySelect) daySelect.value = dateString;

    updateBadge(displayLabel);

    const stadiumBadge = document.getElementById('create-stadium-badge');
    if (stadiumBadge) stadiumBadge.innerText = currentStadium;

    const modal = document.getElementById('modal-create');
    if (modal) modal.classList.add('active');
}

function openEditModal(userName, startTime, endTime) {
    const idInput = document.getElementById('edit-id');
    if (idInput) idInput.value = `${userName} (010-****-5678)`;

    const startOpt = document.getElementById('edit-start-opt');
    if (startOpt) {
        startOpt.text = startTime;
        startOpt.value = startTime;
    }

    const modal = document.getElementById('modal-edit');
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function updateBadge(displayLabel) {
    const badge = document.getElementById('create-day-badge');
    if (badge) badge.innerText = displayLabel;
}

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
});
