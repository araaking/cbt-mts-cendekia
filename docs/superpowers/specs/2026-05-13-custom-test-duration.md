# Custom Test Duration UX

**Date**: 2026-05-13
**Status**: Approved → Implementing

## Problem
Admin form "Buat Tes Baru" uses a plain number input with `defaultValue="60"` for duration. Admins don't realize they can change it — looks like a hardcoded value.

## Solution
Replace plain number input with a `Select` dropdown containing preset durations.

## Changes

### 1. Form Buat Tes Baru (`app/(admin)/tests/new/page.tsx`)
- Replace `<Input type="number">` with `<Select>` dropdown
- Options: 15, 30, 45, 60, 90, 120, 180 menit
- Default: 90 menit
- Form submit: `parseInt(formData.get("duration"))` — no change needed

### 2. Form Edit Tes (`app/(admin)/tests/[testId]/page.tsx`)
- Same: replace `<Input type="number">` with `<Select>` dropdown
- Default value: `test.duration` (current saved value)
- Still disabled when test has results (`hasResults`)

### 3. No changes needed:
- Database (`duration Int`) — unchanged
- API routes — unchanged (pass-through)
- Timer component — unchanged (dynamic `durationMinutes` prop)
- Exam page — unchanged (reads from `session.result.test.duration`)
- Test lists — unchanged (display `{test.duration} menit`)

## Components Used
- `@/components/ui/select` (shadcn/ui Select)
- `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
