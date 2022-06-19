import AJV, {ValidateFunction} from "ajv/dist/2019";
import formats from "ajv-formats";
import APISchema from "@canopyinc/api-docs/dist/consolidated.json";

type THTTPMethod = "get" | "post" | "put" | "delete";

type TResource = "accounts";

type TStatusCode = 200 | 201 | 202 | 400 | 401 | 403 | 404 | 500;

const options = {
  // from @middy/validator code used in `canopy-api`:
  // "important for query string params"
  coerceTypes: false,
  allErrors: true,
  useDefaults: false,
  strict: false, // allow non-standard keywords; will break for "example" field
};

const AJVInstance = new AJV(options);
formats(AJVInstance);

const extractSchema = (method: THTTPMethod) => (path: string) => (statusCode: TStatusCode) => {
  return APISchema.paths[path][method].responses[statusCode].content["application/json"].schema;
};

const extractPostSchema = extractSchema("post");

// TODO: Add more schemas as needed

// accounts
const responseSchemaPostAccount = extractPostSchema("/accounts")(200);
const post_accounts = AJVInstance.compile(responseSchemaPostAccount);

const outputSchemaValidate: Partial<Record<`${THTTPMethod}_${TResource}`, ValidateFunction>> = {
  post_accounts,
};

// decorate a validator to throw if the API response structure does not comply
// with the JSON schema
function throwInvalid(schemaValidator: ValidateFunction) {
  return (obj) => {
    const isValid = schemaValidator(obj);
    if (!isValid) {
      throw schemaValidator.errors;
    }
    return isValid;
  };
}

// decorate each validator with {throwValid}
const outputSchemaValidateWithThrow: Partial<Record<`${THTTPMethod}_${TResource}`, ValidateFunction>> = Object.keys(
  outputSchemaValidate
).reduce((acc, validatorKey) => {
  acc[validatorKey] = throwInvalid(outputSchemaValidate[validatorKey]);
  return acc;
}, {});

export default outputSchemaValidateWithThrow;
