import React from "react";
import { useState } from "react";
import { Event } from "../components/Pie";
type ContextObj = {
  loading: boolean;
  setIsLoading: (arg: boolean) => void;
  createLinearGradient: () => void;
  linearGradientString: string;
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
  loading: false,
  setIsLoading: (arg: boolean) => {},
  createLinearGradient: () => {},
  linearGradientString: "",
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
  const [linearGradientString, setLinearGradientString] = useState(
    "linear-gradient(to right, #30115e 0%, #30115e 100%)"
  );
  const [loading, setIsLoading] = useState(false);

  const createLinearGradient = () => {
    const percentagesArr = data
      .map((elem) => {
        return {
          startPercentage: Math.round(elem.start / 14.4),
          endPercentage: Math.round(elem.end / 14.4),
        };
      })
      .sort((a, b) => a.startPercentage - b.startPercentage);
    let newString = "linear-gradient(to right";
    if (percentagesArr) {
      percentagesArr.forEach((elem, i) => {
        if (i + 1 < percentagesArr.length) {
          newString += `, red ${elem.startPercentage}%, red ${
            elem.endPercentage
          }%, #30115e ${elem.endPercentage}%, #30115e ${
            percentagesArr[i + 1].startPercentage
          }%`;
        } else {
          if (elem.endPercentage !== 100) {
            newString += `, red ${elem.startPercentage}%, red ${elem.endPercentage}%, #30115e ${elem.endPercentage}%, #30115e 100%`;
          } else {
            newString += `, red ${elem.startPercentage}%, red ${elem.endPercentage}%`;
          }
        }
      });
      setLinearGradientString(`${newString})`);
    }
  };

  const onlogin = (arg: string) => {
    setIsLoggedIn(true);
    setUid(arg);
  };
  const onlogout = () => {
    setIsLoggedIn(false);
    setUid("");
  };

  const contextValue = {
    loading,
    setIsLoading,
    createLinearGradient,
    linearGradientString,
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
