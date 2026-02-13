import { createVote, deleteVote, updateVote } from "@/api/votes";
import type { CreateVotePayload, UpdateVotePayload } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useVoteMutations = () => {
    const queryClient = useQueryClient()
    const mutationCreateVote =
        useMutation({
            mutationFn: ({ betId, data }: { betId: number; data: CreateVotePayload }) =>
                createVote(betId, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['votes'] });
                queryClient.invalidateQueries({ queryKey: ['bets'] });
            },
        })

    const mutationDeleteVote =
        useMutation({
            mutationFn: deleteVote,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['votes'] });
                queryClient.invalidateQueries({ queryKey: ['bets'] });
            },
        })

    const mutationChangeVoteChoice =
        useMutation({
            mutationFn: ({ id, data }: { id: number; data: UpdateVotePayload }) =>
                updateVote(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['votes'] });
                queryClient.invalidateQueries({ queryKey: ['bets'] });
            },
        })

    return { mutationCreateVote, mutationDeleteVote, mutationChangeVoteChoice }
};










