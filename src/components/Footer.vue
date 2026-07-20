<template>
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <div class="brand footer-brand">
                        <span class="brand-mark"><span class="material-icons">local_florist</span></span> Rimbun
                    </div>
                    <p class="footer-text">Menghadirkan keindahan bunga segar langsung dari petani lokal Indonesia ke
                        tangan Anda. Setiap rangkaian dibuat dengan cinta.</p>
                    <div class="footer-social">
                        <a href="#" aria-label="Instagram"><span class="material-icons">instagram</span></a>
                        <a href="#" aria-label="Facebook"><span class="material-icons">facebook</span></a>
                        <a href="#" aria-label="Twitter"><span class="material-icons">twitter</span></a>
                    </div>
                </div>
                <div class="footer-col">
                    <h5>Belanja</h5>
                    <ul>
                        <li><router-link to="/shop">Semua Produk</router-link></li>
                        <li><router-link to="/shop?cat=Bouquet">Bouquet</router-link></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Perusahaan</h5>
                    <ul>
                        <li><router-link to="/about">Tentang Kami</router-link></li>
                        <li><a href="#">Karir</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h5>Bantuan</h5>
                    <ul>
                        <li><router-link to="/contact">Hubungi Kami</router-link></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <span>© 2024 Rimbun. Dibuat dengan cinta di Indonesia.</span>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background: #1E2B1F;
    color: #B5C9B5;
    padding: 70px 0 28px;
    margin-top: 60px;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 50px;
}

.footer-brand {
    color: white;
    margin-bottom: 16px;
}

.footer-text {
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 20px;
}

.footer-social {
    display: flex;
    gap: 10px;
}

.footer-social a {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: grid;
    place-items: center;
    transition: var(--transition);
    color: #B5C9B5;
}

.footer-social a:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-3px);
}

.footer-col h5 {
    color: white;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.footer-col ul {
    list-style: none;
}

.footer-col li {
    margin-bottom: 10px;
}

.footer-col a {
    font-size: 14px;
    transition: var(--transition);
}

.footer-col a:hover {
    color: var(--primary-soft);
    padding-left: 4px;
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>