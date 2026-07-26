<script setup lang="ts">
import { Handshake, SearchCheck, ShieldCheck } from '@lucide/vue'
</script>

<template>
  <main>
    <PageHero
      title="Запчасти, которым доверяют"
      subtitle="Создаём надёжные решения для комфортного и безопасного движения."
      :crumbs="[{ label: 'О компании' }]"
    />
    <section class="about-content">
      <div class="story">
        <h2>Мы делаем сложный выбор простым</h2>
        <p>
          DAN — российский бренд автомобильных компонентов. Мы отбираем проверенные материалы,
          контролируем производство и тестируем каждую линейку продукции перед выходом на рынок.
        </p>
        <p>
          Наша цель — чтобы владелец автомобиля быстро находил совместимую деталь и был уверен в её
          качестве. Поэтому мы развиваем электронный каталог с точным подбором по автомобилю,
          артикулу и OEM-номеру.
        </p>
        <div class="values">
          <div>
            <ShieldCheck :size="24" />
            <b>Контроль качества</b><span>Проверяем продукцию на каждом этапе</span>
          </div>
          <div>
            <SearchCheck :size="24" />
            <b>Точный подбор</b><span>Подробная применяемость и OEM-данные</span>
          </div>
          <div>
            <Handshake :size="24" />
            <b>Ответственный сервис</b><span>Помогаем до и после покупки</span>
          </div>
        </div>
      </div>
      <aside class="facts">
        <h3>DAN в цифрах</h3>
        <div><b>10+</b><span>лет развиваем продукт</span></div>
        <div><b>1 500+</b><span>позиций в каталоге</span></div>
        <div><b>24/7</b><span>доступ к точному подбору</span></div>
      </aside>
    </section>
  </main>
</template>
