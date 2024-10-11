using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;
using System.Net;

namespace PrefeituraCachoeiro.TratadorControlador.Tratadores
{
    [ExcludeFromCodeCoverage]
    public static class ExceptionHandler
    {
        public async static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = exception switch
            {
                _ => HttpStatusCode.InternalServerError,
            };
            await context.HttpErrorAnswer(statusCode, exception.Message);
        }

        private static Task HttpErrorAnswer(this HttpContext context, HttpStatusCode code, string message)
        {
            var result = JsonConvert.SerializeObject(new { error = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}