<template>
    <article class="product-card" v-fade-in>
        <div class="product-img-wrap">
            <img :src="product.image" :alt="product.name" loading="lazy" />
            <span v-if="product.tag" class="product-tag" :class="{ new: product.tag === 'new' }">
                {{ product.tag === 'new' ? 'Baru' : 'Terlaris' }}
            </span>
            <button class="product-fav" :class="{ active: isFav }" @click="emit('toggle-fav', product)">
                <span class="material-icons">{{ isFav ? 'favorite' : 'favorite_border' }}</span>
            </button>
            <div class="product-quick">
                <button class="btn btn-primary" @click="emit('add-to-cart', product)">
                    <span class="material-icons" style="font-size:16px">add_shopping_cart</span> Keranjang
                </button>
                <button class="btn btn-ghost" @click="emit('view-detail', product)">Detail</button>
            </div>
        </div>
        <div class="product-body">
            <div class="product-cat">{{ product.category }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-foot">
                <div>
                    <div class="product-price" v-currency="product.price"></div>
                    <div v-if="product.oldPrice"
                        style="font-size:12px;color:var(--text-muted);text-decoration:line-through"
                        v-currency="product.oldPrice"></div>
                </div>
                <div class="product-rating">
                    <span class="material-icons">star</span> {{ product.rating }}
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>
// Properties on Vue: defineProps & defineEmits
import { computed } from 'vue'
import { favoriteStore } from '../stores/favoriteStore'

const props = defineProps({
    product: { type: Object, required: true }
})

const emit = defineEmits(['add-to-cart', 'view-detail', 'toggle-fav'])

const isFav = computed(() => favoriteStore.has(props.product.id))
</script>

<style scoped>
.product-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
}

.product-img-wrap {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--bg-alt);
}

.product-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.product-card:hover .product-img-wrap img {
    transform: scale(1.06);
}

.product-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    background: var(--secondary);
    color: white;
}

.product-tag.new {
    background: var(--primary);
}

.product-fav {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: grid;
    place-items: center;
    color: var(--text-muted);
    transition: var(--transition);
}

.product-fav.active {
    color: var(--secondary);
}

.product-quick {
    position: absolute;
    bottom: -50px;
    left: 12px;
    right: 12px;
    background: white;
    padding: 10px;
    border-radius: 12px;
    display: flex;
    gap: 8px;
    transition: var(--transition);
    box-shadow: var(--shadow);
}

.product-card:hover .product-quick {
    bottom: 12px;
}

.product-quick .btn {
    flex: 1;
    padding: 9px;
    font-size: 13px;
}

.product-body {
    padding: 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-cat {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 6px;
}

.product-name {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
}

.product-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 14px;
    flex: 1;
}

.product-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.product-price {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-dark);
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--text-muted);
}

.product-rating .material-icons {
    font-size: 16px;
    color: var(--accent);
}
</style>