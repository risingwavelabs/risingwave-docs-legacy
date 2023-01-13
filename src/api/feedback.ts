import Api from './api';

type DefaultResponse = {
  msg: string;
  success: boolean;
  data: any;
};

export async function sendFeedback(description, like) {
  await Api.post('/feedbacks', {
    description: description,
    like: like,
  });
}

export function postNotification(email, note) {
  return Api.post<DefaultResponse>('/notify', {
    email: email,
    note: note,
  });
}
