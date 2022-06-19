let dateFormattedOptions;
export class Helper {
  //let dateFormattedOptions = { year: "numeric", month: "short", day: "numeric" };
  centsTODollar = (toBeConverted) => {
    return new Promise((resolve) => {
      const dollars = parseInt(toBeConverted) / 100;
      const dollarFormat = dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });
      resolve(dollarFormat);
    });
  };
  getAutoPayUIValue = (autoPayEnabled) => {
    return new Promise((resolve) => {
      let autoPayValue;
      if (autoPayEnabled === true) {
        autoPayValue = "Enabled";
      } else {
        autoPayValue = "Disabled";
      }
      resolve(autoPayValue);
    });
  };
  dateToDefaultUIFormat = (dateInOlsonFormat) => {
    return new Promise((resolve) => {
      const date = new Date(dateInOlsonFormat);
      const formattedDate = date.toLocaleDateString("en-US");
      resolve(formattedDate);
    });
  };
  dateToShortUIFormat = (dateInOlsonFormat) => {
    return new Promise((resolve) => {
      const date = new Date(dateInOlsonFormat);
      //date.setDate(date.getDate() -1);
      dateFormattedOptions = { year: "numeric", month: "short", day: "2-digit" };
      const formattedDate = date.toLocaleDateString("en-US", dateFormattedOptions);
      resolve(formattedDate);
    });
  };
}

export const helper = new Helper();
