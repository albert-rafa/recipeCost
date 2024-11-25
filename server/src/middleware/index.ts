import { params, body } from "./validationMiddleware";
import { errorHandler } from "./errorMiddleware";

export const validation = { params, body };
export { errorHandler };
