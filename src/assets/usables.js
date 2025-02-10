const formatDate = (isoDate) => {
    const date = new Date(isoDate);
  
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date).replace(",", "").toUpperCase();
  };

  


  export {formatDate};