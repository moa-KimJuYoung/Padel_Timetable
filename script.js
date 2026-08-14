const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIhU4Fn_PUxtCv3Nzi7b4J7lGfeXqUJgeJutLfDQvC4JRkcTjfFkps3Syp6yjv3pYs/exec';

let currentStadium = '실내';
let currentTimeFilter = 'all'; // 'all', 't06_11', 't09_14', 't12_17', 't15_20', 't18_23'
let weekDates = [];
let rawReservationsList = []; // 시트에서 가져온 원본 예약 데이터
let stadiumData = {};         // 타임테이블 렌더링용 변환 데이터

document.addEventListener('DOMContentLoaded', function() {
    initDynamicWeekCalendar();
    initStadiumTabs();
    initTimeOptions();
    fetchSheetData(); // 🚀 구글 시트에서 실시간 데이터 불러오기
});

// =========================================================
// 1. 구글 스프레드시트 데이터 연동 (조회)
// =========================================================
function fetchSheetData() {
    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            // 📢 1) 공지사항 반영
            const noticeArea = document.getElementById('notice-display-area');
            if (noticeArea && data.notices && data.notices.length > 0) {
                // 여러 줄의 공지사항을 줄바꿈/불릿 기호로 묶어서 표시
                noticeArea.innerHTML = data.notices.map(notice => `<div>📢 ${notice}</div>`).join('');
            }            
            // const noticeArea = document.getElementById('notice-display-area');
            // if (noticeArea && data.notice) {
            //     noticeArea.innerText = data.notice;
            // }

            // 📅 2) 예약 데이터 변환 및 타임테이블 렌더링
            rawReservationsList = data.reservations || [];
            parseSheetData(rawReservationsList);
            renderTimetable(currentStadium);
        })
        .catch(error => {
            console.error('Data Fetch Error:', error);
            showToast('❌ 데이터를 불러오는데 실패했습니다.');
            renderTimetable(currentStadium);
        });
}

// 시트 배열 데이터를 타임테이블 구조로 변환
function parseSheetData(rows) {
    stadiumData = { '실내': {}, '야외1': {}, '야외2': {}, '야외3': {} };

    rows.forEach(row => {
        // [날짜, 구장, 시간, 사용자명, 등록일시]
        const [date, stadium, time, name] = row;
        if (!stadiumData[stadium]) stadiumData[stadium] = {};
        if (!stadiumData[stadium][time]) {
            stadiumData[stadium][time] = [[], [], [], [], [], [], []];
        }

        // 현재 7일 달력 중 일치하는 요일 인덱스(0~6) 찾기
        const dayIndex = weekDates.findIndex(d => d.dateString === date);
        if (dayIndex !== -1) {
            stadiumData[stadium][time][dayIndex].push({
                name: name,
                date: date,
                time: time,
                stadium: stadium,
                type: 'user'
            });
        }
    });
}

// =========================================================
// 2. 예약 생성 / 삭제 (POST 요청)
// =========================================================
function submitCreate() {
    const agreeCheck = document.getElementById('create-agree');
    if (agreeCheck && !agreeCheck.checked) {
        alert('구장 이용 수칙 및 개인정보 이용에 동의해야 합니다.');
        return;
    }

    const name = document.getElementById('create-id').value.trim();
    const pw = document.getElementById('create-pw').value.trim();
    const date = document.getElementById('create-day').value;
    const time = document.getElementById('create-start').value;

    if (!name || !pw) {
        alert('사용자 이름과 비밀번호를 모두 입력해 주세요.');
        return;
    }

    const payload = {
        action: 'create',
        date: date,
        stadium: currentStadium,
        time: time,
        id: name,
        pw: pw
    };

    sendToGoogleSheet(payload, 'modal-create', '✓ 신규 예약이 성공적으로 등록되었습니다.');
}

function submitDelete() {
    const name = document.getElementById('edit-id').value.trim();
    const pw = document.getElementById('edit-pw').value.trim();
    const time = document.getElementById('edit-start-opt').value;
    const date = weekDates[0].dateString; // 선택된 날짜 기준

    if (!pw) {
        alert('사용자 비밀번호를 입력해 주세요.');
        return;
    }

    const payload = {
        action: 'delete',
        date: date,
        stadium: currentStadium,
        time: time,
        id: name,
        pw: pw
    };

    sendToGoogleSheet(payload, 'modal-edit', '🗑️ 예약이 삭제(취소)되었습니다.');
}

function sendToGoogleSheet(payload, modalId, successMessage) {
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(result => {
        if (result === 'auth_failed') {
            alert('🔒 비밀번호가 일치하지 않습니다.\n(최초 등록한 본인 비밀번호를 입력해 주세요)');
        } else {
            closeModal(modalId);
            showToast(successMessage);
            fetchSheetData(); // 시트 변경 즉시 화면 재갱신
        }
    })
    .catch(err => {
        console.error('Submit Error:', err);
        showToast('❌ 처리 중 오류가 발생했습니다.');
    });
}

// =========================================================
// 3. UI 렌더링 및 모달 제어
// =========================================================
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

function renderTimetable(stadiumName) {
    const tbody = document.getElementById('timetable-body');
    if (!tbody) return;

    const data = stadiumData[stadiumName] || {};
    let allTimes = Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

    if (currentTimeFilter === 't06_11') {
        allTimes = allTimes.filter(t => parseInt(t) >= 6 && parseInt(t) <= 11);
    } else if (currentTimeFilter === 't09_14') {
        allTimes = allTimes.filter(t => parseInt(t) >= 9 && parseInt(t) <= 14);
    } else if (currentTimeFilter === 't12_17') {
        allTimes = allTimes.filter(t => parseInt(t) >= 12 && parseInt(t) <= 17);
    } else if (currentTimeFilter === 't15_20') {
        allTimes = allTimes.filter(t => parseInt(t) >= 15 && parseInt(t) <= 20);
    } else if (currentTimeFilter === 't18_23') {
        allTimes = allTimes.filter(t => parseInt(t) >= 18 && parseInt(t) <= 23);
    }

    const now = new Date();
    const currentHour = now.getHours();

    let html = '';

    allTimes.forEach(time => {
        const rowHour = parseInt(time.split(':')[0]);
        let badgeHtml = '';

        if (rowHour < currentHour) {
            badgeHtml = '<span class="past-badge">🔚종료</span>';
        } else if (rowHour === currentHour) {
            badgeHtml = '<span class="live-badge">🟢LIVE</span>';
        }

        html += `<tr>`;
        html += `<td class="time-col">${time}${badgeHtml}</td>`;

        const dayList = data[time] || [[], [], [], [], [], [], []];

        dayList.forEach((cellItems, dayIndex) => {
            let todayStatusClass = '';

            if (dayIndex === 0) {
                if (rowHour < currentHour) {
                    todayStatusClass = 'today-past';
                } else if (rowHour === currentHour) {
                    todayStatusClass = 'today-live';
                } else {
                    todayStatusClass = 'today-future';
                }
            }

            html += `<td class="${todayStatusClass}"><div class="cell-content">`;
            
            cellItems.forEach(item => {
                html += `<span class="user-tag" onclick="openEditModal('${item.name}', '${time}')">${item.name}</span>`;
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
    const thElements = document.querySelectorAll('.timetable thead th');
    const createSelect = document.getElementById('create-day');
    
    if (createSelect) createSelect.innerHTML = '';

    headerButtons.forEach((btn, index) => {
        if (weekDates[index]) {
            const dateInfo = weekDates[index];
            
            if (dateInfo.isToday) {
                btn.classList.add('today-btn');
                if (thElements[index + 1]) thElements[index + 1].classList.add('today-header');
            }

            btn.innerHTML = `${dateInfo.displayLabel} ${dateInfo.isToday ? '<span style="color:#0284c7; font-weight:bold;">[오늘]</span>' : '<span>+신규</span>'}`;
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

    // 입력 필드 초기화
    document.getElementById('create-id').value = '';
    document.getElementById('create-pw').value = '';

    const modal = document.getElementById('modal-create');
    if (modal) modal.classList.add('active');
}

function openEditModal(userName, startTime) {
    const idInput = document.getElementById('edit-id');
    if (idInput) idInput.value = userName;

    const pwInput = document.getElementById('edit-pw');
    if (pwInput) pwInput.value = '';

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
