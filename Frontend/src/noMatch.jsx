import React, { useEffect } from "react";

export default function NoMatch() {
  //executes only once - on initial render == componentDidMount method
  useEffect(() => {
    //ex:- load data from database
    document.title = "Page not Found!";
  }, []);

  return <>Page not found!</>;
}
