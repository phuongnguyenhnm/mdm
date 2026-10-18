$(document).ready(function() {
    // 1. Đọc file name.txt cho tiêu đề
    $.ajax({
        url: 'name.txt',
        dataType: 'text',
    }).done(function(data) {
        $('.header').text(data.trim());
    }).fail(function() {
        console.error('Không thể tải file name.txt');
    });

    // 2. Khởi tạo mã QR
    createQRCode();
    $('#generate').click(createQRCode);

    // 3. Đồng hồ thời gian thực ở trên cùng mã QR
    function updateDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}  `;
        const timeString = `${hours}:${minutes}:${seconds}`;
        const el = document.getElementById('currentDatetime');
        if (el) el.innerText = `${dateString}       ${timeString}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 4. Đồng hồ thời gian tĩnh (20:xx:xx) cho trạng thái mở đầu
    function updateStaticTimer() {
        const now = new Date();
        now.setHours(now.getHours() + 20);
        now.setMinutes(now.getMinutes() - 20);
        now.setSeconds(now.getSeconds() - 20);
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `20:${minutes}:${seconds}`;
        const el = document.getElementById('currentDatetime1');
        if (el) el.innerText = timeString;
    }
    updateStaticTimer();
    setInterval(updateStaticTimer, 1000);

    // 5. Bộ đếm giây (00:00) khi đã chuyển chế độ
    let countingSeconds = 0;
    let countingInterval = null;
    const countingTimeEl = document.getElementById('greenCountingTime');

    function startCountingTimer() {
        countingSeconds = 0;
        if (countingTimeEl) countingTimeEl.innerText = '00:00';
        if (countingInterval) clearInterval(countingInterval);
        countingInterval = setInterval(() => {
            countingSeconds++;
            const minutes = String(Math.floor(countingSeconds / 60)).padStart(2, '0');
            const seconds = String(countingSeconds % 60).padStart(2, '0');
            if (countingTimeEl) countingTimeEl.innerText = `${minutes}:${seconds}`;
        }, 1000);
    }

    // 6. Logic bấm giữ màn hình 5s chống rung tay để chuyển đổi chế độ
    let pressTimer = null;
    let startX = 0;
    let startY = 0;
    const body = document.body;

    function startLongPress(e) {
        if ($(e.target).closest('.rf').length > 0 || e.target.id === 'generate' || e.target.id === 'applyLeaveBtn') return;

        if (e.touches && e.touches.length > 0) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }

        if (pressTimer === null) {
            pressTimer = setTimeout(() => {
                if (body.classList.contains('yellow-mode')) {
                    body.classList.remove('yellow-mode');
                    body.classList.add('green-mode');
                } else {
                    body.classList.remove('green-mode');
                    body.classList.add('yellow-mode');
                }

                // Khi chuyển đổi sẽ kích hoạt bộ đếm giây từ 00:00
                startCountingTimer();

                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
                pressTimer = null;
            }, 5000); // Giữ 5 giây
        }
    }

    function checkTouchMove(e) {
        if (pressTimer !== null && e.touches && e.touches.length > 0) {
            const moveX = e.touches[0].clientX;
            const moveY = e.touches[0].clientY;
            if (Math.abs(moveX - startX) > 15 || Math.abs(moveY - startY) > 15) {
                cancelLongPress();
            }
        }
    }

    function cancelLongPress() {
        if (pressTimer !== null) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    }

    window.addEventListener('mousedown', startLongPress);
    window.addEventListener('mouseup', cancelLongPress);
    window.addEventListener('mouseleave', cancelLongPress);

    window.addEventListener('touchstart', startLongPress, { passive: true });
    window.addEventListener('touchmove', checkTouchMove, { passive: true });
    window.addEventListener('touchend', cancelLongPress);
    window.addEventListener('touchcancel', cancelLongPress);
});

function generateRandomString(length = 200) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=/\_-+';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function createQRCode() {
    const randomData = generateRandomString(100);
    $('#qrcode').empty();
    $('#qrcode'].qrcode({
        text: randomData,
        width: 240,
        height: 240,
        render: 'image',
        ecLevel: 'H'
    });
}
