const CARS = [
  {
    brand: "BMW",
    model: "BMW M5 CS",
    price: "On request",
    year: "2022",
    drivetrain: "AWD (M xDrive)",
    highlight: "Limited-run M flagship with track-bred aggression.",
    tags: ["Limited", "M Performance", "Luxury Sedan"],
    colors: {
      black: {
        exterior: [
          "images/bmw/black/exterior1.png",
          "images/bmw/black/exterior2.png",
        ],
        interior: ["images/bmw/black/interior1.png"],
      },
      red: {
        exterior: [
          "images/bmw/red/exterior1.png",
          "images/bmw/red/exterior2.png",
        ],
        interior: ["images/bmw/red/interior1.png"],
      },
      blue: {
        exterior: [
          "images/bmw/blue/exterior1.png",
          "images/bmw/blue/exterior2.png",
        ],
        interior: ["images/bmw/blue/interior1.png"],
      },
    },
  },
  {
    brand: "Mercedes",
    model: "Mercedes-AMG GT R",
    price: "On request",
    year: "2020",
    drivetrain: "RWD",
    highlight: "Motorsport-inspired aero and signature AMG presence.",
    tags: ["AMG", "Track Focused", "Coupe"],
    colors: {
      black: {
        exterior: [
          "images/mercedes/black/exterior1.png",
          "images/mercedes/black/exterior2.png",
        ],
        interior: ["images/mercedes/black/interior1.png"],
      },
      red: {
        exterior: [
          "images/mercedes/red/exterior1.png",
          "images/mercedes/red/exterior2.png",
        ],
        interior: ["images/mercedes/red/interior1.png"],
      },
      blue: {
        exterior: [
          "images/mercedes/blue/exterior1.png",
          "images/mercedes/blue/exterior2.png",
        ],
        interior: ["images/mercedes/blue/interior1.png"],
      },
    },
  },
  {
    brand: "Audi",
    model: "Audi RS6 Avant",
    price: "On request",
    year: "2023",
    drivetrain: "quattro AWD",
    highlight: "Supercar pace in an executive Avant silhouette.",
    tags: ["RS", "Avant", "quattro"],
    colors: {
      black: {
        exterior: [
          "images/audi/black/exterior1.png",
          "images/audi/black/exterior2.png",
        ],
        interior: ["images/audi/black/interior1.png"],
      },
      red: {
        exterior: [
          "images/audi/red/exterior1.png",
          "images/audi/red/exterior2.png",
        ],
        interior: ["images/audi/red/interior1.png"],
      },
      blue: {
        exterior: [
          "images/audi/blue/exterior1.png",
          "images/audi/blue/exterior2.png",
        ],
        interior: ["images/audi/blue/interior1.png"],
      },
    },
  },
  {
    brand: "Porsche",
    model: "Porsche 911 Turbo S",
    price: "On request",
    year: "2021",
    drivetrain: "AWD",
    highlight: "The benchmark for everyday supercar performance.",
    tags: ["Turbo S", "Iconic", "Supercar"],
    colors: {
      black: {
        exterior: [
          "images/porsche/black/exterior1.png",
          "images/porsche/black/exterior2.png",
        ],
        interior: ["images/porsche/black/interior1.png"],
      },
      red: {
        exterior: [
          "images/porsche/red/exterior1.png",
          "images/porsche/red/exterior2.png",
        ],
        interior: ["images/porsche/red/interior1.png"],
      },
      blue: {
        exterior: [
          "images/porsche/blue/exterior1.png",
          "images/porsche/blue/exterior2.png",
        ],
        interior: ["images/porsche/blue/interior1.png"],
      },
    },
  },
];

const BRANDS = ["All", "BMW", "Mercedes", "Audi", "Porsche",];
const COLOR_ORDER = ["black", "red", "blue"];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toast(msg = "Saved") {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => t.classList.remove("show"), 1600);
}

function setBg(el, url) {
  if (!el) return;
  el.style.backgroundImage = `url('${url}')`;
}

async function apiRequest(action, { method = "GET", body = null } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
  };
  if (body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(`api.php?action=${encodeURIComponent(action)}`, opts);

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = { success: false, message: "Invalid server response" };
  }

  if (!res.ok && data && typeof data === "object") {
    data.http_status = res.status;
  }
  return data;
}

const carColorState = new Map();

function getCarColor(car) {
  return carColorState.get(car.model) || "black";
}
function setCarColor(car, color) {
  carColorState.set(car.model, color);
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("gm_favorites") || "[]");
  } catch {
    return [];
  }
}

function setFavorites(arr) {
  localStorage.setItem("gm_favorites", JSON.stringify(arr));
}

function isFavorite(model) {
  return getFavorites().includes(model);
}

function toggleFavorite(model) {
  const favs = getFavorites();
  if (favs.includes(model)) {
    setFavorites(favs.filter((m) => m !== model));
    return false;
  } else {
    setFavorites([...favs, model]);
    return true;
  }
}

function renderFavorites() {
  const grid = $("#favGrid");
  const empty = $("#favEmpty");
  if (!grid || !empty) return;

  const favs = getFavorites();
  grid.innerHTML = "";

  if (favs.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  favs.forEach((model) => {
    const car = CARS.find((c) => c.model === model);
    if (!car) return;

    const color = getCarColor(car);
    const img =
      car.colors?.[color]?.exterior?.[0] || car.colors.black.exterior[0];

    const card = document.createElement("div");
    card.className = "favCard";
    card.innerHTML = `
      <div class="favThumb"></div>
      <div class="favInfo">
        <b>${car.model}</b>
        <span>${car.brand} • ${car.year}</span>
        <span style="color: var(--accent)">${car.price}</span>
      </div>
    `;
    setBg(card.querySelector(".favThumb"), img);

    card.addEventListener("click", () => {
      go("available");
      openCar(car);
    });

    grid.appendChild(card);
  });
}

const pages = $$(".page");
const navLinks = $$("[data-route]");
const topbar = $("#topbar");

function go(route) {
  const id = `page-${route}`;
  const target = document.getElementById(id);
  if (!target) return;

  pages.forEach((p) => p.classList.remove("active"));
  target.classList.add("active");
  target.classList.remove("fadePage");
  void target.offsetWidth;
  target.classList.add("fadePage");

  navLinks.forEach((a) =>
    a.classList.toggle("active", a.dataset.route === route),
  );

  closeDrawer();
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", `#${route}`);

  if (route === "profile") renderFavorites();

  requestAnimationFrame(() => observeReveals());
}

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    const route = a.dataset.route;
    if (route) {
      e.preventDefault();
      go(route);
    }
  });
});

$$("[data-goto]").forEach((btn) => {
  btn.addEventListener("click", () => go(btn.dataset.goto));
});

function routeFromHash() {
  const h = (location.hash || "#home").replace("#", "");
  const route = [
    "home",
    "available",
    "buying",
    "about",
    "contact",
    "signin",
    "signup",
    "profile",
  ].includes(h)
    ? h
    : "home";
  go(route);
}
window.addEventListener("hashchange", routeFromHash);

const drawer = $("#drawer");
const hamburger = $("#hamburger");
const drawerClose = $("#drawerClose");

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
hamburger?.addEventListener("click", openDrawer);
drawerClose?.addEventListener("click", closeDrawer);
drawer?.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});

const filtersEl = $("#filters");
const inventoryEl = $("#inventory");
const searchInput = $("#searchInput");

let activeBrand = "All";

function renderFilters() {
  if (!filtersEl) return;
  filtersEl.innerHTML = "";
  BRANDS.forEach((b) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "seg" + (b === activeBrand ? " active" : "");
    btn.textContent = b;
    btn.addEventListener("click", () => {
      activeBrand = b;
      renderFilters();
      renderInventory();
    });
    filtersEl.appendChild(btn);
  });
}

function matches(car, q) {
  if (!q) return true;
  const s = (car.brand + " " + car.model).toLowerCase();
  return s.includes(q.toLowerCase().trim());
}

function renderInventory() {
  if (!inventoryEl) return;

  const q = (searchInput?.value || "").trim();
  inventoryEl.innerHTML = "";

  const list = CARS.filter((c) => {
    const brandOk = activeBrand === "All" ? true : c.brand === activeBrand;
    return brandOk && matches(c, q);
  });

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "panel";
    empty.style.gridColumn = "1 / -1";
    empty.innerHTML = `
      <div class="panelHeader" style="padding-bottom:12px">
        <h3>No results</h3>
        <p>Try another brand filter or search term.</p>
      </div>
    `;
    inventoryEl.appendChild(empty);
    return;
  }

  list.forEach((car) => {
    const card = document.createElement("div");
    card.className = "carCard reveal";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open ${car.model}`);

    const fav = isFavorite(car.model);

    card.innerHTML = `
      <div class="carImg">
        <button class="favBtn ${fav ? "active" : ""}" data-model="${car.model}" type="button" aria-label="Favorite">❤</button>
      </div>

      <div class="carInfo">
        <div>
          <div class="tagRow">
            <span class="tag accent">${car.brand}</span>
            ${car.tags
              .slice(0, 2)
              .map((t) => `<span class="tag">${t}</span>`)
              .join("")}
          </div>
          <h3>${car.model}</h3>
          <p>${car.highlight}</p>
        </div>

        <div class="carBottom">
          <div class="price">${car.price}</div>
          <div class="hint">
            View exterior & interior
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M13 5l7 7-7 7M4 12h15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    `;

    const color = getCarColor(car);
    setBg(card.querySelector(".carImg"), car.colors[color].exterior[0]);

    const favBtn = card.querySelector(".favBtn");
    if (favBtn) {
      favBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const model = favBtn.dataset.model;
        toggleFavorite(model);

        favBtn.classList.toggle("active");
        renderFavorites?.();
        toast(
          isFavorite(model) ? "Added to favorites" : "Removed from favorites",
        );
      });
    }

    card.addEventListener("click", (e) => {
      if (e.target.closest(".favBtn")) return;
      openCar(car);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (document.activeElement?.classList?.contains("favBtn")) return;
        openCar(car);
      }
    });

    inventoryEl.appendChild(card);
  });

  observeReveals();
}

searchInput?.addEventListener("input", renderInventory);

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".favBtn");
  if (!btn) return;

  e.stopPropagation();

  const model = btn.dataset.model;
  const nowFav = toggleFavorite(model);
  btn.classList.toggle("active", nowFav);

  renderFavorites();
});

const modal = $("#modal");
const modalClose = $("#modalClose");
const modalTitle = $("#modalTitle");
const galleryImg = $("#galleryImg");
const tabs = $("#tabs");
const prevImg = $("#prevImg");
const nextImg = $("#nextImg");
const detailName = $("#detailName");
const detailDesc = $("#detailDesc");
const detailKV = $("#detailKV");
const reserveBtn = $("#reserveBtn");
const copyCarBtn = $("#copyCarBtn");
const colorRow = $("#colorRow");

let modalCar = null;
let activeTab = "exterior";
let imgIndex = 0;

function updateColorUI() {
  if (!modalCar || !colorRow) return;
  const current = getCarColor(modalCar);
  $$(".colorBtn", colorRow).forEach((b) => {
    b.classList.toggle("active", b.dataset.color === current);
  });
}

colorRow?.addEventListener("click", (e) => {
  const btn = e.target.closest(".colorBtn");
  if (!btn || !modalCar) return;

  const color = btn.dataset.color;
  setCarColor(modalCar, color);
  updateColorUI();

  imgIndex = 0;
  updateGallery();

  renderInventory();
  renderHeroCarousel();

  renderFavorites();
});

function activeImages() {
  if (!modalCar) return [];
  const color = getCarColor(modalCar);
  const pack = modalCar.colors?.[color] || modalCar.colors?.black;
  if (!pack) return [];
  return activeTab === "exterior" ? pack.exterior : pack.interior;
}

function updateGallery() {
  const imgs = activeImages();
  const url = imgs[Math.max(0, Math.min(imgIndex, imgs.length - 1))];
  if (url) setBg(galleryImg, url);
  if (modalTitle) modalTitle.textContent = modalCar ? modalCar.model : "Car";
}

function setTab(tab) {
  activeTab = tab;
  imgIndex = 0;
  $$(".tab", tabs).forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === tab),
  );
  updateGallery();
}

function openCar(car) {
  modalCar = car;
  activeTab = "exterior";
  imgIndex = 0;

  if (detailName) detailName.textContent = car.model;
  if (detailDesc)
    detailDesc.textContent = `${car.brand} • ${car.year} • ${car.drivetrain}`;

  if (detailKV) {
    detailKV.innerHTML = `
      <div class="box"><b>Brand</b><span>${car.brand}</span></div>
      <div class="box"><b>Model</b><span>${car.model}</span></div>
      <div class="box"><b>Year</b><span>${car.year}</span></div>
      <div class="box"><b>Drivetrain</b><span>${car.drivetrain}</span></div>
    `;
  }

  updateColorUI();
  setTab("exterior");

  modal?.classList.add("show");
  modal?.setAttribute("aria-hidden", "false");
  if (!window.matchMedia("(max-width: 640px)").matches) {
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  modal?.classList.remove("show");
  modal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalCar = null;
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (!modal?.classList.contains("show")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

tabs?.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  setTab(btn.dataset.tab);
});

function step(dir) {
  const imgs = activeImages();
  if (imgs.length <= 1) return;
  imgIndex = (imgIndex + dir + imgs.length) % imgs.length;
  updateGallery();
}
prevImg?.addEventListener("click", () => step(-1));
nextImg?.addEventListener("click", () => step(1));

reserveBtn?.addEventListener("click", () => {
  if (!modalCar) return;
  closeModal();
  go("buying");
  const bfModel = $("#bfModel");
  if (bfModel) bfModel.value = modalCar.model;
  toast("Reserved: open buying form");
});

copyCarBtn?.addEventListener("click", async () => {
  if (!modalCar) return;
  try {
    await navigator.clipboard.writeText(modalCar.model);
    toast("Copied model name");
  } catch {
    toast("Copy not available");
  }
});

const heroCarousel = $("#heroCarousel");

function renderHeroCarousel() {
  if (!heroCarousel) return;
  heroCarousel.innerHTML = "";

  CARS.forEach((car) => {
    const card = document.createElement("div");
    card.className = "carouselCard";
    card.innerHTML = `
      <div class="carThumb"></div>
      <div class="carMeta">
        <b>${car.model}</b>
        <span>${car.highlight}</span>
        <em>${car.brand}</em>
      </div>
    `;

    const color = getCarColor(car);
    setBg(card.querySelector(".carThumb"), car.colors[color].exterior[0]);

    card.addEventListener("click", () => {
      go("available");
      openCar(car);
    });

    heroCarousel.appendChild(card);
  });
}

const bfModel = $("#bfModel");
if (bfModel) {
  bfModel.innerHTML = CARS.map(
    (c) => `<option value="${c.model}">${c.model}</option>`,
  ).join("");
}

window.addEventListener("scroll", () => {
  topbar?.classList.toggle("scrolled", window.scrollY > 10);
});

let io = null;
function observeReveals() {
  if (io) io.disconnect();
  const els = $$(".reveal");
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => {
    if (!el.classList.contains("in")) io.observe(el);
  });
}

function setLoggedIn(user) {
  localStorage.setItem("gm_user", JSON.stringify(user));
  syncAuthUI();
}

function getLoggedIn() {
  try {
    return JSON.parse(localStorage.getItem("gm_user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  apiRequest("logout").catch(() => {});
  localStorage.removeItem("gm_user");
  syncAuthUI();
  go("home");
  toast("Logged out");
}

function syncAuthUI() {
  const user = getLoggedIn();

  const signInLinks = $$('[data-route="signin"]');
  const signUpLinks = $$('[data-route="signup"]');

  signInLinks.forEach((a) => (a.style.display = user ? "none" : ""));
  signUpLinks.forEach((a) => (a.style.display = user ? "none" : ""));

  if (user) {
    $("#pName") && ($("#pName").textContent = user.name || "User");
    $("#pEmail") && ($("#pEmail").textContent = user.email || "—");
    $("#pStatus") && ($("#pStatus").textContent = "Signed In");
    $("#pSince") && ($("#pSince").textContent = user.since || "—");
  } else {
    $("#pName") && ($("#pName").textContent = "—");
    $("#pEmail") && ($("#pEmail").textContent = "—");
    $("#pStatus") && ($("#pStatus").textContent = "Guest");
    $("#pSince") && ($("#pSince").textContent = "—");
  }

  renderFavorites();
}

$("#profileBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  const user = getLoggedIn();
  go(user ? "profile" : "signin");
});

$("#signinForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = $("#siEmail")?.value?.trim() || "";
  const password = $("#siPass")?.value || "";

  const data = await apiRequest("login", {
    method: "POST",
    body: { email, password },
  });

  if (!data?.success) {
    toast(data?.message || "Login failed");
    return;
  }

  const u = data.user || null;
  if (u) {
    const since = u.created_at
      ? new Date(u.created_at).toLocaleDateString()
      : "";
    setLoggedIn({ ...u, since });
  }

  toast("Signed in");
  go("profile");
});

$("#signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("#suName")?.value?.trim() || "";
  const email = $("#suEmail")?.value?.trim() || "";
  const phone = $("#suPhone")?.value?.trim() || "";
  const password = $("#suPass")?.value || "";

  const data = await apiRequest("register", {
    method: "POST",
    body: { name, email, phone, password },
  });

  if (!data?.success) {
    toast(data?.message || "Registration failed");
    return;
  }

  const u = data.user || null;
  if (u) {
    const since = u.created_at
      ? new Date(u.created_at).toLocaleDateString()
      : "";
    setLoggedIn({ ...u, since });
  }

  toast("Account created");
  go("profile");
});

$("#logoutBtn")?.addEventListener("click", logout);

$("#contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("#cName")?.value?.trim() || "";
  const email = $("#cEmail")?.value?.trim() || "";
  const brand = $("#cBrand")?.value || "";
  const reason = $("#cReason")?.value || "";
  const message = $("#cMsg")?.value?.trim() || "";

  const subject = [brand, reason].filter(Boolean).join(" - ");

  const data = await apiRequest("contact", {
    method: "POST",
    body: { name, email, subject, message },
  });

  if (!data?.success) {
    toast(data?.message || "Could not send");
    return;
  }

  toast("Message sent");
  e.target.reset();
});

$("#buyingForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = $("#bfName")?.value?.trim() || "";
  const phone = $("#bfPhone")?.value?.trim() || "";
  const model = $("#bfModel")?.value || "";
  const plan = $("#bfPlan")?.value || "";
  const notes = $("#bfNotes")?.value?.trim() || "";

  const data = await apiRequest("reservation", {
    method: "POST",
    body: { name, phone, model, plan, notes },
  });

  if (!data?.success) {
    toast(data?.message || "Could not save");
    return;
  }

  toast("Reservation saved");
  e.target.reset();
});

$("#year") && ($("#year").textContent = new Date().getFullYear());

renderFilters();
renderInventory();
renderHeroCarousel();
observeReveals();
syncAuthUI();
routeFromHash();

apiRequest("session")
  .then((data) => {
    if (data?.success && data.user) {
      const u = data.user;
      const since = u.created_at
        ? new Date(u.created_at).toLocaleDateString()
        : "";
      setLoggedIn({ ...u, since });
    }
  })
  .catch(() => {});
