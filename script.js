// 전역 변수: 현재 선택된 구장명 및 일주일 날짜 정보
let currentStadium = '구장1';
let weekDates = [];

// [예시 데이터] 12시부터 23시까지의 구장별 mock 데이터
const stadiumData = {
    '구장1': {
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
    '구장2': {
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
    '구장3': {
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
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initDynamicWeekCalendar();
    initStadiumTabs();
    initTimeOptions();
    renderTimetable(currentStadium);
});

/**
 * 모달 창 내부의 시간 선택 셀렉트 박스 옵션을 12시~23시로 생성
 */
function initTimeOptions() {
    const createStart = document.getElementById('create-start');
    const createEnd = document.getElementById('create-end');
    
    if (createStart && createEnd) {
        createStart.innerHTML = '';
        createEnd.innerHTML = '';
        
        for (let i = 12; i <= 23; i++) {
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

/**
 * 오늘 날짜 기준으로 일주일(7일)의 날짜와 요일을 계산하여 테이블 헤더에 바인딩
 */
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
        
        weekDates.push({
            dateString: dateString,
            displayLabel: displayLabel,
            dayName: dayName,
            isToday: i === 0
        });
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

/**
 * 구장 탭 전환 이벤트
 */
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

/**
 * 12:00 ~ 23:00 시간대 타임테이블 동적 렌더링
 */
function renderTimetable(stadiumName) {
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    const data = stadiumData[stadiumName] || {};
    // 12시부터 23시까지 시간 목록 생성
    const times = Array.from({ length: 12 }, (_, i) => `${String(i + 12).padStart(2, '0')}:00`);
    let html = '';

    times.forEach(time => {
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

/**
 * [신규] 예약 모달 켜기
 */
function openCreateModal(dateString, displayLabel) {
    const daySelect = document.getElementById('create-day');
    if (daySelect) daySelect.value = dateString;

    updateBadge(displayLabel);

    const stadiumBadge = document.getElementById('create-stadium-badge');
    if (stadiumBadge) stadiumBadge.innerText = currentStadium;

    const modal = document.getElementById('modal-create');
    if (modal) modal.classList.add('active');
}

/**
 * [수정/삭제] 예약 모달 켜기
 */
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

/**
 * 모달 닫기
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

/**
 * 신규 모달 내 날짜 배지 업데이트
 */
function updateBadge(displayLabel) {
    const badge = document.getElementById('create-day-badge');
    if (badge) badge.innerText = displayLabel;
}

// 모달 바깥 배경 클릭 시 닫기
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
});