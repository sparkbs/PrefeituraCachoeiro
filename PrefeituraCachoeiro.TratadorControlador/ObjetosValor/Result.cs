using Microsoft.AspNetCore.Mvc;

namespace PrefeituraCachoeiro.TratadorControlador.ObjetosValor
{
    public class Result<T> where T : class
    {
        public T Data { get; private set; }
        public Error Error { get; init; }
        public bool IsSuccessful => Data is not null;
        public bool HasError => Error is not null;

        private Result(T data)
        {
            Data = data;
        }

        private Result(Error error)
        {
            Error = error;
        }

        public static Result<T> Success(T data)
        {
            return new Result<T>(data);
        }

        public static Result<T> Failure(Error error)
        {
            return new Result<T>(error);
        }

        public IActionResult Match(
          Func<T, IActionResult> onSuccess,
          Func<Error, IActionResult> onFailure,
          T data = null,
          Error error = null)
        {
            return IsSuccessful ? onSuccess(data ?? Data) : onFailure(error ?? Error);
        }
    }
}
