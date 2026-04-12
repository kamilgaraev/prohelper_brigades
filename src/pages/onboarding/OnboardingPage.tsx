import { BrigadeProfileForm } from '@/components/BrigadeProfileForm';

export function OnboardingPage() {
  return (
    <BrigadeProfileForm
      title="Онбординг бригады"
      subtitle="Заполните профиль, чтобы пройти модерацию и стать доступными для приглашений на объекты."
      redirectAfterSave="/cabinet"
      redirectAfterReview="/cabinet"
    />
  );
}
