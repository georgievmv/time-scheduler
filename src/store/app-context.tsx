import React from "react";
import { useState } from "react";
import { EventDate } from "../types/types";
type ContextObj = {
  setDate: (arg: string) => void;
  selectedDate: string;
  loading: boolean;
  setIsLoading: (arg: boolean) => void;
  adding: boolean;
  setAdding: (arg: boolean) => void;
  uid: string;
  onLogout: () => void;
  onLogin: (arg: string) => void;
  isLoggedIn: boolean;
  setData: (arg: EventDate[] | ((arg: EventDate[]) => EventDate[])) => void;
  data: EventDate[] | [];
};

export const Context = React.createContext<ContextObj>({
  setDate: (arg: string) => {},
  selectedDate: "",
  loading: false,
  setIsLoading: (arg: boolean) => {},
  adding: false,
  setAdding: () => {},
  uid: "",
  onLogout: () => {},
  onLogin: (arg: string) => {},
  isLoggedIn: false,
  setData: (arg: EventDate[] | ((arg: EventDate[]) => EventDate[])) => {},
  data: [],
});

const ContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [data, setData] = useState<EventDate[] | []>([]);
  const [uid, setUid] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const today = `${new Date().getFullYear()}-${
    new Date().getMonth().toString().length === 1
      ? "0" + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${
    new Date().getDate().toString().length === 1 ? "0" + new Date().getDate() : new Date().getDate()
  }`;
  //TODO:move up with other states
  const [selectedDate, setDate] = useState(today);
  const onLogin = (arg: string) => {
    setIsLoggedIn(true);
    setUid(arg);
  };
  const onLogout = () => {
    setIsLoggedIn(false);
    setUid("");
  };

  const contextValue = {
    setDate,
    selectedDate,
    loading,
    setIsLoading,
    adding,
    setAdding,
    uid,
    onLogout,
    onLogin,
    isLoggedIn,
    setData,
    data,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};
export default ContextProvider;
