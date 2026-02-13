import { deleteBet, updateBet } from "@/api/bets";
import type { UpdateBetPayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBetMutations = () => {
    const queryClient = useQueryClient()

    const updateMutation =
        useMutation({
            mutationFn: ({ id, data }: { id: number, data: UpdateBetPayload }) =>
                updateBet(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['bets'] });
            },
        })

    const deleteMutation =
        useMutation({
            mutationFn: deleteBet,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['bets'] });
            },
        })

    return { updateMutation, deleteMutation }
};

