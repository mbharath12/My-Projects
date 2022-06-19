export class JSONUpdater {
  updateJSON(oldFile, newFile, fieldName, fieldValue) {
    cy.readFile(oldFile).then((data) => {
      const keys = Object.keys(data);
      if (keys.includes(fieldName)) {
        data[fieldName] = fieldValue;
      } else {
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]][0] && typeof data[keys[i]][0] == "object" && data[keys[i]][0][fieldName]) {
            data[keys[i]][0][fieldName] = fieldValue;
          }
        }

        for (let i = 0; i < keys.length; i++) {
          if (Object.keys(data[keys[i]]) && Object.keys(data[keys[i]])[0] !== "0") {
            const subKeys = Object.keys(data[keys[i]]);

            if (subKeys.includes(fieldName)) {
              data[keys[i]][fieldName] = fieldValue;
              break;
            } else {
              for (let j = 0; j < subKeys.length; j++) {
                if (Object.keys(data[keys[i]][subKeys[j]]) && Object.keys(data[keys[i]][subKeys[j]])[0] !== "0") {
                  const subkeys2 = Object.keys(data[keys[i]][subKeys[j]]);
                  if (subkeys2.includes(fieldName)) {
                    data[keys[i]][subKeys[j]][fieldName] = fieldValue;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      cy.writeFile(newFile, JSON.stringify(data));
    });
  }

  deleteJSON(oldFile, newFile, fieldName) {
    cy.readFile(oldFile).then((data) => {
      const keys = Object.keys(data);
      if (keys.includes(fieldName)) {
        //data[fieldName] = fieldValue;
        delete data[fieldName];
      } else {
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]][0] && typeof data[keys[i]][0] == "object" && data[keys[i]][0][fieldName]) {
            //data[keys[i]][0][fieldName] = fieldValue;
            delete data[keys[i]][0][fieldName];
          }
        }
        for (let i = 0; i < keys.length; i++) {
          if (Object.keys(data[keys[i]]) && Object.keys(data[keys[i]])[0] !== "0") {
            const subKeys = Object.keys(data[keys[i]]);

            if (subKeys.includes(fieldName)) {
              //data[keys[i]][fieldName] = fieldValue;
              delete data[keys[i]][fieldName];
              break;
            } else {
              for (let j = 0; j < subKeys.length; j++) {
                if (Object.keys(data[keys[i]][subKeys[j]]) && Object.keys(data[keys[i]][subKeys[j]])[0] !== "0") {
                  const subkeys2 = Object.keys(data[keys[i]][subKeys[j]]);
                  if (subkeys2.includes(fieldName)) {
                    //data[keys[i]][subKeys[j]][fieldName] = fieldValue;
                    delete data[keys[i]][subKeys[j]][fieldName];
                    break;
                  }
                }
              }
            }
          }
        }
      }
      cy.writeFile(newFile, JSON.stringify(data));
    });
  }
}
export const jsonUpdater = new JSONUpdater()
