// Cập nhật Đồng hồ hệ thống thời gian thực tại thanh Subbar
function updateClock() {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    let now = new Date();
    let dayName = days[now.getDay()];
    let dateStr = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth()+1).padStart(2, '0') + '/' + now.getFullYear();
    let timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock-display').innerHTML = `<i class="far fa-clock text-blue-500 mr-1"></i> ${dayName}, ${dateStr} - ${timeStr}`;
}
setInterval(updateClock, 1000);
updateClock();

// Kiểm tra phiên đăng nhập người dùng khi vừa tải trang
window.addEventListener('DOMContentLoaded', () => {
    let user = localStorage.getItem("currentUser");
    if (user) {
        renderUserState(JSON.parse(user));
    }
});

function renderUserState(userObj) {
    document.getElementById('auth-buttons').classList.add('hidden');
    let loggedBox = document.getElementById('user-logged-in');
    loggedBox.classList.remove('hidden');
    document.getElementById('user-display-name').innerText = userObj.name;
    document.getElementById('user-avatar-text').innerText = userObj.name.charAt(0).toUpperCase();
}

// Thực hiện xử lý hành vi Đăng nhập tài khoản mẫu
function submitLogin() {
    let u = document.getElementById('login-username').value.trim();
    let p = document.getElementById('login-password').value.trim();

    if (!u || !p) {
        alert("Vui lòng không để trống ô dữ liệu tài khoản!");
        return;
    }

    let fakeUser = null;
    if (u === 'admin' && p === 'admin123') {
        fakeUser = { username: 'admin', name: 'Nguyễn Văn A', role: 'admin' };
    } else {
        fakeUser = { username: u, name: u, role: 'candidate' };
    }

    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    renderUserState(fakeUser);
    closeModal('login-modal');
    alert(`Đăng nhập thành công! Chào mừng ${fakeUser.name} gia nhập hệ thống.`);
    
    if(fakeUser.role === 'admin') {
        showSection('admin-page');
    }
}

// Đăng xuất tài khoản
function logout() {
    localStorage.removeItem("currentUser");
    document.getElementById('user-logged-in').classList.add('hidden');
    document.getElementById('auth-buttons').classList.remove('hidden');
    showSection('home-page');
    alert("Đã đăng xuất tài khoản an toàn khỏi hệ thống.");
}

// Xử lý nộp đơn ứng tuyển nhanh
function applyJob(jobTitle) {
    let user = localStorage.getItem("currentUser");
    if (!user) {
        alert(`Bạn cần đăng nhập tài khoản để ứng tuyển vị trí: \n"${jobTitle}"`);
        openModal('login-modal');
        return;
    }
    alert(`Nộp đơn thành công vị trí: \n"${jobTitle}"! Nhà tuyển dụng sẽ sớm liên hệ với bạn.`);
}

// Admin thêm công việc mới vào giao diện
function adminAddJob() {
    let title = document.getElementById('admin-job-title').value.trim();
    let company = document.getElementById('admin-job-company').value.trim();
    let loc = document.getElementById('admin-job-location').value;
    let salary = document.getElementById('admin-job-salary').value.trim();
    let tag = document.getElementById('admin-job-tag').value.trim();

    if (!title || !company || !salary) {
        alert("Vui lòng nhập đầy đủ các trường thông tin gắn dấu hoa thị (*)");
        return;
    }

    let container = document.getElementById('job-container');
    let newItem = document.createElement('div');
    newItem.className = "job-item bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-blue-400/50 transition relative flex flex-col md:flex-row justify-between gap-4";
    newItem.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-sm flex-shrink-0">NEW</div>
            <div>
                <h3 class="text-xs font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition">${title}</h3>
                <p class="text-[11px] text-gray-500 font-semibold mt-0.5">${company}</p>
                <div class="flex flex-wrap gap-2 mt-2 text-[10px] font-medium">
                    <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200/50"><i class="fas fa-map-marker-alt text-red-400 mr-1"></i> ${loc}</span>
                    <span class="bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100"><i class="fas fa-dollar-sign mr-1"></i> ${salary}</span>
                    ${tag ? `<span class="bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100"><i class="fas fa-tags mr-1"></i> ${tag}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="flex md:flex-col justify-between items-end border-t md:border-t-0 pt-2 md:pt-0 border-gray-100">
            <span class="text-[10px] text-gray-400 font-medium"><i class="far fa-clock mr-1"></i> Vừa đăng xong</span>
            <button onclick="applyJob('${title}')" class="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition active:scale-95 shadow-sm">Ứng tuyển</button>
        </div>
    `;
    container.insertBefore(newItem, container.firstChild);
    
    // Khôi phục form
    document.getElementById('admin-job-title').value = '';
    document.getElementById('admin-job-company').value = '';
    document.getElementById('admin-job-salary').value = '';
    document.getElementById('admin-job-tag').value = '';
    
    alert("Tin tuyển dụng đã được phát hành và đẩy lên đầu trang chủ thành công!");
    showSection('home-page');
}

// Chuyển đổi tab con trong Dashboard Admin
function switchAdminSubTab(tab) {
    document.querySelectorAll('.admin-subview').forEach(el => el.classList.add('hidden'));
    document.getElementById(`admin-subtab-${tab}`).classList.remove('hidden');
}

// Hàm đổi Trang (Ẩn/Hiện section màn hình)
function showSection(sectionId) {
    if (sectionId === 'admin-page') {
        let current = JSON.parse(localStorage.getItem("currentUser"));
        if(!current || current.role !== 'admin') {
            alert("Quyền truy cập bị từ chối! Chỉ Admin tài khoản Nguyễn Văn A mới được quyền vào khu vực này.");
            openModal('login-modal');
            return;
        }
    }
    document.querySelectorAll('.dynamic-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hàm mở cửa sổ Modal Popup
function openModal(id) { 
    document.getElementById(id).classList.remove('hidden'); 
    document.getElementById(id).classList.remove('opacity-0'); 
}

// Hàm đóng cửa sổ Modal Popup
function closeModal(id) { 
    document.getElementById(id).classList.add('hidden'); 
}

// Lọc tìm kiếm việc làm tại chỗ
function searchJob() {
    let kw = document.getElementById("txtSearch").value.toLowerCase();
    document.querySelectorAll(".job-item").forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(kw) ? "block" : "none";
    });
}