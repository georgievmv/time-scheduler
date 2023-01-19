import React from "react";
import { useState } from "react";
import { Event } from "../components/Pie";
type ContextObj = {
  setDate: (arg: string) => void;
  date: string;
  loading: boolean;
  setIsLoading: (arg: boolean) => void;
  adding: boolean;
  setAdding: (arg: boolean) => void;
  uid: string;
  onlogout: () => void;
  onlogin: (arg: string) => void;
  isLoggedIn: boolean;
  setData: (arg: Event[] | ((arg: Event[]) => Event[])) => void;
  data: Event[] | [];
};

export const Context = React.createContext<ContextObj>({
  setDate: (arg: string) => {},
  date: "",
  loading: false,
  setIsLoading: (arg: boolean) => {},
  adding: false,
  setAdding: () => {},
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
  const [adding, setAdding] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const today = `${new Date().getFullYear()}-${
    new Date().getMonth().toString().length === 1
      ? "" + new Date().getMonth() + 1
      : new Date().getMonth() + 1
  }-${new Date().getDate()}`;
  const [date, setDate] = useState(today);

  const onlogin = (arg: string) => {
    setIsLoggedIn(true);
    setUid(arg);
  };
  const onlogout = () => {
    setIsLoggedIn(false);
    setUid("");
  };

  const contextValue = {
    setDate,
    date,
    loading,
    setIsLoading,
    adding,
    setAdding,
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
