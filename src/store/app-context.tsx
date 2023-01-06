import React from "react";
import { useState } from "react";
import { Event } from "../components/Pie";
type ContextObj = {
  uid: string;
  onlogout: () => void;
  onlogin: (arg: string) => void;
  isLoggedIn: boolean;
  setData: (arg: Event[] | ((arg: Event[]) => Event[])) => void;
  data: Event[] | [];
};

export const Context = React.createContext<ContextObj>({
  uid: "",
  onlogout: () => {},
  onlogin: (arg: string) => {},
  isLoggedIn: false,
  setData: (arg: Event[] | ((arg: Event[]) => Event[])) => {},
  data: [],
});

const ContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [data, setData] = useState<Event[] | []>([]);
  const [uid, setUid] = useState<string>("");
  const onlogin = (arg: string) => {
    setIsLoggedIn(true);
    setUid(arg);
  };
  const onlogout = () => {
    setIsLoggedIn(false);
    setUid("");
  };

  const contextValue = {
    uid,
    onlogout,
    onlogin,
    isLoggedIn,
    setData,
    data,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
