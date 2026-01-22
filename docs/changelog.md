# Changelog

## [2026-01-22] - Implementasi Frontend Admin & UI Components

### Added
- **UI Components (shadcn/ui)**
  - `dialog.tsx` - Modal dialog
  - `toast.tsx` & `toaster.tsx` - Toast notifications
  - `radio-group.tsx` - Radio button group
  - `scroll-area.tsx` - Scrollable area
  - `table.tsx` - Data table
  - `badge.tsx` - Status badges
  - `textarea.tsx` - Text area input
  - `progress.tsx` - Progress bar

- **Hooks**
  - `hooks/use-toast.ts` - Toast state management

- **Layout Components**
  - `components/layout/header.tsx`
  - `components/layout/footer.tsx`
  - `components/admin/sidebar.tsx`

- **Admin Pages**
  - `app/(admin)/layout.tsx` - Admin layout dengan sidebar
  - `app/(admin)/dashboard/page.tsx` - Dashboard overview
  - `app/(admin)/tests/page.tsx` - List tes
  - `app/(admin)/tests/new/page.tsx` - Buat tes baru
  - `app/(admin)/tests/[testId]/page.tsx` - Detail & edit tes
  - `app/(admin)/tests/[testId]/questions/page.tsx` - List soal
  - `app/(admin)/tests/[testId]/questions/new/page.tsx` - Tambah soal
  - `app/(admin)/users/page.tsx` - Manajemen user
  - `app/(admin)/results/page.tsx` - Lihat hasil tes

- **Auth Pages**
  - `app/(auth)/layout.tsx`
  - `app/(auth)/admin/login/page.tsx` - Login admin

- **API Routes**
  - `app/api/cbt/result/[resultId]/route.ts` - Public result endpoint

### Changed
- Updated `app/layout.tsx` - Added Toaster, updated metadata
- Updated `features/test/repositories/test.repository.ts` - Include questions & results relations
- Updated `features/question/services/question.service.ts` - Auto-order for new questions
- Updated `app/api/admin/tests/[testId]/route.ts` - Added PATCH method
- Updated `app/(cbt)/result/[resultId]/page.tsx` - Fetch from API instead of mock

### Dependencies Added
- `@radix-ui/react-dialog`
- `@radix-ui/react-radio-group`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-toast`
- `@radix-ui/react-progress`
