import { errorTypes } from "../models/error_types";


interface ICustomApiError{
  error_value: string,
  error_type: errorTypes,
  status_code: number
}

class CustomApiError implements ICustomApiError{
  error_value: string;
  error_type: errorTypes;
  status_code: number;

  constructor(error_value: string, error_type: errorTypes){
    this.error_type = error_type;
    this.error_value = error_value;
    this.status_code = statusCodeLoader(error_type);
  };

}

const error_handling_services =  function ({error_type, value}: {error_type: errorTypes, value?: string}): CustomApiError{
  let errorMessage  = {
    [errorTypes.invalidValue]: `invalid value: ${value}`,
    [errorTypes.dataNotFound]: `data not found: ${value}`,
    [errorTypes.logicalError]: `logical error: ${value}`,
    [errorTypes.authorizationError]: `authorization error at: ${value}`,
    [errorTypes.expiredRefreshToken]: `jwt refresh token expired so login required.`,
    [errorTypes.jwtError]: `authentication required(with json web token)`,
    [errorTypes.successfuly]: `successfuly`,
  }
  return new CustomApiError(value ?? error_type.toString(),error_type);
}



function statusCodeLoader(errorType: errorTypes): number{
  switch (errorType) {
    case errorTypes.authorizationError:
      return 401;
    case errorTypes.dataNotFound:
      return 444;
    case errorTypes.expiredRefreshToken:
      return 407;
    case errorTypes.invalidValue:
      return 400;
    case errorTypes.jwtError:
      return 412;
    case errorTypes.logicalError:
      return 416;
    case errorTypes.successfuly:
      return 200;
    default:
      return 200
  }
}

export {
  CustomApiError,
  error_handling_services
}