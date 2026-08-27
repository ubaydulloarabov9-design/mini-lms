// Parolni ko'rsatish/yashirish (ko'z belgisi)
const EYE_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
</svg>`;

const EYE_CLOSED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-1.912.263l1.359 1.359a4.5 4.5 0 0 1 4.622 4.622l1.941 1.936zm-1.933 1.331-1.55-1.549q-.045.003-.088-.001a2.5 2.5 0 0 1-2.4-2.4l-1.55-1.549a4.5 4.5 0 0 0 5.588 5.499zM3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.379-.135 1.985-.35l1.988 1.988a.5.5 0 0 0 .707-.707l-11-11a.5.5 0 0 0-.707.707zm5.223 5.223-3.294-3.294A2.5 2.5 0 0 0 8.573 10.7z"/>
</svg>`;

function togglePassword(fieldId, btn) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = EYE_CLOSED;
  } else {
    input.type = 'password';
    btn.innerHTML = EYE_OPEN;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.innerHTML = EYE_OPEN;
  });
});
