import { reactive } from "vue";

// Catatan: Ini adalah simulasi autentikasi di sisi client (tanpa backend nyata),
// mengikuti pola CRUD + fetch simulation seperti apiService.js (pertemuan 16-17).
// Untuk kebutuhan produksi sungguhan, password WAJIB di-hash di backend (bcrypt dll),
// bukan disimpan polos seperti di sini.

const USERS_KEY = "rimbun-users";
const SESSION_KEY = "rimbun-current-user";

// Email pemilik toko (hardcode). Siapa pun yang register/login pakai email ini
// otomatis dapat role 'pemilik', tidak peduli role apa yang dipilih di form.
// Semua email lain otomatis 'pembeli'. Ini mencegah orang sembarangan daftar
// jadi pemilik lewat form register.
const OWNER_EMAIL = "isayaaa0512@gmail.com";

function resolveRole(email) {
  return email.trim().toLowerCase() === OWNER_EMAIL ? "pemilik" : "pembeli";
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export const authStore = reactive({
  users: loadUsers(),
  currentUser: loadSession(),
  loading: false,
  error: null,

  get isLoggedIn() {
    return !!this.currentUser;
  },
  get isOwner() {
    return this.currentUser?.role === "pemilik";
  },

  saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  },
  saveSession() {
    if (this.currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // Integrasi API (simulasi): Register user baru
  // role TIDAK diambil dari form — otomatis ditentukan dari email lewat resolveRole().
  // Cuma email OWNER_EMAIL yang bisa jadi 'pemilik', selain itu selalu 'pembeli'.
  async register({ name, email, password }) {
    this.loading = true;
    this.error = null;
    try {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          const exists = this.users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase(),
          );
          if (exists) {
            reject(new Error("Email sudah terdaftar"));
            return;
          }
          const newUser = {
            id: Date.now(),
            name,
            email,
            password, // demo only — di aplikasi nyata harus di-hash di backend
            role: resolveRole(email),
            createdAt: new Date().toISOString(),
          };
          this.users.push(newUser);
          this.saveUsers();

          // Auto login setelah register
          const { password: _pw, ...safeUser } = newUser;
          this.currentUser = safeUser;
          this.saveSession();

          resolve(safeUser);
        }, 700);
      });
    } catch (e) {
      this.error = e.message;
      throw e;
    } finally {
      this.loading = false;
    }
  },

  // Integrasi API (simulasi): Login user
  async login({ email, password }) {
    this.loading = true;
    this.error = null;
    try {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          const found = this.users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
          );
          if (!found) {
            reject(new Error("Email atau password salah"));
            return;
          }

          // Self-healing: kalau ini akun OWNER_EMAIL tapi role-nya kesimpen
          // bukan 'pemilik' (misal data lama sebelum fitur ini ada), betulkan.
          const correctRole = resolveRole(found.email);
          if (found.role !== correctRole) {
            found.role = correctRole;
            this.saveUsers();
          }

          const { password: _pw, ...safeUser } = found;
          this.currentUser = safeUser;
          this.saveSession();
          resolve(safeUser);
        }, 700);
      });
    } catch (e) {
      this.error = e.message;
      throw e;
    } finally {
      this.loading = false;
    }
  },

  // Integrasi API (simulasi): Update data profil user (pola sama seperti updateUser() di modul 17)
  async updateProfile({ name, email }) {
    this.loading = true;
    this.error = null;
    try {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          const idx = this.users.findIndex((u) => u.id === this.currentUser.id);
          if (idx === -1) {
            reject(new Error("User tidak ditemukan"));
            return;
          }
          // Cek apakah email baru sudah dipakai user lain
          const emailTaken = this.users.some(
            (u) => u.id !== this.currentUser.id && u.email.toLowerCase() === email.toLowerCase(),
          );
          if (emailTaken) {
            reject(new Error("Email sudah digunakan akun lain"));
            return;
          }

          this.users[idx] = { ...this.users[idx], name, email };
          this.saveUsers();

          const { password: _pw, ...safeUser } = this.users[idx];
          this.currentUser = safeUser;
          this.saveSession();

          resolve(safeUser);
        }, 700);
      });
    } catch (e) {
      this.error = e.message;
      throw e;
    } finally {
      this.loading = false;
    }
  },

  // Integrasi API (simulasi): Hapus akun (pola sama seperti deleteUser() di modul 17)
  async deleteAccount() {
    this.loading = true;
    try {
      return await new Promise((resolve) => {
        setTimeout(() => {
          this.users = this.users.filter((u) => u.id !== this.currentUser.id);
          this.saveUsers();
          this.currentUser = null;
          this.saveSession();
          resolve(true);
        }, 700);
      });
    } finally {
      this.loading = false;
    }
  },

  logout() {
    this.currentUser = null;
    this.saveSession();
  },
});
