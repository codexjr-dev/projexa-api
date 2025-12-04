export default abstract class CustomError extends Error {
    public readonly code?: string;
}
