# DAN Catalog

Nuxt 4 каталог DAN с server-side BFF. Браузер обращается только к same-origin `/api`; адрес
автомобильного справочника и межсервисный ключ остаются в приватном Nitro runtime config.

## Локальный запуск

Требуется Node.js 20+.

```bash
npm install
cp .env.example .env
npm run dev
```

Приложение доступно на `http://127.0.0.1:3000`. В `.env` настройте подключение к запущенному
`vehicles-ddd`:

```dotenv
NUXT_CATALOG_BACKEND_BASE_URL=http://127.0.0.1:8080
NUXT_CATALOG_BACKEND_API_KEY=replace-locally
NUXT_CATALOG_BACKEND_TIMEOUT_MS=3000
```

`NUXT_CATALOG_BACKEND_API_KEY` должен совпадать с `DAN_CATALOG_READ_API_KEY` на backend.
Настоящие credentials не коммитятся и не передаются как `NUXT_PUBLIC_*`.

## Автомобильный BFF

| Browser/SSR → Nitro                             | Nitro → vehicles-ddd                              |
| ----------------------------------------------- | ------------------------------------------------- |
| `GET /api/vehicles/manufacturers`               | `GET /api/v1/catalog/manufacturers`               |
| `GET /api/vehicles/manufacturers/{id}/vehicles` | `GET /api/v1/catalog/manufacturers/{id}/vehicles` |
| `GET /api/vehicles/{id}/modifications`          | `GET /api/v1/catalog/vehicles/{id}/modifications` |
| `GET /api/vehicles/modifications/{id}`          | `GET /api/v1/catalog/modifications/{id}`          |

Nitro добавляет `X-Service-Key`, проверяет upstream JSON и преобразует snake_case в стабильный
camelCase contract. Production fallback на локальные автомобильные fixtures отсутствует.
Категории по автомобилю и применяемость товара не приписываются этому справочнику без отдельного
подтверждённого источника данных.

## Проверка

```bash
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Controlled smoke выполняется только явно, при запущенных Nitro и backend:

```bash
LIVE_VEHICLE_BACKEND=1 npm run test -- --project integration
```

Backend contract отдельно проверяется в checkout `vehicles-ddd`:

```bash
docker compose exec -T app php artisan test --filter=VehicleCatalogRestApiTest
```
