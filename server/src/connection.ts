import { connect } from "mongoose";

export const ConnectDB = (url: string) => {
  connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
};
