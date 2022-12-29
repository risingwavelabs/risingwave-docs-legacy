import Api from "./api";

type DefaultResponse = {
  msg: string;
  success: boolean;
  data: any;
};

type GetLikeResponse = {
  name: string;
  like: number;
};

export async function sendFeedback(description, like) {
  await Api.post("/feedbacks", {
    description: description,
    like: like,
  });
}

export function postNotification(email, note) {
  return Api.post<DefaultResponse>("/notify", {
    email: email,
    note: note,
  });
}

export function postLike(name: string) {
  return Api.post<DefaultResponse>("/like", {
    name: name,
  });
}

export function getLike(name: string) {
  return Api.get("/like", {
    params: {
      name: name,
    },
  });
}
