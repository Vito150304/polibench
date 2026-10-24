export const metrics_by_task = {
  ranking: [
    { value: 'ndcg@10',   label: 'NDCG@10',   direction: 'max' },
    { value: 'recall@20', label: 'Recall@20', direction: 'max' },
    { value: 'hit@10',    label: 'Hit@10',    direction: 'max' },
  ],
  rating_prediction: [
    { value: 'rmse', label: 'RMSE (lower is better)', direction: 'min' },
    { value: 'mae',  label: 'MAE (lower is better)',  direction: 'min' },
  ],
};