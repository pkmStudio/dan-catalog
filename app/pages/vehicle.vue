<template>
  <main>
    <PageHero title="Подбор запчастей по автомобилю" subtitle="Выберите марку, модель и модификацию автомобиля"
              :crumbs="[{label:'Подбор по авто'}]"/>
    <section class="content-section">
      <VehicleSelector/>
    </section>
  </main>
</template>
