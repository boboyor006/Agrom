// script.js
const form = document.getElementById('registerForm');
const message = document.getElementById('message');

let API_URL = '';

// 1. api.json dan hostni olish
async function loadApiUrl() {
  try {
    const response = await fetch('./api.json');
    if (!response.ok) throw new Error('api.json topilmadi');
    const data = await response.json();
    API_URL = data.host;
    console.log('✅ API yuklandi:', API_URL);
  } catch (error) {
    console.error('❌ Xato:', error);
    message.textContent = 'API manzil yuklanmadi (api.json)';
    message.classList.add('error');
  }
}

// 2. Sahifa yuklanganda api.json ni o‘qi
// ⚠️ Avval API yuklansin, keyin forma ishga tushsin
document.addEventListener('DOMContentLoaded', async () => {
  await loadApiUrl();

  // Endi form submit hodisasini shu yerda ulaymiz
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!API_URL) {
      message.textContent = 'API hali yuklanmadi.';
      message.classList.add('error');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const userData = { name, email, password };

    message.textContent = 'Yuborilmoqda...';
    message.className = '';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('userName', result.user?.name || name);
        }

        message.textContent = "✅ Muvaffaqiyatli ro'yxatdan o'tdingiz!";
        message.className = 'success';
        form.reset();

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        message.textContent = result.message || result.error || 'Xatolik yuz berdi';
        message.className = 'error';
      }
    } catch (error) {
      console.error('❌ Xatolik:', error);
      message.textContent = 'Server bilan aloqa yo‘q yoki API ishlamayapti.';
      message.className = 'error';
    }
  });
});
