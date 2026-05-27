import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMealHistory } from "../services/api";
import { notify } from "../store/notificationStore";

type UseDeleteMealHistoryOptions = {
  onSuccess?: (mealId: string) => void;
  successMessage?: string;
};

export function useDeleteMealHistory(options: UseDeleteMealHistoryOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (mealId: string) => deleteMealHistory(mealId),
    onSuccess: (_data, mealId) => {
      queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
      queryClient.invalidateQueries({ queryKey: ["meal", mealId] });
      notify.success(options.successMessage ?? "Usunięto przepis z historii.");
      options.onSuccess?.(mealId);
    },
    onError: (err) => {
      notify.error(
        err instanceof Error
          ? err.message
          : "Nie udało się usunąć przepisu.",
        "Błąd usuwania",
      );
    },
  });

  return {
    ...mutation,
    deleteMeal: mutation.mutate,
  };
}
