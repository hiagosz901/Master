/* HIDRO MASTER - script.js */

const WHATSAPP_NUMBER = '5511930305957';

async function loadIncludes() {
  const placeholders = document.querySelectorAll('[data-include]');

  await Promise.all(Array.from(placeholders).map(async (placeholder) => {
    const file = placeholder.getAttribute('data-include');
    if (!file) return;

    const response = await fetch(file, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Nao foi possivel carregar ${file}`);
    }

    placeholder.outerHTML = await response.text();
  }));
}

function setFormStatus(message, type = 'success') {
  const status = document.getElementById('form-success');
  if (!status) return;

  status.textContent = message;
  status.style.display = 'block';
  status.classList.toggle('is-error', type === 'error');
}

function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const nome = document.getElementById('nome').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('msg').value.trim();

  if (!nome) {
    setFormStatus('Informe seu nome para continuar.', 'error');
    document.getElementById('nome').focus();
    return;
  }

  const text = [
    'Ola! Vim pelo site da Hidro Master.',
    '',
    `Nome: ${nome}`,
    `Telefone: ${tel || 'Nao informado'}`,
    `E-mail: ${email || 'Nao informado'}`,
    `Mensagem: ${msg || 'Sem mensagem'}`
  ].join('\n');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Abrindo WhatsApp...';
  }

  window.location.href = url;
  setFormStatus('Abrimos o WhatsApp com sua mensagem pronta para envio.');
  form.reset();

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Enviar pelo WhatsApp';
    }
  }, 700);
}

function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09 });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

function initNav() {
  const nav = document.querySelector('body > nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));

        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach((section) => sectionObserver.observe(section));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');

      if (!href || href === '#') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

async function initPage() {
  try {
    await loadIncludes();
    initReveal();
    initNav();
    initSmoothScroll();
  } catch (error) {
    console.error(error);
  }
}

window.handleSubmit = handleSubmit;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
