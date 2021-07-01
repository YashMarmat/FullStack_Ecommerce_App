export const dateCheck = (param) => {
    //console.log("dateCheck ===>", param)
    // Example: 2021-01-12
    const dateValue = param.slice(8, 10);
    const monthValue = param.slice(5, 7);
    const yearValue = param.slice(0, 4);
  
    switch (monthValue) {
      case "01":
        return `${dateValue} January ${yearValue}`;
      case "02":
        return `${dateValue} Feburary ${yearValue}`;
      case "03":
        return `${dateValue} March ${yearValue}`;
      case "04":
        return `${dateValue} April ${yearValue}`;
      case "05":
        return `${dateValue} May ${yearValue}`;
      case "06":
        return `${dateValue} June ${yearValue}`;
      case "07":
        return `${dateValue} July ${yearValue}`;
      case "08":
        return `${dateValue} August ${yearValue}`;
      case "09":
        return `${dateValue} September ${yearValue}`;
      case "10":
        return `${dateValue} October ${yearValue}`;
      case "11":
        return `${dateValue} November ${yearValue}`;
      case "12":
        return `${dateValue} December ${yearValue}`;
      default:
        return null;
    }
  };
